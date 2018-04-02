import compose from 'koa-compose'

class VueRouterInterceptor {
  constructor (router) {
    this.router = router
    this.modulesMap = {}
  }

  get modules () {
    return Object.keys(this.modulesMap)
  }

  register (moduleName) {
    if (!this.modulesMap[moduleName]) {
      this.modulesMap[moduleName] = new ModuleManage(moduleName, this.router)
    }
    return this.modulesMap[moduleName]
  }

  listen () {
    this.modules.forEach(module => {
      this.modulesMap[module].listen()
    })
  }
}

class ModuleManage {
  constructor (moduleName, router) {
    this.moduleName = moduleName
    this.middleware = []
    this.router = router
  }

  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
    this.middleware.push(fn)
    return this
  }

  callback (context, next) {
    const fn = compose(this.middleware)
    fn(context, next)
  }

  listen () {
    this.router.beforeEach((to, from, next) => {
      to.matched.some($route => $route.meta[this.moduleName]) &&
      this.callback({ to, from, router: this.router }, next)
    })
  }
}

export default {
  Create: VueRouterInterceptor,
  RegisterModule: ModuleManage,
  version: '__VERSION__'
}
