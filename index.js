var extend      = require('extend');
var parseUrl    = require('url').parse;
var parseQuery  = require('query-string').parse;
var toRegExp    = require('path-to-regexp');

/**
 * Router
 * @constructor
 * @returns {Router}
 */
function Router() {

  if (!(this instanceof Router)) {
    return new Router()
  }

  /**
   * The routes
   * @private
   * @type {Array.<{name: string, regexp: RegExp, keys: [], handler: *, context: {}}>}
   */
  this._routes = [];
}

Router.prototype = {

  /**
   * Map a URL pattern to a handler
   * @param   {string|RegExp}   pattern
   * @param   {*}               handler
   * @param   {Object}          [options]
   * @returns {Router}
   */
  map: function(pattern, handler, options) {
    options = options || {};

    var keys = [];
    var regexp = pattern;

    //convert the pattern to a RegExp
    if (!(pattern instanceof RegExp)) {
      if (pattern === '*') {
        regexp = new RegExp('.*');
      } else {
        regexp = toRegExp(pattern, keys);
      }
    }

    //add the route
    this._routes.push({
      name:     options.name || null,
      pattern:  pattern,
      handler:  handler,
      options:  options,
      regexp:   regexp,
      keys:     keys
    });

    return this
  },

  /**
   * Route a URL to the first matching handler
   * @param   {string} url A URL
   * @returns {{params: {}, name: string, handler: *}|null}
   */
  route: function(url) {

    var parsedUrl = parseUrl(url);
    var pathname = parsedUrl.pathname;

    for (var i = 0; i < this._routes.length; ++i) {

      //get the route
      var route = this._routes[i];

      //evaluate the route
      var matches = pathname.match(route.regexp);
      if (matches) {

        //extract the route params
        var params = parseQuery(parsedUrl.query || '');
        for (var j = 1; j < matches.length; ++j) {
          var key = route.keys[j - 1];
          if (!key) continue;
          params[key.name] = matches[j];
        }

        //return the route data
        return extend({}, route.options, {
          name:     route.name,
          params:   params,
          handler:  route.handler
        });

      }

    }

    return null
  },

  /**
   * Assemble a URL for named route
   * @param   {string}  name
   * @param   {{}}      [params]
   * @returns {string|null}
   */
  assemble: function(name, params) {

    for (var i=0; i<this._routes.length; ++i) {
      var route = this._routes[i];
      if (route.name === name) {
        var compile = toRegExp.compile(route.pattern);
        return compile(params || {});
      }
    }

    return null;
  }

};

module.exports = Router;