'use strict'

import VueRouter from 'vue-router'
import VueRouterInterceptor from '../src/index'
import assert from 'assert'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home'
    }
  ]
})

describe('test', () => {
  describe('test Create', () => {
    // get all modules
    // 测试modules属性是否正确返回所有注册的模块
    it('get all modules', () => {
      const interceptor = new VueRouterInterceptor.Create(router)
      interceptor.register('moduleA')
      interceptor.register('moduleB')
      interceptor.register('moduleC')

      assert.deepEqual(interceptor.modules, ['moduleA', 'moduleB', 'moduleC'])
    })
    // multiple module registration
    // 测试重复注册模块后返回的是否为同一个模块
    it('multiple module registration', () => {
      const interceptor = new VueRouterInterceptor.Create(router)

      const moduleA = interceptor.register('moduleA')
      const moduleB = interceptor.register('moduleA')

      assert.deepEqual(moduleA, moduleB)
    })
  })
})
