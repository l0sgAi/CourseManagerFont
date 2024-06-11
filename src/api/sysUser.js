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

const base_api = '/admin/system/sysUser'

// 用户列表
export const GetSysUserListByPage = (pageNum, pageSize, queryDto) => {
  return request({
    url: `${base_api}/findByPage/${pageNum}/${pageSize}`, //路径
    method: 'get', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    params: queryDto, //其它参数
  })
}

//用户添加
export const SaveSysUser = sysUser => {
  return request({
    url: `${base_api}/saveSysUser`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: sysUser, //其它参数
  })
}

//用户修改
export const UpdateSysUser = sysUser => {
  return request({
    url: `${base_api}/updateSysUser`, //路径
    method: 'put', //请求方式
    data: sysUser, //其它参数
  })
}
//用户删除
export const DeleteSysUserById = userId => {
  return request({
    url: `${base_api}/deleteSysUserById/${userId}`, //路径
    method: 'delete', //请求方式
  })
}
//用户角色分配信息提交
export const DoAssignRoleToUser = assignRoleVo => {
  return request({
    url: `${base_api}/doAssign`, //路径
    method: 'post', //请求方式
    data: assignRoleVo,
  })
}
