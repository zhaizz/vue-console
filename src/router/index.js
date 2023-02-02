import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login')
  },
  {
    path: '/',
    name: '/',
    meta: { id: 'init' },
    component: () => import('../layout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { id: 'home' },
        component: () => import('@/views/home/index.vue')
      },
      {
        path: 'error',
        name: 'error',
        meta: { id: 'error' },
        component: () => import('@/views/error/index.vue')
      },
      {
        path: 'users',
        name: 'users',
        meta: { id: '110' },
        component: () => import('@/views/users/index.vue')
      },
      {
        path: 'categories',
        name: 'categories',
        meta: { id: '121' },
        component: () => import('@/views/categories/index.vue')
      },
      {
        path: 'goods',
        name: 'goods',
        meta: { id: '104' },
        component: () => import('@/views/goods/index.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        meta: { id: '107' },
        component: () => import('@/views/orders/index.vue')
      },
      {
        path: 'params',
        name: 'params',
        meta: { id: '115' },
        component: () => import('@/views/params/index.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        meta: { id: '145' },
        component: () => import('@/views/reports/index.vue')
      },
      {
        path: 'rights',
        name: 'rights',
        meta: { id: '112' },
        component: () => import('@/views/rights/index.vue')
      },
      {
        path: 'roles',
        name: 'roles',
        meta: { id: '111' },
        component: () => import('@/views/roles/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
