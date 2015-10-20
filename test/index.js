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

    it('should add a route', function() {

      var r = router();
      assert.equal(r.routes.length, 0);

      r.map(HOME, home);
      assert.equal(r.routes.length, 1);

    });

    it('should add route with a name', function() {
      var route = router().map('home', HOME, home).routes[0];
      assert.equal(route.name, 'home');
    });

    it('should add a route with a context', function() {
      var route = router().map(HOME, home, {abc: 'xyz'}).routes[0];
      assert.deepEqual(route.context, {abc: 'xyz'});
    });

    it('should add a route with a name and context', function() {
      var route = router().map('home', HOME, home, {abc: 'xyz'}).routes[0];
      assert.equal(route.name, 'home');
      assert.deepEqual(route.context, {abc: 'xyz'});
    });

    //TODO: with regex, with pattern

  });

  describe('.match()', function() {

    it('should return null when there are no routes', function () {
      var match = router()
        .match('/')
      ;
      assert.equal(match, null);
    });

    it('should return null when there are no matching routes', function () {
      var match = router()
        .map(HOME, home)
        .match('/asdf')
      ;
      assert.equal(match, null);
    });

    it('should return the matching route when the URL matches the `home` pattern', function() {

      var match = router()
        .map(HOME, home)
        .map(PROFILE, profile)
        .match('/')
      ;

      assert.equal(match.handler, home);
      assert.deepEqual(match.params, {});
    });

    it('should return the matching route when the URL matches the `profile` pattern', function() {

      var match = router()
        .map(HOME, home)
        .map(PROFILE, profile)
        .match('/user/123')
      ;

      assert.equal(match.handler, profile);
      assert.deepEqual(match.params, {id: '123'});
    });

    it('should return a match with no context', function() {

      var match = router()
        .map(HOME, home)
        .match('/')
      ;

      assert.equal(match.status, null);
    });

    it('should return a match with a context', function() {

      var match = router()
        .map('notfound', NOTFOUND, notfound, {status: 404})
        .match('/afsd')
      ;

      assert.equal(match.name, 'notfound');
      assert.equal(match.status, 404);
    });

    //TODO: test query params, test route params

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
        .map(HOME, home)
        .map('profile', PROFILE, profile)
        .map(NOTFOUND, notfound)
        .assemble('profile', {id: 123})
      ;

      assert.equal(url, '/user/123');
    });

  });

});
