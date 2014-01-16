# A web application router in Node.js

My attempt at creating a web application router from scratch, without knowing how the other ones implemented it. The public API is inspired by Express.js' routing API.

This is what I ended with. It is by no means production ready, it's just a case study.

## How to use it

```javascript
var http = require('http');
var router = require('./lib/router.js').createRouter();

// Declare a GET route without arguments
router.get('/', function (req, res) {
  res.end('Index');
});

// Declare a GET route with an argment
router.get('/hello/:name', function (req, res) {
  // Values passed as arguments are available in req.params
  res.end('Hello ' + req.params.name);
});

var server = http.createServer(function (req, res) {
  router.routeRequest(req, res, function (err) {
    if (err) res.end(err.toString());
  });
}); 

server.listen(3000);
```
