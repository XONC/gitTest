<template>
  <div class="login-form">
    <el-form :model="loginForm" :rules="loginRules" label-width="0" ref="loginFormRef" >
      <el-form-item class="input-form-item" prop="userCode">
        <el-input class="input-size" v-model="loginForm.userCode"
                  @keyup.enter.native="handleLogin"
                  autocomplete="off"
                  :autofocus="true"
                  placeholder="请输入手机号/账户">
          <template #prefix>
            <i class="iconfont icon-zhanghao"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="input-form-item" prop="password">
        <el-input class="input-size" placeholder="请输入密码"
                  v-model="loginForm.password"
                  autocomplete="new-password"
                  show-password
                  @keyup.enter.native="handleLogin">
          <template #prefix>
            <i class="iconfont icon-mima"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="sendLoading" @click.native.prevent="handleLogin" class="login-submit" size="small"
                   type="primary">登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { setToken } from '@/utils/auth'
import { responseKey } from '@/global/constant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTagsStore } from '@/stores/tags'
import { useUserStore } from '@/stores/user'
import type {ElForm} from 'element-plus'
type FormInstance = InstanceType<typeof ElForm>;
const router = useRouter()
const {tagMain} = useTagsStore()
const {LoginByUsername} = useUserStore()

// 提交按钮禁用
const sendLoading = ref(false)
const loginFormRef = ref<FormInstance>()
const loginForm = ref({
  userCode: '',
  password: '',
  code: '',
  randomStr: '',
  grant_type: ''
})
const code = ref({
  src: '/admin/code',
  value: '',
  len: 4,
  type: 'image'
})
const loginRules = ref({
  userCode: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
    // { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
})
const passwordType = ref('password')

function showPassword() {
  passwordType.value === ''
    ? (passwordType.value = 'password')
    : (passwordType.value = '')
}

function handleLogin() {
  sendLoading.value = true
  loginFormRef.value && loginFormRef.value.validate(valid => {
    if (valid) {
      loginForm.value.grant_type = 'password'
      LoginByUsername(loginForm.value).then(res => {
          setToken(res[responseKey])
          sendLoading.value = false
          router.push({ path: '/main' })
        },
        () => {
          sendLoading.value = false
          refreshCode()
        }
      )
    }
  })
}

function refreshCode() {}
onMounted(()=>{
  refreshCode()
})
</script>

<style scoped>

</style>
