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

//查询课程对应的选课学生数据
export const GetCourseStudentList = courseId => {
  return request({
    url: `${base_api}/findCourseStudent/${courseId}`, //路径
    method: 'get', //请求方式
  })
}
//保存学生重新分配的分数数据
export const DoAssignGradeToStudent = assignGradeDto => {
  return request({
    url: `${base_api}/doAssign`, //路径
    method: 'post', //请求方式
    data: assignGradeDto,
  })
}
