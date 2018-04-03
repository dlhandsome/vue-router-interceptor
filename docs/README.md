# vue-router-interceptor

[![travis-ci](https://travis-ci.org/dlhandsome/vue-router-interceptor.svg?branch=master)](https://www.travis-ci.org/dlhandsome/vue-router-interceptor)
[![npm-version](https://img.shields.io/npm/v/vue-router-interceptor.svg)](https://www.npmjs.com/package/we-cropper)

帮你轻松管理路由的轻型拦截器

> 在大型单页（SPA）应用中，路由起着举足轻重的作用，在遇到复杂场景的时候，通常需要在进入路由时进行各种验证拦截操作、数据前置等等，这款插件就是为这种复杂场景而生

## 安装

```bash
npm install vue-router-interceptor --save-dev
```

## 快速开始

```javascript
import router from 'router'
import VueRouterInterceptor from 'vue-router-interceptor'

const interceptor = VueRouterInterceptor.Create(router)
const requireAuth = interceptor.register('requireAuth')

function middlewre () {
  // ...
}

requireAuth.use(middleware)
requireAuth.listen()
```

## Lisence

MIT
