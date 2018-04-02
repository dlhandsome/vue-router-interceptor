/*!
  * vue-router-interceptor v1.0.0
  * (c) 2018 Sail <awsomeduan@gmail.com>
  * @license MIT
  */
'use strict';

'use strict';

/**
 * Expose compositor.
 */

var _koaCompose_4_0_0_koaCompose = compose;

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) { throw new TypeError('Middleware stack must be an array!') }
  for (var i = 0, list = middleware; i < list.length; i += 1) {
    var fn = list[i];

    if (typeof fn !== 'function') { throw new TypeError('Middleware must be composed of functions!') }
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    var index = -1;
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) { return Promise.reject(new Error('next() called multiple times')) }
      index = i;
      var fn = middleware[i];
      if (i === middleware.length) { fn = next; }
      if (!fn) { return Promise.resolve() }
      try {
        return Promise.resolve(fn(context, function next () {
          return dispatch(i + 1)
        }))
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

var VueRouterInterceptor = function VueRouterInterceptor (router) {
  this.router = router;
  this.modulesMap = {};
};

var prototypeAccessors = { modules: { configurable: true } };

prototypeAccessors.modules.get = function () {
  return Object.keys(this.modulesMap)
};

VueRouterInterceptor.prototype.register = function register (moduleName) {
  if (!this.modulesMap[moduleName]) {
    this.modulesMap[moduleName] = new ModuleManage(moduleName, this.router);
  }
  return this.modulesMap[moduleName]
};

VueRouterInterceptor.prototype.listen = function listen () {
    var this$1 = this;

  this.modules.forEach(function (module) {
    this$1.modulesMap[module].listen();
  });
};

Object.defineProperties( VueRouterInterceptor.prototype, prototypeAccessors );

var ModuleManage = function ModuleManage (moduleName, router) {
  this.moduleName = moduleName;
  this.middleware = [];
  this.router = router;
};

ModuleManage.prototype.use = function use (fn) {
  if (typeof fn !== 'function') { throw new TypeError('middleware must be a function!') }
  this.middleware.push(fn);
  return this
};

ModuleManage.prototype.callback = function callback (context, next) {
  var fn = _koaCompose_4_0_0_koaCompose(this.middleware);
  fn(context, next);
};

ModuleManage.prototype.listen = function listen () {
    var this$1 = this;

  this.router.beforeEach(function (to, from, next) {
    to.matched.some(function ($route) { return $route.meta[this$1.moduleName]; }) &&
    this$1.callback({ to: to, from: from, router: this$1.router }, next);
  });
};

var index = {
  Create: VueRouterInterceptor,
  RegisterModule: ModuleManage,
  version: '1.0.0'
};

module.exports = index;
