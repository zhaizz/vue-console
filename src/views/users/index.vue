<template>
  <el-form :model="selectUserForm">
    <el-row>
      <el-col :span="3">
        <el-form-item label="用户名" style="margin-left: 5%">
          <el-input v-model="selectUserForm.username" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="邮箱" style="margin-left: 5%">
          <el-input v-model="selectUserForm.email" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item label="手机号" style="margin-left: 5%">
          <el-input v-model="selectUserForm.mobile" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item style="margin-left: 5%">
          <el-button type="primary" @click="search(addUserForm)">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-form-item style="margin-left: -50%">
          <el-button type="primary" @click="resetSelectForm">重置</el-button>
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
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <!-- <el-table-column prop="mg_state" label="状态">{{ scope.row.mg_state === true ? 1 : 2 }}</el-table-column> -->
      <el-table-column prop="mg_state" :formatter="getStatus" label="状态"></el-table-column>
      <el-table-column label="操作" min-width="90" align="center">
        <template #default="scope">
          <el-button size="small"
            @click="openEdit(scope.row.id, scope.row.username, '******', scope.row.email, scope.row.mobile, scope.row.role_name)">编辑</el-button>
          <el-button size="small" text type="warning" @click="changeUserStatus(scope.row.id, scope.row.mg_state)">{{
            scope.row.mg_state ? '禁用' : '启用'
          }}</el-button>
          <el-button size="small" text type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      layout="->, sizes, prev, pager, next" :page-sizes="pageSizes" :current-page="pageNum" :page-size="pageSize"
      :total="total" />
  </div>
  <el-dialog v-model="userFormVisible" @open="resetAddForm" width="35%" title="新增用户">
    <el-form :model="addUserForm" v-if="userFormVisible == true" label-width="70px" ref="editRef" label-position="right"
      :rules="formRules" :inline="true" class="demo-form-inline">

      <el-form-item label="用户名" prop="username" style="margin-left: 3%">
        <el-input v-model="addUserForm.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="addUserForm.password"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" style="margin-left: 3%">
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="addUserForm.mobile"></el-input>
      </el-form-item>

      <el-form-item label="角色" prop="rid" style="margin-left: 3%">
        <el-select v-model="addUserForm.rid" class="m-2" placeholder="Select" style="width:92%" placement="bottom"
          @change="selectRole(addUserForm.rid)">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item style="margin-left: 38%">
        <el-button @click="toggleFalse">取消</el-button>
        <el-button type="primary" @click="addUserFunc">确认</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
  <el-dialog v-model="userEditFormVisible" @open="resetAddForm" width="35%" title="修改用户信息">
    <el-form :model="editUserForm" v-if="userEditFormVisible == true" label-position="right" label-width="auto"
      inline="true" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="editUserForm.username" :disabled=true />
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="editUserForm.password" :disabled=true />
      </el-form-item>

      <el-form-item label="邮箱">
        <el-input v-model="editUserForm.email" />
      </el-form-item>

      <el-form-item label="手机号">
        <el-input v-model="editUserForm.mobile" />
      </el-form-item>

      <el-form-item label="角色" prop="rid">
        <el-select v-model="editUserForm.rid" class="m-2" placeholder="Select" style="width:92%" placement="bottom"
          @change="selectRole(editUserForm.rid)">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <!-- <el-form-item style="margin-left: 38%">
          <el-button @click="toggleEditFalse">取消</el-button>
          <el-button type="primary" @click="handleEdit()">确认</el-button>
        </el-form-item> -->
      </el-form-item>

      <el-form-item style="margin-left: 38%">
        <el-button @click="toggleEditFalse">取消</el-button>
        <el-button type="primary" @click="handleEdit()">确认</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { getUserList, addUser, delUser, editUser, addRole, changeStatus, getInfo } from '@/api/user'
import { getRoles } from '../../api/role'
import { ElMessage, ElMessageBox } from 'element-plus'

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
  role: '',
  mobile: '',
  mg_state: '',
  status: '',
  role_name: '',
  rid: ''
})

