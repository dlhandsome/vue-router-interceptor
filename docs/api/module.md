# 模块的使用

#### 模块的创建

两种方式均可创建模块

- 创建多个模块

```javascript
const interceptor = new VueRouterInterceptor.Create(router)
// 注册模块A
const moduleA = interceptor.register('moduleA')
// 注册模块B
const moduleB = interceptor.register('moduleB')
```

- 只需要创建一个模块时

```javascript
const module = new VueRouterInterceptor.RegisterModule(router, 'module')
```

#### 属性

##### [module].moduleName

- 类型 ```String```

当前模块名称

##### [module].middleware

- 类型 ```Array<Function>```

当前模块所有中间件集合

##### [module].router

- 类型 ```Vue router instance```

路由实例

#### 方法

##### [module].use(middleware)

```middleware: Function``` 中间件函数，示例：

```javascript
async function middleware (context, next) {
  // ...
  await next()
  console.log('done')
}
```

通常它是一个异步的函数，一共有两个参数:

- ```context: Object``` 当前上下文

  - ```context.to: Object``` 即将要进入的目标 路由对象
 
  - ```context.from: Object``` 当前导航正要离开的路由

  - ```context.router: Object``` 路由实例

- ```next: Function``` 调用管道中下一个中间件，当它处于最后一个中间件时并调用后，路由的状态就是confirmed（确定的）。这里的机制可以参阅 [koa-compose](https://github.com/koajs/compose)

##### [module].listen()

监听该模块
