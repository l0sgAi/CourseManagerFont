import request from '@/utils/request'

const base_api = '/admin/system/teacherCourse'

// 记录列表
export const GetTeacherCourseListByPage = (current, limit, id, queryDto) => {
  return request({
    url: `${base_api}/findByPage/${current}/${limit}/${id}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: queryDto, //其它参数
  })
}
