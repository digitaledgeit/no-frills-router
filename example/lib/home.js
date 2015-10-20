var layout = require('./_layout');

module.exports = function(match, router) {
  return layout(router, match, 'Home', 'Hello World!');
};