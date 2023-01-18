import { login as loginApi } from '@/api/login'
import router from '@/router'
import { setTokenTime } from '@/utils/auth'
import { getRoles } from '../../api/role'
import { ref } from 'vue'

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem('token') || '',
    siderType: true,
    roleId: localStorage.getItem('roleId') || '',
    menuList: localStorage.getItem('menuList') || '',
    lang: localStorage.getItem('lang') || 'zh'
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    setRole(state, roleId) {
      state.roleId = roleId
      localStorage.setItem('roleId', roleId)
    },
    setMenuList(state, menuList) {
      state.menuList = menuList
      localStorage.setItem('menuList', menuList)
    },
    changeSiderType(state) {
      state.siderType = !state.siderType
    },
    changLang(state, lang) {
      state.lang = lang
    }
  },
  actions: {

    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            getRoles().then((result) => {
              // console.log('getRoles')
              const menuList = ref(['init', 'home', 'login', 'error'])
              result.forEach(element => {
                if (res.rid === element.id) {
                  element.children.forEach(subElement => {
                    menuList.value.push(subElement.id)
                    subElement.children.forEach(el => {
                      menuList.value.push(el.id)
                    })
                  })
                }
              })
              console.log(menuList.value)
              commit('setMenuList', menuList.value)
              router.replace('/')
            })
            commit('setToken', res.token)
            commit('setRole', res.rid.toString())
            // console.log(res.token)
            // const getRoles1 = () => {
            //   return getRoles()
            // }
            setTokenTime()
            // console.log('/')
            // router.replace('/')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出
    logout({ commit }) {
      commit('setToken', '')
      commit('setRole', '')
      commit('setMenuList', '')
      localStorage.clear()
      router.replace('/login')
      sessionStorage.setItem('path', '')
    }

  }
}
