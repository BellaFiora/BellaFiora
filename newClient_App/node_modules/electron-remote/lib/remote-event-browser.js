'use strict';

var _electron = require('electron');

var _Observable = require('rxjs/Observable');

require('rxjs/add/observable/fromEvent');

require('rxjs/add/operator/do');

require('rxjs/add/operator/takeUntil');

const eventListenerTable = {};
const d = require('debug')('remote-event-browser');

function initialize() {
  d('Initializing browser-half of remote-event');

  _electron.ipcMain.on('electron-remote-event-subscribe', (e, x) => {
    const type = x.type,
          id = x.id,
          event = x.event,
          onWebContents = x.onWebContents;

    let target = null;

    switch (type) {
      case 'window':
        target = _electron.BrowserWindow.fromId(id);
        break;
      case 'webcontents':
        target = _electron.webContents.fromId(id);
        break;
      default:
        target = null;
    }

    if (!target) {
      e.returnValue = { error: `Failed to find ${type} with ID ${id}` };
      d(e.returnValue.error);
      return;
    }

    const key = `electron-remote-event-${type}-${id}-${event}-${e.sender.id}`;
    if (eventListenerTable[key]) {
      d(`Using existing key ${key} in eventListenerTable`);
      eventListenerTable[key].refCount++;
      e.returnValue = { error: null };
      return;
    }

    let targetWebContents = e.sender;

    d(`Creating new event subscription with key ${key}: ${event}`);
    d(JSON.stringify(Object.keys(target)));

    eventListenerTable[key] = {
      refCount: 1,
      subscription: _Observable.Observable.fromEvent(onWebContents ? target.webContents : target, event, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return [args];
      }).do(() => d(`Got event on browser side: ${key}`)).takeUntil(_Observable.Observable.fromEvent(targetWebContents, 'destroyed')).subscribe(args => targetWebContents.send(key, args))
    };

    e.returnValue = { error: null };
  });

  _electron.ipcMain.on('electron-remote-event-unsubscribe', (e, key) => {
    let k = eventListenerTable[key];
    if (!k) {
      d(`*** Tried to release missing key! ${key}`);
      return;
    }

    k.refCount--;
    if (k.refCount <= 0) {
      d(`Disposing key: ${key}`);

      delete eventListenerTable[key];
      k.subscription.unsubscribe();
    }
  });
}

initialize();