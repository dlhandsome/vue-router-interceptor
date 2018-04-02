# 教程

#### 创建拦截器实例

```javascript
import router from './router'  
import VueRouterInterceptor from 'vue-router-interceptor'

const interceptor = new VueRouterInterceptor.Create(router)  // 传入vue-router实例
```

#### 注册拦截器模块

创建拦截器实例后，需要注册拦截器模块，用于特定场景的拦截。

```javascript
// 创建拦截器实例
// ...
// 注册拦截器模块
const requireAuth = interceptor.register('requireAuth')
```
上述代码中，注册了一个名为```requireAuth```的模块，对应相应路由配置的```meta```字段。

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

#### 中间件（核心）

中间件是插件的核心部分，它承担了「拦截」的使命，同时它足够灵活，能够让你轻松应对复杂的场景。

注册拦截器模块后，在模块的use方法中传入中间件：

```javascript
async function middleWare (context, next) {
  if (logined) {
    await next()
    console.log('resolved')
  } else {
    context.router.push('/login')
  }
}

requireAuth.use(middleWare)
```

```next```方法代表的含义是：调用管道中下一个中间件，当它处于最后一个中间件时并调用后，路由的状态就是confirmed（确定的）。这里的机制可以参阅 [koa-compose](https://github.com/koajs/compose)

#### 启动监听

最后一步，启动监听，拦截器模块才能生效

```javascript
requireAuth.listen()
```

当然，你也可以使用全局监听，这样所有模块都将开启监听

```javascript
interceptor.listen()
```
