
exports.attach = function(app) {
  // This should be required here since we are waiting
  // till nconf gets loaded.
  var static = require('./static');

  static.attach(app);
};
