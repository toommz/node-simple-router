var createRoute = require('./route').createRoute;

var routerPrototype = {
  addRoute: function (method, path, callback) {
    this.routes[method].push(createRoute(method, path, callback));
  },
  findRoute: function (method, path, next) {
    var route;
    var routes = this.routes[method];

    for (var index in routes) {
      route = routes[index];
      if (route.isRouteFor(path)) {
        return next(null, route);
      }
    }

    return next(new Error('Route undefined'));
  },
  prepareRouteParams: function (route, req) {
    var index = 0;
    var params = {};
    var values = req.url.match(route.regExp).splice(1, route.params.length);
    route.params.forEach(function (param) {
      params[param] = values[index];
      index += 1;
    });
    req['params'] = params;
  },
  routeRequest: function (req, res, next) {
    var route;
    var that = this;
    var method = req.method.toLowerCase();
    var path = req.url;


    this.findRoute(method, path, function (err, route) {
      if (err) {
        return next(err);
      } else {
        if (route.hasParams()) {
          that.prepareRouteParams(route, req);
        }
        route.callback(req, res);
        return next(null);
      }
    });
  }
};

['get', 'post', 'put', 'del'].forEach(function (method) {
  routerPrototype[method] = function (path, callback) {
    this.addRoute(method, path, callback);
  };
});

exports.createRouter = function () {
  var router;
  var routes = {
    'get': [],
    'post': [],
    'put': [],
    'delete': []
  };

  router = Object.create(routerPrototype);
  router.routes = routes;

  return router;
};
