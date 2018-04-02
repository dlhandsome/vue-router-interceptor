# Create构造配置

#### VueRouterInterceptor.Create(router)

- ```router: Object``` 通过 ```Vue.Router``` 创建出来的实例

```javascript
import router from './router'
import VueRouterInterceptor from 'vue-router-interceptor'

const instance = VueRouterInterceptor.Create(router)
```