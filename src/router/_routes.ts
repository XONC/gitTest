import { _import } from './_import'
import Layout from '@/page/index/index.vue'

export const routes = [
  {
    path: '/',
    name: '主页',
    redirect: '/main',
    component: Layout,
    children: [
      {
        path: '/main',
        component: _import('demo/index', 'views'),
      }
    ]
  },
  {
    path: '/login',
    name: '登录页',
    component: _import('login/index', 'page'),
    hidden: true
  }
]