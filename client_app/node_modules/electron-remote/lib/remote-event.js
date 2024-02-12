'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromRemoteWindow = fromRemoteWindow;

var _electron = require('electron');

var _Observable = require('rxjs/Observable');

var _Subscription = require('rxjs/Subscription');

require('rxjs/add/observable/throw');

require('rxjs/add/observable/fromEvent');

require('rxjs/add/operator/do');

require('rxjs/add/operator/publish');

const isBrowser = process.type === 'browser';

if (!isBrowser) {
  _electron.remote.require(require.resolve('./remote-event-browser'));
}

const d = require('debug')('remote-event');

/**
 * Safely subscribes to an event on a BrowserWindow or its WebContents. This
 * method avoids the "remote event listener" Electron issue.
 *
 * @param browserWindow  BrowserWindow   - the window to listen to
 * @param event  String  - The event to listen to
 * @param onWebContents  Boolean  - If true, the event is on the window's
 *                                  WebContents, not on the window itself.
 *
 * @returns Observable<Object>  - an Observable representing the event.
 *                                Unsubscribing from the Observable will
 *                                remove the event listener.
 */
function fromRemoteWindow(browserWindowOrWebView, event) {
  let onWebContents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  let ctorName = Object.getPrototypeOf(browserWindowOrWebView).constructor.name;

  if (isBrowser) {
    if (onWebContents) {
      let wc;
      if (ctorName === 'WebContents') {
        wc = browserWindowOrWebView;
      } else {
        wc = 'webContents' in browserWindowOrWebView ? browserWindowOrWebView.webContents : browserWindowOrWebView.getWebContents();
      }
      return _Observable.Observable.fromEvent(wc, event, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return args;
      });
    } else {
      _Observable.Observable.fromEvent(browserWindowOrWebView, event, function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return args;
      });
    }
  }

  if ((ctorName === 'webview' || ctorName === 'WebContents') && !onWebContents) {
    throw new Error("WebViews and WebContents can only be used with onWebContents=true");
  }

  let type = onWebContents ? 'webcontents' : 'window';
  let id;
  if (onWebContents) {
    if (ctorName === 'WebContents') {
      id = browserWindowOrWebView.id;
    } else {
      id = ('webContents' in browserWindowOrWebView ? browserWindowOrWebView.webContents : browserWindowOrWebView.getWebContents()).id;
    }
  } else {
    id = browserWindowOrWebView.id;
  }

  const key = `electron-remote-event-${type}-${id}-${event}-${_electron.remote.getCurrentWebContents().id}`;

  d(`Subscribing to event with key: ${key}`);

  var _ipcRenderer$sendSync = _electron.ipcRenderer.sendSync('electron-remote-event-subscribe', { type, id, event, onWebContents });

  let error = _ipcRenderer$sendSync.error;


  if (error) {
    d(`Failed with error: ${error}`);
    return _Observable.Observable.throw(new Error(error));
  }

  let ret = _Observable.Observable.create(subj => {
    let disp = new _Subscription.Subscription();
    disp.add(_Observable.Observable.fromEvent(_electron.ipcRenderer, key, (e, arg) => arg).do(() => d(`Got event: ${key}`)).subscribe(subj));

    disp.add(new _Subscription.Subscription(() => {
      d(`Got event: ${key}`);
      _electron.ipcRenderer.send('electron-remote-event-unsubscribe', key);
    }));

    return disp;
  });

  return ret.publish().refCount();
}