const selectUserForm = ref({
  username: '',
  email: '',
  mobile: ''
})

function getStatus(row, column) {
  return row.mg_state ? '启用' : '禁用'
}

const userFormVisible = ref(false)
function toggleTrue() {
  userFormVisible.value = true
}

function toggleFalse() {
  userFormVisible.value = false
}

const editUserForm = ref({
  username: '',
  password: '',
  email: '',
  role: '',
  mobile: '',
  mg_state: '',
  status: '',
  role_name: '',
  rid: ''
})
const userEditFormVisible = ref(false)
function toggleEditTrue() {
  userEditFormVisible.value = true
}

function toggleEditFalse() {
  userEditFormVisible.value = false
}

function openEdit(id, username, password, email, mobile, role) {
  toggleEditTrue()
  editUserForm.value.id = id
  editUserForm.value.rid = role
  editUserForm.value.username = username
  editUserForm.value.password = password
  editUserForm.value.email = email
  editUserForm.value.mobile = mobile
  getUserInfo(id)
}
const getUserInfo = async (id) => {
  const res = await getInfo(id)
  editUserForm.value.role_name = res.rid
  console.log(editUserForm.value.role_name)
}
const handleEdit = async () => {
  console.log(editUserForm.value.role_name)
  await editUser(editUserForm.value.id, { email: editUserForm.value.email, mobile: editUserForm.value.mobile }).then(async () => {
    await addRole(editUserForm.value.id, { rid: editUserForm.value.role_name }).then(() => {
      ElMessage.success('修改用户信息成功')
    })
  })
  // ElMessage.success('修改用户信息失败')
  toggleEditFalse()
  userList()
}
const editRef = ref()
const addUserFunc = () => {
  editRef.value.validate().then(async () => {
    const user = await addUser(addUserForm.value)
    await addRole(user.id, { rid: addUserForm.value.rid })
    await changeStatus(user.id, true)
    ElMessage.success('用户添加成功')
    userFormVisible.value = false
    const rep = await getUserList({ pagenum: 1, pagesize: 10 })
    tableData.value = rep.users
    total.value = tableData.value.length
    newsData.value = tableData.value.slice((pageNum.value - 1) * pageSize.value, pageNum.value * pageSize.value)
    addUserForm.value = {}
  }).catch(() => {
    console.log('校验不通过')
  })
}

const changeUserStatus = async (userId, status) => {
  await changeStatus(userId, !status)
  userList()
}

function resetAddForm() {
  addUserForm.value = {
    username: '',
    password: '',
    email: '',
    role: '',
    mobile: '',
    mg_state: '',
    status: '',
    role_name: '',
    rid: ''
  }
  userList()
}

function resetSelectForm() {
  selectUserForm.value = {
    username: '',
    email: '',
    mobile: ''
  }
  userList()
}

function search() {
  newsData.value = []
  let s = tableData.value
  if (selectUserForm.value.username !== '') {
    s = s.filter((t) => t.username === selectUserForm.value.username)
  }
  if (selectUserForm.value.email !== '') {
    s = s.filter((t) => t.email === selectUserForm.value.email)
    console.log(addUserForm.value.email)
  }
  if (selectUserForm.value.mobile !== '') {
    s = s.filter((t) => t.mobile === selectUserForm.value.mobile)
  }
  newsData.value = s
}

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

const options = ref([])

const getRoleList = async () => {
  const rep = await getRoles()
  rep.forEach(element => {
    options.value.push({ value: element.id, label: element.roleName })
  })
}
getRoleList()

function selectRole(rid) {
  console.log(rid)
  addUserForm.value.rid = rid
  editUserForm.value.role_name = rid
  console.log(rid)
}
const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  rid: [{ required: true, message: '请选择角色', trigger: 'change' }]
}
</script>

<style lang="scss" scoped>
#btn {
  float: right;
}
</style>
