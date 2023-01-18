import router from './index'
import store from '@/store'

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    if (store.getters.roleId === '0') {
      if (router.hasRoute(to.name)) {
        next()
      } else {
        next('/error')
      }
    } else {
      if (to.path === '/login') {
        next('/')
      }
      console.log(to.meta.id)
      if (store.getters.menuList.includes(to.meta.id)) {
        next()
      } else {
        next('/error')
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
