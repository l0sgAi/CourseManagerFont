<template>
  <div ref="chartStudents" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import { GetStatisticsDataStudent } from '@/api/dataStatistics.js'

const chartStudents = ref()

onMounted(async () => {
  fetchData()
})

const fetchData = async () => {
  const { data } = await GetStatisticsDataStudent()
  setChartOptionStudent(data.studentList, data.amountList)
}

const setChartOptionStudent = (studentList, amountList) => {
  const myChart = echarts.init(chartStudents.value)
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '平均分前十学生统计',
    },
    tooltip: {},
    legend: {
      data: ['学生平均分'],
    },
    xAxis: {
      data: studentList,
    },
    yAxis: {},
    series: [
      {
        name: '学生平均分',
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
