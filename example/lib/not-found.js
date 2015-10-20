var layout = require('./_layout');

module.exports = function(match, router) {
  return layout(router, match, 'Page not found', 'The page you were looking for couldn\'t be found.');
};