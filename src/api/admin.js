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

const base_api = '/admin/system/admin'

//记录修改
export const UpDateAdminPassword = PasswordDto => {
  return request({
    url: `${base_api}/updateAdminPassword`, //路径
    method: 'put', //请求方式
    data: PasswordDto, //其它参数
  })
}
