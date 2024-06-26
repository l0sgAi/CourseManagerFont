<template>
  <div ref="chartCourses" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { GetStatisticsDataCourse } from '@/api/dataStatistics.js'

const chartCourses = ref()

onMounted(async () => {
  fetchData()
})

const fetchData = async () => {
  const { data: course } = await GetStatisticsDataCourse()
  setChartOptionCourse(course.courseList, course.amountList)
}

const setChartOptionCourse = (courseList, amountList) => {
  const myChart = echarts.init(chartCourses.value)
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '选课人数前十课程统计',
    },
    tooltip: {},
    legend: {
      data: ['选课人数'],
    },
    xAxis: {
      data: courseList,
    },
    yAxis: {
      interval: 1, // 步长
    },
    color: ['green'], //在这里设置colorList，是一个数组，图片颜色会按顺序选取
    series: [
      {
        name: '选课人数',
        type: 'bar',
        data: amountList,
      },
    ],
  }
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
</script>

<style scoped></style>
