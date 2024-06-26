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
          placeholder="课程名"
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
        <el-button type="primary" size="small" @click="searchCourse">
          搜索
        </el-button>
        <el-button size="small" @click="resetData">重置</el-button>
      </el-row>
    </el-form>

    <!-- 密码修改 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">
        修改密码
      </el-button>
      <el-button
        type="success"
        size="small"
        v-show="btnTeaShow"
        @click="addShowTea"
      >
        修改个人信息
      </el-button>
    </div>

    <!-- 添加页面表单 -->
    <el-dialog v-model="dialogVisible" title="修改密码" width="30%">
      <el-form label-width="120px">
        <el-form-item label="原密码">
          <el-input
            v-model="pwdData.originalPwd"
            minlength="6"
            maxlength="30"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新的密码">
          <el-input
            v-model="pwdData.newPwd"
            minlength="6"
            maxlength="30"
            type="password"
            placeholder="请输入新的密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="pwdData.newPwdAgain"
            minlength="6"
            maxlength="30"
            type="password"
            placeholder="请再次输入新的密码以确认"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 教师个人信息修改页面表单 -->
    <el-dialog v-model="dialogVisibleTea" title="修改教师个人信息" width="30%">
      <el-form label-width="120px">
        <el-form-item label="电子邮箱">
          <el-input v-model="teaData.email" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="teaData.phone" minlength="6" maxlength="30" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input
            v-model="teaData.intro"
            style="width: 100%"
            :rows="5"
            type="textarea"
            placeholder="请输入个人简介"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitTea">提交</el-button>
          <el-button @click="dialogVisibleTea = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 课程通知表格数据 -->
    <h1 class="report">课程通知</h1>
    <el-table :data="list" style="width: 100%" stripe="true" max-height="500">
      <el-table-column prop="name" label="课程名" width="180" />
      <el-table-column prop="credit" label="学分" />
      <el-table-column prop="report" label="课程通知" />
      <el-table-column prop="updateTime" label="更新时间" />
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
import { GetCourseListByPage } from '@/api/course'
import { UpDateTeacherPassword, UpdateTeacherData } from '@/api/teacher'
import { UpDateStudentPassword } from '@/api/student'
import { GetStudentCourseListByPage } from '@/api/studentCourse'
import { UpDateAdminPassword } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetAdmininfo, GetStudentinfo, GetTeacherinfo } from '@/api/login'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
//密码修改数据格式
const pwdDataForm = {
  id: '',
  originalPwd: '',
  newPwd: '',
  newPwdAgain: '',
}

//教师个人信息修改数据格式
const teacherForm = {
  id: '',
  email: '',
  phone: '',
  intro: '',
}

const pwdData = ref(pwdDataForm)

const teaData = ref(teacherForm)

//弹窗设置，true为显示，false为隐藏
const dialogVisible = ref(false)

//教师的弹窗与其它角色不同，可以修改自己的一些非必要信息
const dialogVisibleTea = ref(false)
const btnTeaShow = ref(localStorage.getItem('loginType') == 2 ? true : false)

//点击添加弹出框的方法
const addShow = () => {
  pwdData.value = {}
  dialogVisible.value = true
}

//点击添加教师弹出框的方法
const addShowTea = () => {
  teaData.value = {}
  dialogVisibleTea.value = true
}

//修改密码的方法
//密码修改封装
const passwordDto = {
  id: '',
  originalPassword: '',
  password: '',
}

const submit = async () => {
  if (pwdData.value.newPwd != pwdData.value.newPwdAgain) {
    ElMessage.warning('两次密码不一致')
    return
  } else if (pwdData.value.newPwd == pwdData.value.originalPwd) {
    ElMessage.warning('新密码不能与旧密码一致')
    return
  } else {
    passwordDto.originalPwd = pwdData.value.originalPwd // 一致，封装原始密码
  }

  if (localStorage.getItem('loginType') == 0) {
    passwordDto.id = localStorage.getItem('uid')
    passwordDto.originalPassword = pwdData.value.originalPwd
    passwordDto.password = pwdData.value.newPwd

    try {
      const { code } = await UpDateAdminPassword(passwordDto)
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
    } catch {
      ElMessage.error('原始密码错误！')
    }
  } else if (localStorage.getItem('loginType') == 1) {
    passwordDto.id = localStorage.getItem('uid')
    passwordDto.originalPassword = pwdData.value.originalPwd
    passwordDto.password = pwdData.value.newPwd

    try {
      const { code } = await UpDateStudentPassword(passwordDto)
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
    } catch {
      ElMessage.error('原始密码错误！')
    }
  } else if (localStorage.getItem('loginType') == 2) {
    passwordDto.id = localStorage.getItem('uid')
    passwordDto.originalPassword = pwdData.value.originalPwd
    passwordDto.password = pwdData.value.newPwd

    try {
      const { code } = await UpDateTeacherPassword(passwordDto)
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
    } catch {
      ElMessage.error('原始密码错误！')
    }
  }
}

const submitTea = async () => {
  teaData.value.id = localStorage.getItem('uid')
  try {
    const { code } = await UpdateTeacherData(teaData.value)
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
  } catch {
    ElMessage.error('修改失败！')
  }
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

//钩子函数，刷新缓存
onMounted(() => {
  if (sessionStorage.getItem('flag')) {
    sessionStorage.removeItem('flag')
    console.log('\n***刷新缓存***\n')
    location.reload()
  }
  fetchData()
})

//操作方法:列表方法和搜索方法
//列表方法:axios请求调用接口获取表数据
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }

  if (localStorage.getItem('loginType') != 1) {
    const { data, code, message } = await GetCourseListByPage(
      pageParams.value.page,
      pageParams.value.limit,
      queryDto.value
    )
    list.value = data.list
    total.value = data.total
  } else {
    const { userinfo } = useUserinfo()
    const { data, code, message } = await GetStudentCourseListByPage(
      pageParams.value.page,
      pageParams.value.limit,
      userinfo.value.id,
      queryDto.value
    )

    list.value = data.list
    total.value = data.total
  }
}

//搜索方法
const searchCourse = () => {
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
</style>
