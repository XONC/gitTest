<template>
  <div class="logo">
    <!-- <div class="logo-img"></div> -->
    <div class="logo-text">
      <!-- <div class="logo-title">{{systemTitle}}</div> -->
      <span>{{systemTitle}}</span>
      <span></span>
      <span>欢迎登录</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logo } from '@/global/constant'
import { useCommonStore } from '@/stores/common'
const props = {
  // 背景颜色类型 lightBg||darkBg
  bgType: {
    type: String,
    default: 'lightBg'
  }
}

const {systemTitle} = useCommonStore()
</script>

<style scoped lang="scss">

</style>
