# no-frills-router

A simple router used in a few of my isomorphic experiments.

## Installation

    npm install --save no-frills-router
    
## Usage

    var router = require('no-frills-router');
    
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
                
## API

### new Router()

Create a new router.

### .map(pattern : string, handler : mixed [, data : object])
  
Map a URL pattern to a handler.

Parameters:

- `pattern` - a pattern - see [path-to-regex](https://www.npmjs.com/package/path-to-regexp) for details
- `handler` - a function, object, react component or whatever you want
- `data`
    - `name` - the route name - used for the `.assemble()` method
    - `...` - any other data you want to access when the route is matched

### .route(url : string) : object|null
               
Route a URL to a handler.

Parameters:

- `url` - the URL

Returns:

- `name` - the route name
- `params` - the route params
- `handler` - the route handler
- `...` - the other data you passed to the `.map()` method


### .assemble(name : string [, params : Object]) : string|null

Assemble a URL for a handler.
                
- `name` - the route name
- `params` - the route parameters
                
## License

The MIT License (MIT)

Copyright (c) 2015 James Newell