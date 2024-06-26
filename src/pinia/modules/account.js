/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-27 14:57:06
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import { defineStore } from 'pinia'
import { GetAdmininfo } from '@/api/login'
import { GetStudentinfo } from '@/api/login'
import { GetTeacherinfo } from '@/api/login'

const loginType = localStorage.getItem('loginType')

export const useAccount = defineStore('account', {
  state: () => ({
    userinfo: null,
    permissionList: [],
  }),
  actions: {
    // 清除用户信息
    clearUserinfo() {
      this.userinfo = null
    },
    // 获取管理员信息

    async getAdmininfo() {
      const { code, data } = await GetAdmininfo()
      if (+code === 200) {
        this.userinfo = data
        return Promise.resolve(data)
      }
    },

    // 获取学生信息
    async getStudentinfo() {
      const { code, data } = await GetStudentinfo()
      if (+code === 200) {
        this.userinfo = data
        return Promise.resolve(data)
      }
    },

    // 获取教师信息
    async getTeacherinfo() {
      const { code, data } = await GetTeacherinfo()
      if (+code === 200) {
        this.userinfo = data
        return Promise.resolve(data)
      }
    },
  },
})
