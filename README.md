# no-frills-router

A simple router used in a few of my isomorphic experiments.

## Installation

    npm install --save no-frills-router
    
## Usage
    
    var nfr = require('no-frills-router');
    var http = require('http');
    
    var router = nfr()
      .map('index', '/', require('./lib/home'))
      .map('profile', '/user/:username', require('./lib/profile'))
      .map('*', require('./lib/not-found'), {status: 404})
    ;
    
    http.createServer(function(req, res) {
    
      //match a URL to a handler
      var match = router.match(req.url);
    
      res.status = match.status || 200;
      res.end(match.handler(match, router));
    
    }).listen(3001);
                
## API

### new Router()

Create a new router.

### .map([name : string,] pattern : string, handler : mixed [, data : object])
  
Map a URL pattern to a handler.

Parameters:

- `[name]` - the route name - used for the `.assemble()` method
- `pattern` - a pattern - see [path-to-regex](https://www.npmjs.com/package/path-to-regexp) for details
- `handler` - a function, object, react component or whatever you want
- `[data]` - any other data you want to access when the route is matched

### .match(url : string) : object|null
               
Match a URL to a handler.

Parameters:

- `url` - the URL

Returns:

- `name` - the route name
- `params` - the route params
- `handler` - the route handler
- `...` - the other data you passed to the `.route()` method


### .assemble(name : string [, params : Object]) : string|null

Assemble a URL for a handler.
                
- `name` - the route name
- `params` - the route parameters
                
## License

The MIT License (MIT)

Copyright (c) 2015 James Newell