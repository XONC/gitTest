<template>
  <div id="root" :class="classObj">
    <el-container class="main-container-content" >
      <!-- 上部导航区 -->
      <el-header class="elHeader">
        <headerBar></headerBar>
      </el-header>
      <el-main class="main-container-view" v-loading="loadingApp">
        <el-scrollbar class="wl-scroll">
          <div class="router" id="routerWrap" ref="routerWrap">
            <router-view></router-view>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import headerBar from './headerBar/index.vue'
import {useCommonStore} from '@/stores/common'
import { computed, reactive, watch,ref,watchEffect } from 'vue';
import {storeToRefs} from "pinia";
const {subAppLoading, sidebar, isCollapse} = storeToRefs(useCommonStore())

const loadingApp = ref(false)
const classObj = computed(()=>({
  withoutAnimation: sidebar.withoutAnimation,
  hideSidebar: isCollapse,
  openSidebar: !isCollapse,
}))
const loadingSet = (val)=> {
  loadingApp.value = val
}
watchEffect(()=> {
  loadingSet(subAppLoading.value)
})
</script>

<style scoped lang="scss">
#root {
  height: 100%;
}
#routerWrap {
  height: calc(100vh - 70px);
  position: relative;
  overflow: auto;
}
.elHeader {
  background: #fff;
  box-shadow: 2px 2px 6px rgba(170,175,226,0.55);
  z-index: 1;
  height: $topHeight !important;
  background: url('../../assets/imgs/top_bg.png') no-repeat center center ;
  background-size: cover;
  color: #ffffff;
  padding: 0;
  width: 100vw;
}
.main-container-view {
  
}
</style>
