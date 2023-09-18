import axios from 'axios'
import { tokenTypeKey } from '@/global/constant'
import { ElMessage } from 'element-plus'
import errorCode from '@/global/errorCode'
import responseCode from '@/global/responseCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { verifyResIsSuccess } from '@/utils/util'
import { tipMessage } from '@/utils/tipMessage'
import { getToken, refreshToken } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { ENV } from '../global/env'

// 计划接口
let gateway = ''
if (ENV) {
  gateway = '/gateway'
}
const blockList:string[] = []
const isInWhiteList = function(errorCode, whiteListConfig: Array<string | RegExp> = []) {
  return (
    whiteListConfig.filter(rule => {
      if (Object.prototype.toString.call(rule) === '[object RegExp]') {
        return (rule as RegExp).test(errorCode)
      } else {
        return rule === errorCode
      }
    }).length !== 0
  )
}

// 刷新token
const toRefreshToken = () => {
  const user = useUserStore()
  //@ts-ignore
  refreshToken().then((res) => {
    if (res.data.code && res.data.code !== '200') {
      // 超时跳转登录页
      user.LogOut()
    }
  });
};

// 超时时间
axios.defaults.timeout = 300000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false }) // NProgress Configuration
// HTTPrequest拦截
axios.interceptors.request.use(
  config => {
    NProgress.start() // start progress bar
    /**
     * 为防止ie浏览器缓存，针对get请求在params中添加时间戳
     * */
    if (config.method && config.method.toLocaleUpperCase() === 'GET') {
      const _t = new Date().getTime()
      if (typeof config.params === 'object') {
        config.params._t = _t
      } else {
        config.params = {
          _t: _t
        }
      }
    }

    // 判断是否含有token，若含有token则附加到header中
    const token = getToken()
    if (token) {
      config.headers[tokenTypeKey] = token; // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
      window.myToken = token;
      // config.headers[tokenTypeKey] = token
    } else {
      config.headers[tokenTypeKey] = 'Basic dnVlOnZ1ZQ=='; // 增加客户端认证
      config.headers.Authorization = 'Basic dnVlOnZ1ZQ=='; // 增加客户端认证
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// HTTPresponse拦截
axios.interceptors.response.use(
  res => {
    const user = useUserStore()
    NProgress.done()
    /**
     * 统一提示错误
     * 当数据存在code字段并且不等于success时提示错误信息
     * 并且在不提示的白名单中时统一提示
     * */
    if (res.config.url && !blockList.includes(res.config.url)) {
      if (res.data.code === '5563' || res.data.code === '2200008') {
         // token过期=>刷新
         toRefreshToken();
      } else if (res.data.code === '5560' || res.data.code === '510') {
         // 5560=>access_token无效；510=>登录信息不存在或已过期
         user.LogOut()
      } else if (
        res.data.code &&
        !(
          verifyResIsSuccess(res) ||
          isInWhiteList(res.data.code, responseCode.errorCodeWhiteList)
        )
      ) {
        tipMessage({
          message: res.data.msg,
          showClose: true,
          type: 'error',
          duration: 6000
        })
      }
    }
    return res
  },
  error => {
    NProgress.done()
    const errMsg = error.toString()
    const code = errMsg.substr(errMsg.indexOf('code') + 5)
    if (!blockList.includes(error.config.url)) {
      if (error.response && !error.response.data.success) {
        let msg = error.response.data.message
        if (msg && msg.length > 50) {
          msg = msg.substring(0, 50) + '...'
        }
        ElMessage({
          message: msg || errorCode['default'],
          type: 'error',
          duration: 5000
        })
      } else if (code.indexOf('Error') == -1) {
        ElMessage({
          message: errorCode[code] || errorCode['default'],
          type: 'error',
          duration: 5000
        })
      }
      return Promise.reject(new Error(error))
    } else {
      return {
        data: { msg: '失败',
          code: '501',
          data: false,
          detailMsg: null
        }
      }
    }
  }
)

export default axios
