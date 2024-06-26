import request from '@/utils/request'

const base_api = '/admin/system/studentCourse'

// 记录列表
export const GetStudentCourseListByPage = (current, limit, id, queryDto) => {
  return request({
    url: `${base_api}/findByPage/${current}/${limit}/${id}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: queryDto, //其它参数
  })
}

// 成绩记录列表
export const GetStudentGradeListByPage = (current, limit, id, queryDto) => {
  return request({
    url: `${base_api}/findGradeByPage/${current}/${limit}/${id}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: queryDto, //其它参数
  })
}

//记录添加
export const SaveStudentCourseData = (id, courseData) => {
  return request({
    url: `${base_api}/save/${id}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: courseData, //其它参数
  })
}

//记录删除
export const DeleteStudentCourseData = (dataId, id) => {
  return request({
    url: `${base_api}/deleteCourseById/${dataId}/${id}`, //路径
    method: 'delete', //请求方式
  })
}

// 查询所有的课程数据
export const FindAllPickedCourse = id => {
  return request({
    url: `${base_api}/findPickedList/${id}`,
    method: 'get',
  })
}
