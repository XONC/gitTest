<template>
  <header class="header" :class="{hasName: pageName}">
    <div class="left-content">
      <el-link @click="handleMenu" :icon="isCollapse ?  'el-icon-s-unfold' : 'el-icon-s-fold'" class="elLink" type="info"></el-link>
      <span v-if="pageName" style="font-size: 16px">{{pageName}}</span>
    </div>
    <div class="right-content">
      <ul class="ulClass">
        <li class="header-item header-user">
          <el-avatar :src="userInfo.avatar||defaultAvatar"></el-avatar>
        </li>
        <li class="header-item header-username">
          <el-dropdown class="user-info-wrap cursor-pointer" trigger="click">
            <div class="el-dropdown-link clearfix">
              <div class="user-info pull-left" :class="{'only-name':!userInfo.orgName}">
                <div class="user-name" >
                  <span class="text" >{{ userInfo.userName }}</span>
                </div>
                <div class="user-org">
                  <span class="text">{{userInfo.orgName}}</span>
                </div>
              </div>
              <div class="user-icon">
                <i class="el-icon-caret-bottom el-icon--right right"></i>
              </div>
            </div>
            <el-dropdown-menu class="headerDropdown">
              <div class="userMenu-backImg">
                <div class="userMenu-logout text-right cursor-pointer" @click="logout">
                  <i class="iconfont icon-daoru"></i> 退出登录
                </div>
                <div class="userMenu-info">
                  <el-tooltip class="item" effect="dark" :content="userInfo.postName" placement="top">
                    <b>{{userInfo.userName}}</b>
                  </el-tooltip>
                  <p class="pt">{{userInfo.orgName}}</p>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import defaultAvatar from '@/assets/imgs/avatarv12.png'
import { computed, onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user'
import { useTagsStore } from '@/stores/tags'
import { useCommonStore } from '@/stores/common'
import {storeToRefs} from "pinia";
const route = useRoute()
const {userInfo, menuOrg, LogOut } = storeToRefs(useUserStore())
const {tag } = storeToRefs(useTagsStore())
const {isCollapse, SET_COLLAPSE} = storeToRefs(useCommonStore())


const isLogin = window.globalConfig.systemTemp.isLogin
const topBtnList = ref([])

const pageName = computed(()=>{
  const { path } = route
  const routeDate = menuOrg.value.find(item => item.functionUrl == path)
  let name = route.name !== '工作台' ? route.name : false
  if (routeDate) {
    name = routeDate.functionName ? routeDate.functionName : ''
  }
  return name
})

const handleMenu = () => {
  SET_COLLAPSE()
}

const logout = () => {
  ElMessageBox.confirm('是否退出系统, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then((isConfirm) => {
    if (isConfirm) {
      LogOut()
    }
  })
}

onMounted(()=>{
})
</script>

<style lang="scss">
$height: 36px;
  .header {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center;

    .elLink {
      font-size: 22px;
      color: #ffffff !important;
    }
  }
  .left-content {
    display: flex;
    align-items: center;
    height: 100%;
    transform: 0.3s;

    color: #ffffff;
  }
  .right-content {
    .ulClass {
      display: flex;
      align-items: center;
    }
    .header-item {
      float: left;
      display: flex;
    }
    .header-icon {
      margin: 0 35px;
      .iconfont {
        color: #ffffff;
        font-size: 22px;
        cursor: pointer;
      }
    }
    .header-user {
      margin-right: 10px;
    }
    .user-info-wrap {
      min-width: 60px;
      font-size: 12px;

      .el-dropdown-link {
        display: table;
        height: 100%;

        .user-icon, .user-info {
          display: table-cell;
          vertical-align: middle;
          color: #ffffff;
        }
        .user-info {
          /* 没有单位信息时*/
          &.only-name {
            .user-name {
              line-height: $height;

              .text {
                vertical-align: middle;
              }
            }

            .user-org {
              display: none;
            }
          }
        }
      }
    }
    .header-link {
      .el-link {
        text-align: center;
        // width: 83px;
        height: 32px;
        background: rgba(255,255,255,0.2);
        padding: 0 20px;
        border-radius: 4px;
        color: #ffffff;

        transition: 0.2s linear;
        margin-right: 30px;

        &:hover {
          color: #ffffff;
          background: rgba(0,10,30,0.2)
        }
      }

      //.el-link:last-child {
      //  margin-right: 20px;
      //}
    }
  }
  .hasName {
    .left-content {
      //background: $menuActiveText;
      position: relative;
      left: -20px;
      padding-left: 20px;
      padding-right: 20px;
      color: #ffffff;
      & > span {
        padding: 0 10px 0 15px;
        font-size: 14px;
      }
      .elLink {
        color: #ffffff;
      }
    }
  }
  .headerDropdown {
    padding: 0 !important;
    background: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
    .popper__arrow {
      display: none;
    }
    .userMenu-backImg {
      width: 380px;
      height: 100px;
      background: url('https://test.gcycloud.cn/all-portal/assets/e37b42c194f2ab45d88f9702808d7a7a.png');
      background-size: 380px 112px;
    }
    .userMenu-info {
      color: #333;
      font-size: 14px;
      line-height: 26px;
      margin-top: 5px;
      margin-left: 16px;
    }
    .pt {

    }
    .userMenu-logout {
      padding: 5px 10px;
      i {
        font-size: 12px;
      }
    }

  }
</style>
