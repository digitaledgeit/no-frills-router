var nfr = require('..');
var http = require('http');

var router = nfr()
  .map('home', '/', require('./lib/home'))
  .map('profile', '/user/:username', require('./lib/profile'))
  .map('*', require('./lib/not-found'), {status: 404})
;

http.createServer(function(req, res) {

  //match a URL to a handler
  var match = router.match(req.url);

  res.status = match.status || 200;
  res.end(match.handler(match, router));

}).listen(3001);