import { getStore, removeStore, setStore } from '@/utils/store'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: ()=>({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    isFullScren: false,
    appIsFullScren: false,
    isLock: getStore({
      name: 'isLock'
    }) || false,
    theme: getStore({
      name: 'theme'
    }) || '#3772FF',
    lockPasswd: getStore({
      name: 'lockPasswd'
    }) || '',
    setting: getStore({
      name: 'setting'
    }) || {
      // 默认标题栏展示
      haveTags: window.globalConfig.systemTemp.haveTags,
      // 默认主题色
      theme: window.globalConfig.systemTemp.theme
    },
    // 侧边栏是否展开
    isCollapse: false,
    // 系统名称
    systemTitle: window.globalConfig.systemTemp.projectName || '',
    openIce: false, // 启动ice
    optionList: {},
    subAppLoading: false
  }),
  actions: {
    toggleSideBar() {
      this.TOGGLE_SIDEBAR()
    },
    closeSideBar(withoutAnimation) {
      this.CLOSE_SIDEBAR(withoutAnimation)
    },
    // 更新系统名称
    UpdateSystemTitle() {
      return window.globalConfig.systemTemp.projectName || ''
    },

    // 原mutations 方法
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR(withoutAnimation) {
      Cookies.set('sidebarStatus', 0)
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    SET_FULLSCREN(action) {
      this.isFullScren = !this.isFullScren
    },
    SET_APP_FullScren(action) {
      this.appIsFullScren = !this.appIsFullScren
    },
    SET_LOCK(action) {
      this.isLock = true
      setStore({
        name: 'isLock',
        content: this.isLock,
        type: 'session'
      })
    },
    SET_THEME(color) {
      this.theme = color
      setStore({
        name: 'theme',
        content: this.theme
      })
    },
    SET_LOCK_PASSWD(lockPasswd) {
      this.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: this.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK(action) {
      this.isLock = false
      this.lockPasswd = ''
      removeStore({
        name: 'lockPasswd'
      })
      removeStore({
        name: 'isLock'
      })
    },
    SET_SETTING(setting) {
      this.setting = setting
      setStore({
        name: 'setting',
        content: this.setting
      })
    },
    SET_OPTION_LIST(option) {
     this.optionList = Object.assign(this.optionList, option)
      setStore({
        name: 'setting',
        content: this.optionList
      })
    },
    // 设置侧边栏展状态
    SET_COLLAPSE(isCollapse?:boolean) {
      if (isCollapse) {
        this.isCollapse = isCollapse
      } else {
        this.isCollapse = !this.isCollapse
      }
    },
    // 设置系统名称
    SET_SYSTEM_TITLE(systemTitle) {
      this.systemTitle = systemTitle
    },
    SET_OPENICE(data) {
      this.openIce = data
    },
    SET_SUBAPPLOADING(data) {
      this.subAppLoading = data
    }
  },
})
