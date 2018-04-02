# vue-router-interceptor

帮你轻松管理路由的轻型拦截器

> 在大型单页（SPA）应用中，路由起着举足轻重的作用，在遇到复杂场景的时候，通常需要在进入路由时进行各种验证拦截操作、数据前置等等，这款插件就是为这种复杂场景而生

#### 先看一个简单的案例

在一个电商网站中，有商品展示页，以及个人后台页，当用户进入后台页地时候，我们需要做一个登录拦截，```vue-router```提供了「路由守卫」的钩子可供我们使用：

路由配置

```javascript
{
  name: 'center',
  path: '/center',
  component: () => import('@/views/center'),
  meta: {
    requireAuth: true // 需要登录
  }
}
```
 路由守卫

```javascript
let logined = false
let hasCheckLogin = false

async function checkLogin () {
  hasCheckIdentify = true
  // 异步操作：检查登录状态
  return await fetch('/check_login')
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some($route => $route.meta.requireAuth)) {
    // 当前访问的路由需要做登录拦截
    if (!hasCheckLogin) {
      logined = await checkLogin()
    }
    if (logined) {
      // 此时已经登录过了
      next()
    } else {
      // 未登录过，跳转登录页面
      next('/login')
    }
  }
})

```

上述做法，需要在路由配置的信息元中加入验证标识，再在路由钩子中匹配并拦截。

使用```vue-router-interceptor```插件：

```javascript
import router from 'router'
import VueRouterInterceptor from 'vue-router-interceptor'

const Interceptor = new VueRouterInterceptor.Create(router)
// 注册一个名为requireAuth的拦截器，对应路由配置信息元中的meta字段
const requireIdentify = Interceptor.register('requireIdentify')

let logined = false
let hasCheckIdentify = false

async function checkLogin () {
  hasCheckIdentify = true
  // 异步操作：检查登录状态
  return await fetch('/check_login')
}

// 注入一个中间件
requireIdentify.use(async (ctx, next) => {
  if (!hasCheckLogin) {
    logined = await checkLogin()
  }
  if (logined) {
    next()
  } else {
    ctx.router.push('/login')
  }
})

// 拦截器启动监听
requireIdentify.start()
```

这里看起来，插件作用似乎不大。

#### 看看更复杂一点的场景

假设某路径页面需要验证C场景，而C场景依赖B场景验证的结果，B场景依赖A场景验证的结果.

用原生方式去做，需要在钩子中手动处理多种验证场景的依赖关系:

```javascript
// ...
let a = false
let b = false
let c = false
let hasCheckA = false
let hasCheckB = false
let hasCheckC = false
let resultA = null
let resultB = null
let resultC = null

async function checkA () {
  hasCheckA = true
  // 异步操作：检查A场景
  return await fetch('/check_A')
}

async function checkB (param) {
  hasCheckB = true
  // 异步操作：检查B场景
  return await fetch('/check_B', { data: param })
}

async function checkC (param) {
  hasCheckC = true
  // 异步操作：检查C场景
  return await fetch('/check_C', { data: param })
}

async function interA () {
  if (!hasCheckA) {
    resultA = await checkA()
  }
  if (resultA) {
    return true
  } else {
    router.push('/a')
  }
}

async function interB () {
  if (!hasCheckB) {
    resultB = await checkB(resultA)
  }
  if (resultB) {
    return true
  } else {
    router.push('/b')
  }
}

async function interC () {
  if (!hasCheckC) {
    await checkC(resultB)
  }
  if (resultC) {
    return true
  } else {
    router.push('/a')
  }
}

router.beforeEach((to, from, next) => {
  // 手动处理验证场景的依赖关系
  await interA() && await interB() && await interC() && next()
})
```

使用插件：

``` javascript
import router from 'router'
import VueRouterInterceptor from 'vue-router-interceptor'

const Interceptor = new VueRouterInterceptor.Create(router)
// 注册一个名为requireAuth的拦截器，对应路由配置信息元中的meta字段
const requireC = Interceptor.register('requireC')

let a = false
let b = false
let c = false
let hasCheckA = false
let hasCheckB = false
let hasCheckC = false

async function checkA () {
  hasCheckA = true
  // 异步操作：检查A场景
  return await fetch('/check_A')
}

async function checkB (param) {
  hasCheckB = true
  // 异步操作：检查B场景
  return await fetch('/check_B', { data: param })
}

async function checkC (param) {
  hasCheckC = true
  // 异步操作：检查C场景
  return await fetch('/check_C', { data: param })
}

// 注入中间件
requireC.use(async (ctx, next) => {
  if (!hasCheckA) {
    resultA = await checkA()
  }
  ctx.resultA = resultA
  if (resultA) {
    await next()
  } else {
    ctx.router.push('/a')
  }
})

requireC.use(async (ctx, next) => {
  if (!hasCheckB) {
    resultB = await checkB(ctx.resultA)
  }
  ctx.resultB = resultB
  if (resultB) {
    await next()
  } else {
    ctx.router.push('/b')
  }
})

requireC.use(async (ctx, next) => {
  if (!hasCheckC) {
    resultC = await checkC(ctx.resultB)
  }
  if (resultC) {
    next()
  } else {
    ctx.router.push('/c')
  }
})

// 拦截器启动监听
requireC.listen()
```

```vue-router-interceptor```借鉴了```koa```的「洋葱模型」,巧妙地避开了这个问题，把依赖关系解耦成不同的中间件，每个中间件只需关心自己所需要共享的数据、是否继续调用下一个中间件

<div align="center">
  <img src="https://user-images.githubusercontent.com/16918885/38173050-1fe9ee8a-35ea-11e8-99bd-aefa719c9f63.png" />
</div>

中间件机制可以参阅 [koa-compose](https://github.com/koajs/compose)

那么，开始学习如何[使用](zh-cn/usage.md)吧！