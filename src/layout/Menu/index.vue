<template>
  <el-menu active-text-color="#ffd04b" :background-color="variables.menuBg" class="el-menu-vertical-demo"
    :default-active="defaultActive" text-color="#fff" router unique-opened :collapse="!$store.getters.siderType">
    <el-sub-menu :index="item.id.toString()" v-for="(item, index) in menusList" :key="item.id">
      <template #title>
        <el-icon>
          <component :is="iconList[index]"></component>
        </el-icon>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item :index="'/' + it.path" v-for="it in item.children" :key="it.id" @click="savePath(it.path)">
        <template #title>
          <el-icon>
            <component :is="icon"></component>
          </el-icon>
          <span>{{ $t(`menus.${it.path }`) }}</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { menuList } from '@/api/menu'
import { ref } from 'vue'
import variables from '@/styles/variables.scss'
// import store from '../../store'

const iconList = ref(['user', 'setting', 'shop', 'tickets', 'pie-chart'])
const icon = ref('menu')

const defaultActive = ref(sessionStorage.getItem('path') || '/users')
const menusList = ref([])
const initMenusList = async () => {
  menusList.value = await menuList()
  // console.log(s)
  // if (store.getters.roleId === '0') {
  //   menusList.value = s
  // } else {
  //   s.forEach(element => {
  //     if (store.getters.menuList.includes(element.id)) {
  //       if (element.children !== []) {
  //         element.children.forEach((el, index) => {
  //           if (!store.getters.menuList.includes(el.id)) {
  //             element.children.splice(index, 1)
  //           }
  //         })
  //         menusList.value.push(element)
  //       }
  //     }
  //   })
  // }
  // console.log(menusList.value)
}
initMenusList()

const savePath = (path) => {
  sessionStorage.setItem('path', `/${path}`)
}
</script>

<style lang="scss" scoped>

</style>
