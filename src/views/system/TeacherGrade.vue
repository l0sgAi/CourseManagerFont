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
        <el-button type="primary" size="small" @click="mark(scope.row)">
          评分
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
