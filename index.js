var extend      = require('extend');
var parseUrl    = require('url').parse;
var parseQuery  = require('query-string').parse;
var toRegExp    = require('path-to-regexp');

/**
 * Router
 * @constructor
 * @returns {NoFrillsRouter}
 */
function NoFrillsRouter() {

  if (!(this instanceof NoFrillsRouter)) {
    return new NoFrillsRouter()
  }

  /**
   * The routes
   * @private
   * @type {Array.<{name: string|null, regexp: RegExp, keys: [], handler: *, context: {}}>}
   */
  this._routes = [];
}

NoFrillsRouter.prototype = {

  /**
   * Map a URL pattern to a handler
   * @param   {string}          [name]
   * @param   {string|RegExp}   pattern
   * @param   {*}               handler
   * @param   {Object}          [context]
   * @returns {NoFrillsRouter}
   */
  map: function(name, pattern, handler, context) {
    context = context || {};

    if (arguments.length === 2) {
      handler = pattern;
      pattern = name;
      name    = null;
    } else if (arguments.length === 3) {
      if (typeof handler === 'object') {
        context = handler;
        handler = pattern;
        pattern = name;
        name    = null;
      }
    }

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
      name:     name,
      pattern:  pattern,
      handler:  handler,
      context:  context,
      regexp:   regexp,
      keys:     keys
    });

    return this
  },

  /**
   * Match a URL to a handler
   * @param   {string} url A URL
   * @returns {{params: {}, name: string, handler: *}|null}
   */
  match: function(url) {

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
        return extend({}, route.context, {
          name:     route.name,
          params:   params,
          handler:  route.handler
        });

      }

    }

    return null
  },

  /**
   * Assemble a URL for a handler
   * @param   {string}  name
   * @param   {Object}  [params]
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

Object.defineProperty(NoFrillsRouter.prototype, 'routes', {
  get: function() {
    return this._routes;
  }
});

module.exports = NoFrillsRouter;