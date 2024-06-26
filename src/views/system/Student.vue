<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-24 18:18:43
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
-->
<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="记录标题">
        <el-input
          v-model="queryDto.name"
          style="width: 100%"
          placeholder="学生姓名"
        ></el-input>
      </el-form-item>
      <el-col :span="12">
        <el-form-item label="时间">
          <el-date-picker
            v-model="createTimes"
            type="daterange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-col>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="searchStudent">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <!--添加和修改页面表单 -->
    <el-dialog v-model="dialogVisible" title="添加或修改记录" width="30%">
      <el-form label-width="120px">
        <el-form-item label="姓名">
          <el-input v-model="studentData.name" />
        </el-form-item>
        <el-form-item label="账号密码">
          <el-input
            v-model="studentData.password"
            minlength="6"
            maxlength="30"
            type="password"
            placeholder="请输入新的密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:5555/admin/system/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :headers="headers"
          >
            <img
              v-if="studentData.avatar"
              :src="studentData.avatar"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="studentData.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="studentData.college" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="studentData.major" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="studentData.studentClass" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 学生信息表格数据 -->
    <h1 class="report">学生列表</h1>
    <el-table :data="list" style="width: 100%" stripe="true" max-height="500">
      <el-table-column prop="id" label="学号" />
      <el-table-column prop="name" label="学生姓名" />
      <el-table-column prop="avatar" label="头像" #default="scope">
        <img :src="scope.row.avatar" width="50" />
      </el-table-column>
      <el-table-column prop="sex" label="性别" #default="scope" width="100">
        {{ scope.row.sex == 1 ? '男' : '女' }}
      </el-table-column>
      <el-table-column prop="college" label="学院" />
      <el-table-column prop="major" label="专业" />
      <el-table-column prop="studentClass" label="班级" width="100" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="danger" size="small" @click="deleteById(scope.row)">
          删除
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
      v-model:current-page="pageParams.page"
      v-model:page-size="pageParams.limit"
      :page-sizes="[5, 15, 25, 50, 100]"
      @size-change="fetchData"
      @current-change="fetchData"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />
  </div>
</template>

<!-- script部分修改内容 -->
<script setup>
import { ref, onMounted, warn } from 'vue'
import {
  GetAllStudentListByPage,
  SaveStudentData,
  UpdateStudentData,
  DeleteStudentData,
} from '@/api/student'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetAdmininfo, GetStudentinfo, GetTeacherinfo } from '@/api/login'
import { useApp } from '@/pinia/modules/app'
//////////////////////增删改查
//////////////////////课程记录添加
//学生记录数据格式
const studentDataForm = {
  id: '',
  name: '',
  password: '',
  avatar: '',
  sex: '',
  college: '',
  major: '',
  studentClass: '',
}
const studentData = ref(studentDataForm)

//弹窗设置，true为显示，false为隐藏
const dialogVisible = ref(false)

//弹框数据回显
const editShow = row => {
  studentData.value = { ...row }
  dialogVisible.value = true
}

//点击添加弹出框的方法
const addShow = () => {
  studentData.value = {}
  dialogVisible.value = true
}

// 图像上传成功以后的事件处理函数
const handleAvatarSuccess = (response, uploadFile) => {
  console.log('图像上传成功，返回的图像url: ' + response.data)
  studentData.value.avatar = response.data
}

///////////////////用户头像上传
const headers = {
  token: useApp().authorization.token,
  // 从pinia中获取token，在进行文件上传的时候将token设置到请求头中
}

//添加和修改的方法
const submit = async () => {
  if (!studentData.value.id) {
    //传入的studentData中无id值，是插入方法
    const { code } = await SaveStudentData(studentData.value)
    if (code === 200) {
      //提交成功状态码
      //关闭弹窗
      dialogVisible.value = false
      //提示信息
      ElMessage.success('提交操作成功!')
      //刷新页面
      fetchData()
    } else {
      ElMessage.error('提交操作失败!')
    }
  } else {
    //传入的studentData中有id值，是修改方法
    const { code } = await UpdateStudentData(studentData.value)
    if (code === 200) {
      //提交成功状态码
      //关闭弹窗
      dialogVisible.value = false
      //提示信息
      ElMessage.success('修改操作成功!')
      //刷新页面
      fetchData()
    } else {
      //提交失败
      ElMessage.error('修改操作失败!')
    }
  }
}

///////////////////////////删除的方法，异步
const deleteById = row => {
  //传入的studentData中无id值，是插入方法
  ElMessageBox.confirm('此操作将永久删除该记录，确定删除？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const { code } = await DeleteStudentData(row.id)
    if (code === 200) {
      //成功状态码
      //提示信息
      ElMessage.success('删除操作成功!')
      //刷新页面
      fetchData()
    }
  })
}

//////////////////////课程通知记录列表
let list = ref([]) //结果列表

let total = ref(0) //总记录数

//分页数据
const pageParamsForm = {
  page: 1, //当前页
  limit: 5, //每页的记录数
}

const pageParams = ref(pageParamsForm)

const queryDto = ref({
  //查询条件封装数据
  name: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

const createTimes = ref([]) //开始时间

//钩子函数
onMounted(() => {
  fetchData()
})

//操作方法:列表方法和搜索方法
//列表方法:axios请求调用接口获取表数据
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }

  const { data, code, message } = await GetAllStudentListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    queryDto.value
  )

  list.value = data.list
  total.value = data.total
}

//搜索方法
const searchStudent = () => {
  fetchData()
  ElMessage.success('查询成功！')
}

//重置方法
const resetData = () => {
  queryDto.value = {}
  createTimes.value = []
  fetchData()
}
</script>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.report {
  font-size: 23px;
  font: 300;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
