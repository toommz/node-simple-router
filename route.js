var routePrototype = {
  hasParams: function () {
    if (this.params !== null) return true;
    else return false;
  },
  isRouteFor: function (path) {
    if (this.hasParams()) return path.match(this.regExp);
    else return this.path === path;
  }
};

var makeRouteRegExp = function (path, paramsRegExp) {
  var rawRegExp;
  var pathParts = path.replace(paramsRegExp, '%').split('/');

  rawRegExp = pathParts.map(function (part) {
    if (part !== '%') return part;
    else return '(\\w+)';
  }).join('\\/');

  return new RegExp(rawRegExp + '\\/?$');
};

exports.createRoute = function (method, path, callback) {
  var route;
  var params;
  var paramsRegExp = new RegExp(':(\\w+)', 'g');

  route = Object.create(routePrototype);
  route.method = method;
  route.path = path;
  route.callback = callback;
  
  params = route.path.match(paramsRegExp);

  if (params !== null) {
    route.params = params.map(function (param) {
      return param.slice(1);
    });
    route.regExp = makeRouteRegExp(path, paramsRegExp);
  } else {
    route.params = params;
  }

  return route;
};
