<template>
  <div class="menu-list">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
    >
      <el-scrollbar noresize>
        <div class="menu-list__scroll-warp">
          <template v-for="(item, index) in menuList" :key="index">
            <el-menu-item v-if="!item.children?.length">
              <i :class="`iconfont ${item.icon}`"></i>
              {{ item.name }}
            </el-menu-item>
            <el-sub-menu v-else :index="String(index+1)">
              <template #title>
                <i :class="`iconfont ${item.icon}`"></i>
                {{ item.name }}
              </template>
              <el-menu-item 
              v-for="(child, childIndex) in item.children" 
              :index="`${index+1}-${childIndex+1}`" 
              :key="childIndex">
                {{ child.name }}
              </el-menu-item>
            </el-sub-menu>
          </template>
        </div>
      </el-scrollbar>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const { menuList } = useUserStore()

onMounted(()=>{
  console.log(menuList)
})
const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
<style lang="scss" scoped>
.menu-list {

  &__scroll-warp {
    display: flex;
  }
}
</style>