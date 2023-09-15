<template>
  <div class="login">
    <section class="login__section">
      <Logo></Logo>
    </section>
    <section class="login__section">
      <div class="bg1"></div>
      <div class="bg2"></div>
      <div class="login-form-box">
        <div  class="login-form-box__title">
          <h4>账号登录</h4>
        </div>
        <div class="login-form-box__body">
          <UserLogin class="user-login"></UserLogin>
        </div>
      </div>
      
    </section>
    <footer>
      <div class="content">
        {{footer}}
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { footer } from '@/global/constant'
import UserLogin from './userlogin.vue'
import Logo from './logo.vue'
    // 适配
import { flexible } from '@/utils/flexible'
import { onMounted,ref, onUnmounted } from 'vue';

const fontSize = ref<string>('0px')

onMounted(()=>{
  fontSize.value = document.body.style.fontSize;
  flexible.setRem();
})

onUnmounted(()=>{
  document.body.style.fontSize = fontSize.value
  flexible.removeRem();
})

</script>

<style scoped>

</style>
../../utils/flexible.js