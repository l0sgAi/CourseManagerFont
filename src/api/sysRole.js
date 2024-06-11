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

const sysRole_api = '/admin/system/sysRole'
const sysRoleMenu_api = '/admin/system/sysRoleMenu'

// 角色列表
export const GetSysRoleListByPage = (current, limit, queryDto) => {
  return request({
    url: `${sysRole_api}/findByPage/${current}/${limit}`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: queryDto, //其它参数
  })
}

//角色添加
export const SaveSysRole = sysRole => {
  return request({
    url: `${sysRole_api}/saveSysRole`, //路径
    method: 'post', //请求方式
    //接口@RequestBody 前端 data : 名称 以json格式传输
    //接口没有注解: @Params:名称
    data: sysRole, //其它参数
  })
}

//角色修改
export const UpDateSysRole = sysRole => {
  return request({
    url: `${sysRole_api}/updateSysRole`, //路径
    method: 'put', //请求方式
    data: sysRole, //其它参数
  })
}
//角色修改
export const DeleteSysRole = roleId => {
  return request({
    url: `${sysRole_api}/deleteSysRoleById/${roleId}`, //路径
    method: 'delete', //请求方式
  })
}

//查询所有角色数据
export const GetAllSysRoleList = () => {
  return request({
    url: `${sysRole_api}/findAllRoles`, //路径
    method: 'get', //请求方式
  })
}

//查询角色对应菜单数据
export const GetSysRoleMenuList = roleId => {
  return request({
    url: `${sysRoleMenu_api}/findSysRoleMenuByRoleId/${roleId}`, //路径
    method: 'get', //请求方式
  })
}

//保存角色重新分配的菜单数据
export const DoAssignMenuToSysRole = assignMenuDto => {
  return request({
    url: `${sysRoleMenu_api}/doAssign`, //路径
    method: 'post', //请求方式
    data: assignMenuDto,
  })
}
