<template>
  <div class="header-bar">
    <logo class="header-bar__logo"/>
    <menuList class="header-bar__menu-list"/>
    <topNav class="header-bar__top-nav"/>
  </div>
</template>
<script lang="ts" setup>
import logo from './logo.vue';
import menuList from './menuList.vue'
import topNav from './topNav.vue'
</script>
<style scoped lang="scss">
$logoWidth: 200px;
$topNavWidth: 200px;
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $blueColor;
  &__logo {
    flex-shrink: 0;
    width: $logoWidth;
  }

  &__menu-list {
    flex: 1;
    flex-flow: column;
    width: calc(100% - #{$logoWidth} - #{$topNavWidth})
  }

  &__top-nav {
    flex-shrink: 0;
    width: $topNavWidth;
  }
}
</style>