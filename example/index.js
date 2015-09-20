var router = require('..');

function home() {}
function profile() {}
function notfound() {}

var r = router()
    .map('/',         home)
    .map('/user/:id', profile,  {name: 'profile'})
    .map('*',         notfound, {status: 404})
  ;

//route a URL to a handler
var route = r.route('/user/123');
console.log(route.params);                      //prints: {id: 123}
route.handler(route.params);                    //do something with the handler
if (route.status) res.status = route.status;    //do something with the custom route data e.g. change the status on the server

//assemble a URL for a handler
var url = r.assemble('profile', route.params);
console.log(url);                               //prints: /user/123