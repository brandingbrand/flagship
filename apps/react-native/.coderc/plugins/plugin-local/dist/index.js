var codeCore = require('@brandingbrand/code-core');

const ios = codeCore.summary.withSummary(async config => {
  //
}, 'plugin-local', 'platform::ios');
const android = codeCore.summary.withSummary(async config => {
  //
}, 'plugin-local', 'platform::android');

exports.android = android;
exports.ios = ios;
