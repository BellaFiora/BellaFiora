'use strict';

var _executeJsFunc = require('./execute-js-func');

var executeJsFunc = _interopRequireWildcard(_executeJsFunc);

var _rendererRequire = require('./renderer-require');

var rendererRequire = _interopRequireWildcard(_rendererRequire);

var _remoteEvent = require('./remote-event');

var remoteEvent = _interopRequireWildcard(_remoteEvent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const executeJsFuncExports = ['createProxyForRemote', 'createProxyForMainProcessModule', 'getSenderIdentifier', 'executeJavaScriptMethodObservable', 'executeJavaScriptMethod', 'initializeEvalHandler', 'remoteEvalObservable', 'remoteEval', 'setParentInformation', 'RecursiveProxyHandler'];

module.exports = Object.assign(executeJsFuncExports.reduce((acc, x) => {
  acc[x] = executeJsFunc[x];return acc;
}, {}), rendererRequire, remoteEvent);