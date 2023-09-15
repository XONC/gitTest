import { getToken } from '@/utils/auth'
import { initMenu, setTitle, tokenResetSession, tokenReset } from '@/utils/util'
import { validatenull } from '@/utils/validate'
import router from './router/index'
import {useCommonStore} from '@/stores/common'
import {useTagsStore} from '@/stores/tags'
import {useUserStore} from '@/stores/user'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import gatewayConfig from '@/global/gateway-config'

NProgress.configure({
  showSpinner: false
})
// 缓存一份放入session
tokenResetSession()
// 刷新界面
// tokenReset(function() {
//   // location.reload()
// })

// 定义需要跳入详情的页面
const whiteList = ['/login', '/404', '/lock']
// 是否走登录页
const isLogin = window.globalConfig.systemTemp.isLogin
// 菜单是否加载完成
let menuIsLoad = false
 router.beforeEach(async(to, from, next) => {
  const common = useCommonStore()
  const tags = useTagsStore()
  const user = useUserStore()
  // 标签页缓存（当页面存在于标签页中时不刷新，否则刷新）
  to.meta.$keepAlive = common.setting.haveTags
    ? tags.tagList.some(ele => ele.value === to.path)
    : false
   // 从登陆页进入，需要重新加载菜单
   if (from.path == '/login') {
     menuIsLoad = false
     next()
   }
  NProgress.start()
  const value = to.query.src ? to.query.src : to.path
  const label = to.query.name ? to.query.name : to.name
  // 是否有token
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 获取用户信息
      if (Object.keys(user.userInfo || {}).length === 0) {
        try {
          const userInfo = await user.GetUserInfo()
        } catch (error) {
          NProgress.done()
          if (isLogin) {
            const outInfo = await user.FedLogOut()
            next('/login')
          }
        }
      }
      // 获取系统名称a
      const systemTitle = common.UpdateSystemTitle()
      setTitle(systemTitle)
      // 获取菜单信息
      if (menuIsLoad) {
        next()
      } else if (validatenull(user.menuList)) {
        await user.GetMenu()
        initMenu(router, user.menuOrg)
        menuIsLoad = true
        next({ ...to })
      }
    }
    NProgress.done()
  } else {
    if (isLogin) {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      window.location.href = gatewayConfig.logoutUrl
    }
  }
})

// 寻找子菜单的父类
function findMenuParent(tag) {
  const tagCurrent: any[] = []
  tagCurrent.push(tag)
  return tagCurrent
}

router.afterEach((to, from) => {
  const tags = useTagsStore()
  setTimeout(() => {
    tags.SET_TAG_CURRENT(findMenuParent(tags.tag))
    NProgress.done()
  }, 0)
})

