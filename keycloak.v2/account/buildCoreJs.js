const builder = require('core-js-builder');

builder({
  targets: {
    chrome: 70,
    edge: 93,
    android: 70
  },
  summary: {                                     // shows summary for the bundle, disabled by default:
    console: { size: true, modules: false },     // in the console, you could specify required parts or set `true` for enable all of them
    comment: { size: false, modules: true },     // in the comment in the target file, similarly to `summary.console`
  },
  filename: './resources/core-js-bundle.js',            // optional target filename, if it's missed a file will not be created
});