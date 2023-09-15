<template>
  <div class="header-bar">
    <div class="header-bar__logo">
      <img src="~@/assets/imgs/logo.jpg" alt="">
      <p>{{ title }}</p>
    </div>
    <div class="header-bar__menu">
      <menuList/>
    </div>
    <topNav/>
  </div>
</template>
<script setup>
import menuList from './menuList.vue'
import topNav from '../topNav/index.vue'
const title = window.globalConfig.systemTemp.projectName

</script>