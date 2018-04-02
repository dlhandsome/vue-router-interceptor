# 实例

#### 属性

##### interceptor.modules

- 类型 ```Array```

当前实例的所有已注册模块

##### interceptor.router

- 类型 ```Vue router instance```

路由实例

#### 方法

##### interceptor.register(moduleName)

```moduleName``` 对应路由配置中meta字段，该方法返回一个模块实例

示例：

```javascript
const requireAuth = interceptor.register('requireAuth')
```

[查看](zh-cn/api/module.md) 模块的属性及方法

##### interceptor.listen()

监听所有模块
