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

    <!-- 修改页面表单 -->
    <el-dialog v-model="dialogVisible" title="修改课程信息" width="30%">
      <el-form label-width="120px">
        <el-form-item label="课程名">
          <el-input v-model="courseData.name" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input-number
            v-model="courseData.credit"
            :precision="1"
            :step="1"
            :min="0.5"
            :max="100"
          />
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input
            v-model="courseData.intro"
            style="width: 100%"
            :rows="5"
            type="textarea"
            placeholder="请输入课程简介"
          />
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model="courseData.courseTime" />
        </el-form-item>
        <el-form-item label="上课地点">
          <el-input v-model="courseData.courseLocation" />
        </el-form-item>
        <el-form-item label="选课人数限制">
          <el-input-number
            v-model="courseData.numLimit"
            :precision="0"
            :step="1"
            :min="1"
            :max="300"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 通知页面表单 -->
    <el-dialog v-model="dialogVisibleReport" title="发布课程通知" width="30%">
      <el-form label-width="120px">
        <el-form-item label="课程通知">
          <el-input
            v-model="courseData.report"
            style="width: 100%"
            :rows="5"
            type="textarea"
            placeholder="请输入课程通知"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReport">提交</el-button>
          <el-button @click="dialogVisibleReport = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--- 课程通知表格数据 -->
    <h1 class="report">课程列表</h1>
    <el-table :data="list" style="width: 100%" stripe="true" max-height="500">
      <el-table-column prop="id" label="课程号" width="100" />
      <el-table-column prop="name" label="课程名" width="100" />
      <el-table-column prop="credit" label="学分" width="100" />
      <el-table-column prop="intro" label="课程简介" />
      <el-table-column prop="courseTime" label="上课时间" width="200" />
      <el-table-column prop="courseLocation" label="上课地点" width="200" />
      <el-table-column prop="numLimit" label="人数限制" width="100" />
      <el-table-column prop="num" label="选课人数" width="100" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <el-button type="warn" size="small" @click="editShowReport(scope.row)">
          发布通知
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
import { GetTeacherCourseListByPage } from '@/api/teacherCourse'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UpdateCourseData } from '@/api/course'
import { GetAdmininfo, GetStudentinfo, GetTeacherinfo } from '@/api/login'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
//课程记录数据格式
const courseDataForm = {
  id: '',
  name: '',
  credit: '',
  intro: '',
  courseTime: '',
  courseLocation: '',
  numLimit: '',
  report: '',
}
const courseData = ref(courseDataForm)

//弹窗设置，true为显示，false为隐藏
const dialogVisible = ref(false)
const dialogVisibleReport = ref(false)

//弹框数据回显
const editShow = row => {
  courseData.value = { ...row }
  dialogVisible.value = true
}

//弹框数据回显
const editShowReport = row => {
  courseData.value = { ...row }
  dialogVisibleReport.value = true
}

//点击添加弹出框的方法
const addShow = () => {
  courseData.value = {}
  dialogVisible.value = true
}

//点击添加弹出框的方法
const addShowReport = () => {
  courseData.value = {}
  dialogVisibleReport.value = true
}

//添加和修改的方法
const submit = async () => {
  const { code } = await UpdateCourseData(courseData.value)
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

//添加和修改的方法
const submitReport = async () => {
  const { code } = await UpdateCourseData(courseData.value)
  if (code === 200) {
    //提交成功状态码
    //关闭弹窗
    dialogVisibleReport.value = false
    //提示信息
    ElMessage.success('发布通知成功!')
    //刷新页面
    fetchData()
  } else {
    //提交失败
    ElMessage.error('发布通知失败!')
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

//钩子函数
onMounted(() => {
  fetchData()
})

//操作方法:列表方法和搜索方法
//列表方法:axios请求调用接口获取表数据
//操作方法:列表方法和搜索方法
//列表方法:axios请求调用接口获取表数据
const fetchData = async () => {
  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }

  const { userinfo } = useUserinfo()
  const { data, code, message } = await GetTeacherCourseListByPage(
    pageParams.value.page,
    pageParams.value.limit,
    userinfo.value.id,
    queryDto.value
  )

  list.value = data.list
  total.value = data.total
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
