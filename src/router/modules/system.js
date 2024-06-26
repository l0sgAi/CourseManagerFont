// 导入组件
const Layout = () => import('@/layout/index.vue')
const Course = () => import('@/views/system/Course.vue')
const Student = () => import('@/views/system/Student.vue')
const Teacher = () => import('@/views/system/Teacher.vue')
const Statistics = () => import('@/views/system/Statistics.vue')
const StudentCourse = () => import('@/views/system/StudentCourse.vue')
const StudentCourseList = () => import('@/views/system/StudentCourseList.vue')
const TeacherGrade = () => import('@/views/system/TeacherGrade.vue')
const TeacherCourse = () => import('@/views/system/TeacherCourse.vue')
const StatisticsStudent = () => import('@/views/system/StatisticsStudent.vue')

//判断菜单隐藏
const ishiddenStu = localStorage.getItem('loginType') == '1' ? false : true
const ishiddenTea = localStorage.getItem('loginType') == '2' ? false : true
const ishiddenAd = localStorage.getItem('loginType') == '0' ? false : true

// 导出该组件
export default [
  {
    path: '/system',
    component: Layout,
    name: 'system',
    meta: {
      title: '系统主页',
    },
    icon: 'Location',
    children: [
      {
        path: '/course',
        name: 'course',
        component: Course,
        meta: {
          title: '课程管理',
        },
        hidden: ishiddenAd,
      },
      {
        path: '/student',
        name: 'student',
        component: Student,
        meta: {
          title: '学生管理',
        },
        hidden: ishiddenAd,
      },
      {
        path: '/teacher',
        name: 'teacher',
        component: Teacher,
        meta: {
          title: '教师管理',
        },
        hidden: ishiddenAd,
      },
      {
        path: '/statistics',
        name: 'statistics',
        component: Statistics,
        meta: {
          title: '课程数据统计',
        },
        hidden: ishiddenAd,
      },
      {
        path: '/statisticsStudent',
        name: 'statisticsStudent',
        component: StatisticsStudent,
        meta: {
          title: '学生数据统计',
        },
        hidden: ishiddenAd,
      },
      {
        path: '/studentCourse',
        name: 'studentCourse',
        component: StudentCourse,
        meta: {
          title: '学生选课',
        },
        hidden: ishiddenStu,
      },
      {
        path: '/studentCourseList',
        name: 'studentCourseList',
        component: StudentCourseList,
        meta: {
          title: '课程列表',
        },
        hidden: ishiddenStu,
      },
      {
        path: '/teacherCourse',
        name: 'teacherCourse',
        component: TeacherCourse,
        meta: {
          title: '教师课程管理',
        },
        hidden: ishiddenTea,
      },
      {
        path: '/teacherGrade',
        name: 'teacherGrade',
        component: TeacherGrade,
        meta: {
          title: '学生课程成绩评分',
        },
        hidden: ishiddenTea,
      },
    ],
  },
]
