import request from '@/utils/request'

const api_name = '/admin/statistics'

// 学生数据统计
export const GetStatisticsDataStudent = () => {
  return request({
    url: `${api_name}/getStatisticsDataStudent`,
    method: 'get',
  })
}

// 课程数据统计
export const GetStatisticsDataCourse = () => {
  return request({
    url: `${api_name}/getStatisticsDataCourse`,
    method: 'get',
  })
}
