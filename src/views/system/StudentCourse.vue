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
        <el-button
          type="primary"
          size="small"
          v-show="!listContainsRow(studentCourseList, scope.row)"
          @click="pickCourse(scope.row)"
        >
          选课
        </el-button>
        <el-button
          type="danger"
          size="small"
          v-show="listContainsRow(studentCourseList, scope.row)"
          @click="cancelCourse(scope.row)"
        >
          退选
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
import { GetAllCourseListByPage } from '@/api/course'
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetAdmininfo, GetStudentinfo, GetTeacherinfo } from '@/api/login'
import {
  SaveStudentCourseData,
  DeleteStudentCourseData,
  GetStudentCourseListByPage,
  FindAllPickedCourse,
} from '@/api/studentCourse'
import { useUserinfo } from '@/components/Avatar/hooks/useUserinfo'
//////////////////////课程通知记录列表
let list = ref([]) //结果列表

let total = ref(0) //总记录数

// 学生已选课程列表数据模型
let studentCourseList = ref([])

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

//课程对象变量id
let courseId = ref()

const pickCourse = async row => {
  //选课

  if (row.num >= row.numLimit) {
    ElMessage.warning('该课程选课人数已满!')
    //刷新页面
    fetchData()
    return
  }

  const { userinfo } = useUserinfo()
  try {
    const { code } = await SaveStudentCourseData(userinfo.value.id, row)
    if (code === 200) {
      //添加数据至teacherCourseList
      studentCourseList.value.push(row)
      //提交成功状态码
      //提示信息
      ElMessage.success('选课成功!')
      //刷新页面
      fetchData()
    } else {
      ElMessage.error('选课失败!')
    }
  } catch (e) {
    ElMessage.error('数据异常，可能是课程人数已满，请刷新页面确认!')
  }
}

const cancelCourse = async row => {
  //退选
  const { userinfo } = useUserinfo()
  ElMessageBox.confirm('你确定要退选这门课吗？', '退课确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    if (row.num <= 0) {
      ElMessage.warning('数据异常，选课人数小于0!')
      //刷新页面
      fetchData()
      return
    } else {
      const { code } = await DeleteStudentCourseData(row.id, userinfo.value.id)
      if (code === 200) {
        //移除数据至teacherCourseList
        studentCourseList.value = studentCourseList.value.filter(
          item => item.id != row.id
        )
        //成功状态码
        //提示信息
        ElMessage.success('退课成功!')
        //刷新页面
        fetchData()
      } else {
        ElMessage.error('退课失败!')
      }
    }
  })
}

//钩子函数
onMounted(() => {
  fetchData()
})

//操作方法:列表方法和搜索方法
//列表方法:axios请求调用接口获取表数据
const fetchData = async () => {
  const { userinfo } = useUserinfo()
  const { data: picked } = await FindAllPickedCourse(userinfo.value.id)

  studentCourseList.value = picked

  if (createTimes.value.length == 2) {
    queryDto.value.createTimeBegin = createTimes.value[0]
    queryDto.value.createTimeEnd = createTimes.value[1]
  }

  const { data, code, message } = await GetAllCourseListByPage(
    pageParams.value.page,
    pageParams.value.limit,
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

const listContainsRow = (list, scopeRow) => {
  //工具方法，判断课程列表中是否包含学生选择的课程id
  return list.some(item => item.id == scopeRow.id)
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
