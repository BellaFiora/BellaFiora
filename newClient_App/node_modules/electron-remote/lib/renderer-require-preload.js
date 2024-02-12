'use strict';

var _executeJsFunc = require('./execute-js-func');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _executeJsFunc.initializeEvalHandler)();

_url2.default.parse(window.location.href);
let escapedModule = _url2.default.parse(window.location.href).query.split('=')[1];
try {
  window.requiredModule = require(decodeURIComponent(escapedModule));
} catch (e) {
  window.moduleLoadFailure = e;
}