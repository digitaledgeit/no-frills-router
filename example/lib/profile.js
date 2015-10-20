var layout = require('./_layout');

module.exports = function(match, router) {
  return layout(router, match, 'Profile', 'Hello '+match.params.username+'!');
};