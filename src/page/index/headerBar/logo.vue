<template>
  <div class="logo">
    <img src="~@/assets/imgs/logo.jpg" alt="">
    <p>{{ title }}</p>
  </div>
</template>
<script setup>
import menuList from './menuList.vue'
const title = window.globalConfig.systemTemp.projectName

</script>
<style scoped lang="scss">
.logo {
  
  display: flex;
  align-items: center;
}
</style>