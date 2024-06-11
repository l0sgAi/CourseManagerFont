import request from '@/utils/request'

const base_api = '/admin/system/sysMenu'
// 分页列表"
export const FindNodes = () => {
  return request({
    url: `${base_api}/findNodes`,
    method: 'get',
  })
}

// 保存信息
export const AddMenu = sysMenu => {
  return request({
    url: `${base_api}/addMenu`,
    method: 'post',
    data: sysMenu,
  })
}

// 修改信息
export const UpdateSysMenuById = sysMenu => {
  return request({
    url: `${base_api}/updateMenu`,
    method: 'put',
    data: sysMenu,
  })
}

// 根据id删除数据
export const RemoveSysMenuById = id => {
  return request({
    url: `${base_api}/removeMenu/${id}`,
    method: 'delete',
  })
}
