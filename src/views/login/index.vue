<!--登录页面-->
<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">选课信息管理系统</h1>

      <el-form-item prop="userName">
        <el-input
          class="text"
          v-model="model.userName"
          prefix-icon="User"
          clearable
          :placeholder="$t('login.username')"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          class="text"
          v-model="model.password"
          prefix-icon="Lock"
          show-password
          clearable
          :placeholder="$t('login.password')"
        />
      </el-form-item>

      <!--新增的验证码页面 -->
      <el-form-item prop="captcha">
        <div class="captcha">
          <el-input
            class="text"
            v-model="model.captcha"
            prefix-icon="Picture"
            placeholder="请输入验证码"
          ></el-input>
          <img
            class="validateCodePic"
            :src="captchaSrc"
            @click="refreshCaptcha"
          />
        </div>
      </el-form-item>

      <!--新增的登录角色选择-->
      <el-form-item label="登录类型">
        <el-radio-group v-model="model.loginType">
          <el-radio :label="0">管理员</el-radio>
          <el-radio :label="1">学生</el-radio>
          <el-radio :label="2">教师</el-radio>
        </el-radio-group>
      </el-form-item>

      <!--登录提示-->
      <label class="tip">用户名为姓名+id，初始密码均为1q2w3e4r5t</label>

      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          size="large"
          @click="submit"
        >
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="change-lang">
    <change-lang />
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  watch,
} from 'vue'
import { Login, GetValidateCode } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'
import { ElMessage } from 'element-plus'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()
    watch(lang, () => {
      state.rules = getRules()
    })
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t('login.rules-validate-code'),
          trigger: 'blur',
        },
      ],
    })

    // onMounted钩子函数，加载页面时刷新验证码,刷新localStorage
    onMounted(() => {
      state.refreshCaptcha()
      localStorage.setItem('loginType', state.model.loginType)
    })

    const state = reactive({
      model: {
        userName: '',
        password: '',
        captcha: '', // 用户输入的验证码
        codeKey: '', // 后端返回的验证码key
        loginType: 1,
      },
      rules: getRules(),
      loading: false,
      captchaSrc: '',
      refreshCaptcha: async () => {
        const { data } = await GetValidateCode()
        state.model.codeKey = data.codeKey
        state.captchaSrc = data.codeValue
      },
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      submit: () => {
        sessionStorage.setItem('flag', true) //登陆后刷新缓存
        localStorage.setItem('uid', extractId(state.model.userName))
        localStorage.setItem('loginType', state.model.loginType)
        if (state.model.loginType == null) {
          ElMessage.error('请选择登录类型！')
        }
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            try {
              console.log(state.model)
              const { code, data, message } = await Login(state.model)
              if (+code === 200) {
                // 登录成功，存储 loginType
                ctx.$message.success({
                  message: ctx.$t('login.loginsuccess'),
                  duration: 1000,
                })

                const targetPath = decodeURIComponent(route.query.redirect)
                if (targetPath.startsWith('http')) {
                  // 如果是一个url地址
                  window.location.href = targetPath
                } else if (targetPath.startsWith('/')) {
                  // 如果是内部路由地址
                  router.push(targetPath)
                } else {
                  router.push('/') // 请求成功以后，进入到首页
                }
                useApp().initToken(data)
              }
              state.loading = false
            } catch {
              ElMessage.error('登录失败！请刷新验证码或检查您的输入。')
              state.loading = false
            }
          }
        })
      },
    })

    // 监视loginType的变化
    watch(
      () => state.model.loginType,
      (newVal, oldVal) => {
        console.log('loginType变化', newVal)
        // 存储到localStorage
        localStorage.setItem('loginType', newVal)
      },
      {
        immediate: true, // 确保在初始时也执行一次
      }
    )

    return {
      ...toRefs(state),
    }
  },
})

function extractId(str) {
  // 使用正则表达式匹配第一个数字及其后面的所有字符，以提取用户id
  const match = str.match(/\d.*/)
  return match ? match[0] : null // 如果匹配到，则返回匹配的字符串，否则返回null
}
</script>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;

  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;

    :deep {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        background: rgba(0, 0, 0, 0.1);
      }

      .el-input-group--append > .el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .el-input-group--prepend > .el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .title {
      color: #fff;
      text-align: center;
      font-size: 36px;
      margin: 0 0 36px;
    }

    .text {
      font-size: 24px;

      :deep(.el-input__inner) {
        color: #fff;
        height: 72px;
        line-height: 72px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .btn {
      width: 100%;
    }
  }

  .validateCodePic {
    //验证码图片样式
    border-radius: 3px;
  }
}

.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.captcha img {
  cursor: pointer;
  margin-left: 30px;
}

.tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  color: red;
  font-size: 20px;
}

.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;

  :deep {
    .change-lang {
      height: 24px;

      &:hover {
        background: none;
      }

      .icon {
        color: #fff;
      }
    }
  }
}
</style>
