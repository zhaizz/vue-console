<template>
  <el-table :data="newsData" stripe style="width: 100%">
    <el-table-column prop="username" label="用户名" />
    <el-table-column prop="name" label="name" />
    <el-table-column prop="address" label="address" />
  </el-table>
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
    layout="->, sizes, prev, pager, next" :page-sizes="pageSizes" :current-page="pageNum" :page-size="pageSize"
    :total="total" />
</template>

<script setup>
import { ref } from 'vue'
import { user } from '@/api/user'

const pageNum = ref(1)
const pageSize = ref(5)
const total = ref(0)
const pageSizes = ref([5, 10, 20, 30])
const tableData = ref([])
const newsData = ref([])

const userList = async () => {
  const rep = await user({ pagenum: 1, pagesize: 10 })
  tableData.value = rep.users
  total.value = tableData.value.length
  newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
}
function handleSizeChange(size) {
  pageSize.value = size
  newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
}
function handleCurrentChange(currentPage) {
  pageNum.value = currentPage
  newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
}
userList()
</script>

<style lang="scss" scoped>

</style>
