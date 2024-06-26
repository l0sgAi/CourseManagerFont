/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2021-04-21 09:36:55
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import request from '@/utils/request'

const base_api = '/admin/system/teacher'

//记录修改
export const UpDateTeacherPassword = PasswordDto => {
  return request({
    url: `${base_api}/updateTeacherPassword`, //路径
    method: 'put', //请求方式
    data: PasswordDto, //其它参数
  })
}

export const GetAllTeacherListByPage = (current, limit, queryDto) => {
  return request({
    url: `${base_api}/findAllByPage/${current}/${limit}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: queryDto, //其它参数
  })
}

//记录添加
export const SaveTeacherData = courseData => {
  return request({
    url: `${base_api}/save`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: courseData, //其它参数
  })
}

//记录修改
export const UpdateTeacherData = courseData => {
  return request({
    url: `${base_api}/update`, //路径
    method: 'put', //请求方式
    data: courseData, //其它参数
  })
}
//记录删除
export const DeleteTeacherData = dataId => {
  return request({
    url: `${base_api}/deleteTeacherById/${dataId}`, //路径
    method: 'delete', //请求方式
  })
}

//查询教师对应课程数据
export const GetTeacherCourseList = teacherId => {
  return request({
    url: `${base_api}/findTeacherCourse/${teacherId}`, //路径
    method: 'get', //请求方式
  })
}

//保存教师重新分配的课程数据
export const DoAssignCourseToTeacher = assignCourseDto => {
  return request({
    url: `${base_api}/doAssign`, //路径
    method: 'post', //请求方式
    data: assignCourseDto,
  })
}
