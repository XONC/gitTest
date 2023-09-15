import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginByUsername, getUserMenu,getUserInfo, logout } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
import { getStore, setStore } from '@/utils/store'
import { buildTree, verifyResIsSuccess, clone } from '@/utils/util'
import { ElMessage } from 'element-plus'
import { responseKey } from '@/global/constant'
import gatewayConfig from '@/global/gateway-config' // 引入网关
import type {UserInfo} from '@/types/type'

const isLogin = window.globalConfig.systemTemp.isLogin
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
    roles: [],
    menuList: [],
    menuOrg: [],
    isInitMenu: false,
    access_token: getToken() || '',
    refresh_token: getStore({
      name: 'refresh_token'
    }) || '',
    token: getStore({
      name: 'token'
    }) || ''
  }),
  actions: {
    // 根据用户名登录
    LoginByUsername(userInfo): Promise<any> {
      const username = userInfo.userCode.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password, userInfo.grant_type, userInfo.code)
          .then(response => {
            const data = response.data
            const tokenTypeKey = responseKey
            if (data[tokenTypeKey] === '' || data[tokenTypeKey] === undefined) {
              ElMessage({
                message: '用户名或密码错误！',
                type: 'warning'
              })
              return Promise.reject('error')
            } else {
              data[tokenTypeKey] = 'Bearer ' + data[tokenTypeKey];
              console.log(data[tokenTypeKey])
              this.SET_ACCESS_TOKEN(data[tokenTypeKey])
              window.localStorage.loginGrantType = userInfo.grant_type;
              resolve(data)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
     },
    // 获取用户信息
    GetUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (verifyResIsSuccess(response)) {
            const data = response.data.data
            this.SET_USER_INFO(data)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取系统菜单
    GetMenu() {
      return new Promise((resolve, reject) => {
        getUserMenu().then((res) => {
          if (verifyResIsSuccess(res)) {
            // 根菜单节点编码
            const rootMenuId = '000001000000001'
            // 菜单接口数据转换为vueRouter数据
            let result = clone(res.data.data)
            const menuData = result.map(menuItem => {
              let query = ''
              if (menuItem.functionUrl && menuItem.functionUrl.indexOf('?') !== -1) {
                query = menuItem.functionUrl.substring(menuItem.functionUrl.indexOf('?') + 1, menuItem.functionUrl.length)
                menuItem.functionUrl = menuItem.functionUrl.substring(0, menuItem.functionUrl.indexOf('?'))
              } else {
                query = ''
              }
              return {
                // icon
                icon: menuItem.remark,
                // name
                name: menuItem.functionName,
                label: menuItem.functionName,
                // 路径
                path: menuItem.functionUrl,
                url: menuItem.javaEvent || '',
                // 组件
                component: menuItem.functionParam,
                query: query,
                ...menuItem
              }
            })
            // 从根节点取出数据
            this.SET_OrgMENU(menuData)
             // 移除根菜单节点
            const rootMenuIndex = menuData.findIndex(item => item.funId === rootMenuId)
            if (rootMenuIndex !== -1) {
              menuData.splice(rootMenuIndex, 1)
            }

            const treeData = buildTree(menuData, 'funId', 'funPId', 'children')
            // 从根节点取出数据
            this.SET_MENU(treeData)
            resolve(treeData)
          } else {
            ElMessage({
              type: 'error',
              showClose: true,
              message: res.data.msg
            })
            reject(res)
          }
        })
      })
    },
    // 登出
    LogOut() {
      const token = this.access_token
      if (isLogin) {
        logout(token).then(response => {
          if (verifyResIsSuccess(response)) {
            // 清除菜单
            this.SET_MENU([]) 
            // 清除用户信息
            this.SET_USER_INFO({}) 
            this.SET_ACCESS_TOKEN('') 
            this.SET_REFRESH_TOKEN('') 
            removeToken()
            localStorage.clear()
            sessionStorage.clear()
            location.href = location.origin + location.pathname + '#/login'
          }
        }).catch(error => {
          console.log(error)
        })
      } else {
        // 清除菜单
        this.SET_MENU([]) 
        // 清除用户信息
        this.SET_USER_INFO({}) 
        this.SET_ACCESS_TOKEN('') 
        this.SET_REFRESH_TOKEN('')
        removeToken()
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = gatewayConfig.logoutUrl
      }
    },
    // 前端 登出
    FedLogOut(): Promise<void> {
      return new Promise(resolve => {
        // 清除菜单
        this.SET_MENU([]) 
        // 清除用户信息
        this.SET_USER_INFO({}) 
        this.SET_ACCESS_TOKEN('') 
        this.SET_REFRESH_TOKEN('')
        removeToken()
        resolve()
        if (!isLogin) {
          window.location.href = gatewayConfig.logoutUrl
        }
      })
    },
    // 原mutations 方法
    SET_ACCESS_TOKEN (access_token) {
      console.log(this)
      this.access_token = access_token
    },
    SET_MENU(menu) {
      this.menuList = menu
      setStore({
        name: 'menuList',
        content: this.menuList,
        type: 'session'
      })
    },
    SET_OrgMENU(menu) {
      this.menuOrg = menu
      setStore({
        name: 'menu',
        content: this.menuOrg,
        type: 'session'
      })
    },
    SET_USER_INFO(userInfo) {
      this.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: this.userInfo,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN(rfToken) {
      this.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: this.refresh_token,
        type: 'session'
      })
    }
  },
})
