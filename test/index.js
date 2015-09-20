/* global describe, it */
var assert = require('assert');
var router = require('..');

function home() {}
function profile() {}
function notfound() {}

var HOME = '/';
var PROFILE = '/user/:id';
var NOTFOUND = '*';

describe('router', function() {

  describe('.map()', function() {
  });

  describe('.route()', function() {

    it('should return null when there are no routes', function () {
      var route = router()
        .route('/')
      ;
      assert.equal(route, null);
    });

    it('should return null when there are no matching routes', function () {
      var route = router()
        .map(HOME, home)
        .route('/asdf')
      ;
      assert.equal(route, null);
    });

    it('should return the matching route when the URL matches the `home` pattern', function() {

      var route = router()
        .map(HOME,    home)
        .map(PROFILE, profile)
        .route('/')
      ;

      assert.equal(route.handler, home);
      assert.deepEqual(route.params, {});
    });

    it('should return the matching route when the URL matches the `profile` pattern', function() {

      var route = router()
        .map(HOME,    home)
        .map(PROFILE, profile)
        .route('/user/123')
      ;

      assert.equal(route.handler, profile);
      assert.deepEqual(route.params, {id: '123'});
    });

    it('should return a route with no options', function() {

      var route = router()
        .map(HOME,    home)
        .route('/')
      ;

      assert.equal(route.status, null);
    });

    it('should return a route with options', function() {

      var route = router()
        .map(NOTFOUND, notfound, {name: 'notfound', status: 404})
        .route('/afsd')
      ;

      assert.equal(route.name, 'notfound');
      assert.equal(route.status, 404);
    });

  });

  describe('.assemble()', function() {

    it('should return null when there are no routes', function () {
      var url = router()
        .assemble('foobar')
      ;
      assert.equal(url, null);
    });

    it('should return null when there are no matching routes', function () {
      var url = router()
        .map(HOME, home)
        .assemble('foobar')
      ;
      assert.equal(url, null);
    });

    it('should return a URL for the matching route', function() {

      var url = router()
        .map(HOME,      home)
        .map(PROFILE,   profile, {name: 'profile'})
        .map(NOTFOUND,  notfound)
        .assemble('profile', {id: 123})
      ;

      assert.equal(url, '/user/123');
    });

  });

});
