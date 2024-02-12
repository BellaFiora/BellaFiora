'use strict';

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

require('rxjs/add/operator/toPromise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const rx = require('./rx-dom');

const toInclude = ['ajax', 'get', 'getJSON', 'post'];
const fs = (0, _pify2.default)(require('fs'));

if (!('type' in process)) {
  global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
}

module.exports = toInclude.reduce((acc, k) => {
  acc[k] = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    let stall = Promise.resolve(true);
    if (!root.window || !root.window.document) {
      stall = new Promise(res => setTimeout(res, 100));
    }

    return stall.then(() => rx[k](...args).toPromise());
  };

  return acc;
}, {});

let isHttpUrl = pathOrUrl => pathOrUrl.match(/^https?:\/\//i);

/**
 * Fetches a path as either a file path or a HTTP URL.
 *
 * @param  {string} pathOrUrl   Either an HTTP URL or a file path.
 * @return {string}             The contents as a UTF-8 decoded string.
 */
module.exports.fetchFileOrUrl = (() => {
  var _ref = _asyncToGenerator(function* (pathOrUrl) {
    if (!isHttpUrl(pathOrUrl)) {
      return yield fs.readFile(pathOrUrl, 'utf8');
    }

    let ret = yield module.exports.get(pathOrUrl);
    return ret.response;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * Downloads a path as either a file path or a HTTP URL to a specific place
 *
 * @param  {string} pathOrUrl   Either an HTTP URL or a file path.
 * @return {string}             The contents as a UTF-8 decoded string.
 */
module.exports.downloadFileOrUrl = (() => {
  var _ref2 = _asyncToGenerator(function* (pathOrUrl, target) {
    if (!isHttpUrl(pathOrUrl)) {
      try {
        let buf = yield fs.readFile(pathOrUrl);
        yield fs.writeFile(target, buf);

        return buf.length;
      } catch (e) {
        return rx.Observable.throw(e);
      }
    }

    let response = yield window.fetch(pathOrUrl, {
      method: 'GET',
      cache: 'no-store',
      redirect: 'follow'
    });

    let fd = yield fs.open(target, 'w');
    let length = 0;
    try {
      let reader = yield response.body.getReader();
      let chunk = yield reader.read();

      while (!chunk.done) {
        let buf = new Buffer(new Uint8Array(chunk.value));
        yield fs.write(fd, buf, 0, buf.length);
        length += buf.length;

        chunk = yield reader.read();
      }

      // Write out the last chunk
      if (chunk.value && chunk.value.length > 0) {
        let buf = new Buffer(new Uint8Array(chunk.value));
        yield fs.write(fd, buf, 0, buf.length);
        length += buf.length;
      }
    } finally {
      yield fs.close(fd);
    }

    if (!response.ok) {
      throw new Error(`HTTP request returned error: ${response.status}: ${response.statusText}`);
    }

    return length;
  });

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();