<template>
  <el-form :model="addUserForm">
    <el-row>
      <el-col :span="3">
        <el-form-item label="用户名" style="margin-left: 5%">
          <el-input v-model="addUserForm.username" placeholder="Please input" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="邮箱" style="margin-left: 5%">
          <el-input v-model="addUserForm.email" placeholder="Please input" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="手机号" style="margin-left: 5%">
          <el-input v-model="addUserForm.mobile" placeholder="Please input" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item style="margin-left: 5%">
          <el-button type="primary" :icon="Search" @click="search(addUserForm)">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item style="margin-left: -50%">
          <el-button type="primary" :icon="primary" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div>
    <el-button id="btn" type="primary" @click="toggleTrue">新增用户</el-button>
  </div>
  <div>
    <el-table :data="newsData" stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="openEdit(scope.row.id, scope.row.email, scope.row.mobile)">Edit</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(scope.row.id)">Delete</el-button>
          <!-- <el-button size="small" type="danger" @click="console.log(scope.row)">Delete</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      layout="->, sizes, prev, pager, next" :page-sizes="pageSizes" :current-page="pageNum" :page-size="pageSize"
      :total="total" />
  </div>
  <el-dialog v-model="userFormVisible" @open="resetForm">
    <el-form :model="addUserForm" v-if="userFormVisible == true" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="用户名" style="margin-left: 10%">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="密&nbsp&nbsp&nbsp&nbsp码" style="margin-left: 10%">
            <el-input v-model="addUserForm.password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮&nbsp&nbsp&nbsp&nbsp箱" style="margin-left: 10%">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" style="margin-left: 10%">
            <el-input v-model="addUserForm.mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item style="margin-left: 82%">
            <el-button @click="toggleFalse">Cancel</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item style="margin-left: 11%">
            <el-button type="primary" @click="addUserFunc">Confirm</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <el-dialog v-model="userEditFormVisible" @open="resetForm">
    <el-form :model="editUserForm" v-if="userEditFormVisible == true" label-position="right">
      <el-row>
        <el-col :span="11">
          <el-form-item label="邮箱" style="margin-left: 10%">
            <el-input v-model="editUserForm.email">{{ editUserForm.email }}</el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="手机号" style="margin-left: 10%">
            <el-input v-model="editUserForm.mobile">{{ editUserForm.mobile }}</el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item style="margin-left: 82%">
            <el-button @click="toggleEditFalse">Cancel</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item style="margin-left: 11%">
            <el-button type="primary" @click="handleEdit()">Confirm</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { getUserList, addUser, delUser, editUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const pageNum = ref(1)
const pageSize = ref(5)
const total = ref(0)
const pageSizes = ref([5, 10, 20, 30])
const tableData = ref([])
const newsData = ref([])

const userList = async () => {
  const rep = await getUserList({ pagenum: 1, pagesize: 10 })
  tableData.value = rep.users
  total.value = tableData.value.length
  newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
  console.log(newsData.value)
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

const addUserForm = ref({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
const userFormVisible = ref(false)
function toggleTrue() {
  userFormVisible.value = true
}

function toggleFalse() {
  userFormVisible.value = false
}

const editUserForm = ref({
  id: '',
  email: '',
  mobile: ''
})
const userEditFormVisible = ref(false)
function toggleEditTrue() {
  userEditFormVisible.value = true
}

function toggleEditFalse() {
  userEditFormVisible.value = false
}

function openEdit(id, email, mobile) {
  toggleEditTrue()
  editUserForm.value.id = id
  editUserForm.value.email = email
  editUserForm.value.mobile = mobile
}

const handleEdit = async () => {
  await editUser(editUserForm.value.id, { email: editUserForm.value.email, mobile: editUserForm.value.mobile })
  ElMessage.success('修改成功')
  toggleEditFalse()
  userList()
}

const addUserFunc = async () => {
  await addUser(addUserForm.value)
  ElMessage.success('用户添加成功')

  userFormVisible.value = false
  const rep = await getUserList({ pagenum: 1, pagesize: 10 })
  tableData.value = rep.users
  total.value = tableData.value.length
  newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
}

function resetForm() {
  addUserForm.value = {}
  userList()
}

function search() {
  newsData.value = []
  let s = tableData.value
  if (addUserForm.value.username !== '') {
    s = s.filter((t) => t.username === addUserForm.value.username)
  } else if (addUserForm.value.email !== '') {
    s = s.filter((t) => t.email === addUserForm.value.email)
  } else if (addUserForm.value.mobile !== '') {
    s = s.filter((t) => t.mobile === addUserForm.value.mobile)
  }
  newsData.value = s
}

// const userList = async () => {
//   const rep = await getUserList({ pagenum: 1, pagesize: 10 })
//   tableData.value = rep.users
//   total.value = tableData.value.length
//   newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
//   console.log(newsData.value)
// }

// const handleDelete = (id) => {
//   open(id)
// }
const handleDelete = (id) => {
  ElMessageBox.confirm(
    '确认删除该用户吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }
  )
    .then(async () => {
      await delUser(id)
      userList()
      ElMessage.success('删除成功')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled'
      })
    })
}
</script>

<style lang="scss" scoped>
#btn {
  float: right;
}
</style>
