//@ts-nocheck
import { iframeTxt, tokenTypeKey } from '@/global/constant'
import { uploaderUrl } from '@/global/env'
import Layout from '@/page/index/index.vue'
import Cookies from 'js-cookie'
import responseCode from '@/global/responseCode'
import type {Router, RouteRecordRaw} from 'vue-router'
/**
 * 跨应用路由跳转
 * @param {String} href url地址
 * @param {Object} stateObj 状态参数 可以通过history.state读取
 * @param {String} title 标题 暂时没有用
 */
 export const routerGo = (href = '/', title = '', stateObj = {}) => {
  window.history.pushState(stateObj, title, href);
}

/**
 * 总体路由处理器
 */
 export const resolveUrlPath = (url, javaEvent) => {
  let reqUrl = ''
   if (javaEvent) {
     reqUrl = javaEvent + url
   } else {
     reqUrl = url
   }
  return reqUrl
}

export const initMenu = (router: Router, menu) => {
  if (menu.length === 0) {
    return
  }
  let SonApp = window.globalConfig.subAppConfigs
  let subAppRouter: RouteRecordRaw[] = []
  SonApp.forEach(item => {
    subAppRouter.push({
      path: '/' + item.name,
      component: Layout,
      name: item.name,
      meta: {
        title: '子系统模块'
      },
      children: formatRoutes('/' + item.name, menu)
    })
  })
  subAppRouter.forEach(item=>{
    router.addRoute(item)
  })
}

export const formatRoutes = (filed, aMenu) => {
  let aRouter:RouteRecordRaw[] = []
  aMenu.forEach(oMenu => {
    const { path, url, name, meta, icon, children } = oMenu
    if (filed == url) {
      const oRouter = {
        path: filed + path, // 子系统路由
        name: name,
        meta: { ...meta, ...{ icon: icon }, ...{ funId: oMenu.funId }, ...{ sys: filed }},
        icon: icon
      }
      //@ts-ignore
      aRouter.push(oRouter)
    }
  })
  return aRouter
}

/**
 * 获取行数据实际序号
 * filed 子数组
 * @param tableRef table $refs实例
 * @param index 当前页行索引
 */
export const tableRowIndex = function(tableRef, index, scope, filed) {
  // 包含子元素
  if (scope && scope.parentRow) {
    let $index = tableRef.option.data ? tableRef.option.data.indexOf(scope.parentRow) : 0
    if (scope.parentRow[filed] && scope.parentRow[filed].length > 1) {
      return (Number((tableRef.option.activeIndex - 1) * tableRef.option.pageSize) + (Number($index) + 1)) + '-' + (Number(index) + 1)
    }
    return (Number((tableRef.option.activeIndex - 1) * tableRef.option.pageSize) + Number($index) + 1)
  } else {
    return (
      Number((tableRef.option.activeIndex - 1) * tableRef.option.pageSize) +
      Number(index) +
      1
    )
  }
}

/**
 * 格式化树
 */
 export const buildTree = (list, idKey, pidKey, childrenKey) => {
  const temp = {}
  const tree: any[] = []
  list.forEach(item => {
    temp[item[idKey]] = item
  })
  Object.keys(temp).forEach(key => {
    // 节点数据
    const item = temp[key]
    // 父级节点数据
    const parentId = item[pidKey]
    if (parentId && temp[parentId]) {
      const parentNode = temp[parentId]
      if (!parentNode[childrenKey]) {
        parentNode[childrenKey] = []
      }
      parentNode[childrenKey].push(item)
    } else {
      tree.push(item)
    }
  })
  return tree
}
/**
 * 深拷贝
 */
 export const clone = obj => {
  let copy

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

/**
 * todo 待确认唯一校验方式
 * 判断字段是否在后台已存在校验
 * @params {Object} res ajax返回结果
 * @return {Boolean} true:数据不重复，false 该数据在数据库存在
 * */
 export const verifyResIsSuccess = function(res) {
   if (res.data.code) {
     return res.data.code === responseCode.success
   } else {
     return res.data.status == responseCode.success // token过期或失效修改之前的responseCode
   }
}

/**
 * 设置浏览器头部标题
 */
export const setTitle = function(title) {
  window.document.title = title
}
/**
 * 浏览器判断是否全屏
 */
// export const fullscreenToggel = () => {
//   if (fullscreenEnable()) {
//     exitFullScreen()
//   } else {
//     reqFullScreen()
//   }
// }
// 判断是否监听全屏标识符
let isListenfullscreen = false
/**
 * esc监听全屏
 */
export const listenfullscreen = callback => {
  if (isListenfullscreen) {
    return false
  }

  function listen() {
    callback()
  }

  document.addEventListener('fullscreenchange', function(e) {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function(e) {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function(e) {
    listen()
  })
  document.addEventListener('msfullscreenchange', function(e) {
    listen()
  })
  isListenfullscreen = true
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  )
}

// /**
//  * 浏览器全屏
//  */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}

// /**
//  * 浏览器退出全屏
//  */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}

/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

/**
 * 动态插入css
 */
export const loadIcon = () => {
  const iconUrl = Cookies.get('iconUrl')
  if (iconUrl) {
    const link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = (window.globalConfig.isGateWay ? '/gateway' : '') + iconUrl
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(link)
  }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
//  */
export const throttle = function(method, mustRunDelay) {
  let timer, start
  const args = arguments

  return function loop() {
    const self = this
    const now = Date.now()
    if (!start) {
      start = now
    }
    if (timer) {
      clearTimeout(timer)
    }
    if (now - start >= mustRunDelay) {
      method.apply(self, args)
      start = now
    } else {
      timer = setTimeout(function() {
        loop.apply(self, args)
      }, 50)
    }
  }
}
// /**
//  * 防抖函数
//  * @param method 事件触发的操作
//  * @param delay 多少毫秒内连续触发事件，不会执行
//  * @returns {Function}
//  */
export const debounce = function(method, delay) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    timer && clearTimeout(timer)
    timer = setTimeout(function() {
      method.apply(self, args)
    }, delay)
  }
}

/*
 * 查询IE版本*/
export const IEVersion = function() {
  const userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
  const isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
  const isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp.$1)
    if (fIEVersion === 7) {
      return 7
    } else if (fIEVersion === 8) {
      return 8
    } else if (fIEVersion === 9) {
      return 9
    } else if (fIEVersion === 10) {
      return 10
    } else {
      return 6 // IE版本<=7
    }
  } else if (isEdge) {
    return 'edge' // edge
  } else if (isIE11) {
    return 11 // IE11
  } else {
    return -1 // 不是ie浏览器
  }
}

/*
 * 是否IE浏览器*/
export const isIE = function() {
  return IEVersion() !== -1
}

/*
 * 监管token暂存一份session
 * */
export const tokenResetSession = function() {
  const token = Cookies.get(tokenTypeKey)
  if (token) sessionStorage.setItem(tokenTypeKey, token)
}
/*
 * token变了刷新界面
 * */
export const tokenReset = function(callback) {
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      const tokenLocal = Cookies.get(tokenTypeKey)
      const session = sessionStorage.getItem(tokenTypeKey)
      if (tokenLocal && session && tokenLocal != session) {
        let url = `${location.origin}${location.pathname}#/main`
        location.href = url
        if (typeof callback === 'function') {
          callback()
        }
      }
    }
  })
}

// 是否Iframe模式
export const isIframe = function() {
  return window.globalConfig.systemTemp.isIframe || location.href.indexOf(iframeTxt) !== -1
}

 /* 下载网络图片 */
 export const downloadFileUtil = (url, filename) => {
  getBlob(url, (blob) => {
    saveAs(blob, filename);
  });
}
function getBlob(url, cb) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
}
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator?.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement('a');
    let body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    body?.appendChild(link);
    link.click();
    body?.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}

// 去重 arr需要去重的list, key去重所需的字段
export const deduplication = function(arr, key) {
  var newobj = {}; var newArr:any[] = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    if (!newobj[item[key]]) {
        newobj[item[key]] = newArr.push(item)
    }
  }
  return newArr;
}

// 判断是否是一个对象
export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 判断一个对象是否是空对象
export const isEmptyObject = (obj) => {
  if (isObject(obj)) {
    return Object.keys(obj).length === 0
  }
  return false
}

/**
 * 总体路由设置器
 */
 export const setUrlPath = $route => {
  let value = ''
  if ($route.query.src) {
    value = $route.query.src
  } else {
    if ($route.path.indexOf('statistical-report') != -1) {
      const titleCurrent = JSON.parse(sessionStorage.getItem('gpm-gpms-major-tag'))
      if (titleCurrent && titleCurrent.content[0]) {
        value = $route.path + titleCurrent.content[0].label
      }
    } else {
      value = $route.path + $route.name
    }
  }
  return value
}

/**
 * 数字格式化
 * 参数说明：
 * @param number：要格式化的数字
 * @param decimals：保留4位小数
 * @param dec_point：小数点符号
 * @param thousands_sep：万分位符号
 * @param roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
 * */
export const numberFormat = function(
  number,
  decimals = 0,
  dec_point,
  thousands_sep = '',
  roundtag = 'ceil'
) {
  const divid = window.globalConfig.amountDivided ? window.globalConfig.amountDivided : 4
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep
  const dec = typeof dec_point === 'undefined' ? '.' : dec_point
  let s:string[] = []
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec)
    return (
      '' +
      parseFloat(
        Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)
      ) /
      k
    )
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  // 这里的数字是 4个数字加一个 ，/(-?\d+)(\d{})/
  const re = new RegExp('(-?\\d+)(\\d{' + divid + '})')
  if (sep) {
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

/**
 * 计算一个数字是几位小数
 * */
export const getDecimalNumber = function(num) {
  if (typeof (num) === 'number') {
    let numArr = num.toString().split('.')
    return numArr.length > 1 ? numArr[1].length : numArr.length
  }
  return 0
}
/**
 * 返回高亮Html字符串
 * @param {String} string 文本
 * @param {String} searchText 搜索文字
 * @param {String} background 高亮背景
 * @param {String} color 高亮文字颜色
 * @return {String}
 * */
export const getHighlightHtmlStrByString = function(
  string = '',
  searchText = '',
  background = 'rgba(244,0,0,0.5)',
  color = 'white'
) {
  if (searchText) {
    const HighlightHtmlStr = `<span style="background: ${background};color:${color}">${searchText}</span>`
    return string.replace(new RegExp(searchText, 'g'), HighlightHtmlStr)
  } else {
    return string
  }
}
/**
 * 获取get请求方式的参数
 * @param url ge请求的url
 * @returns 参数的值
 */
export const getDownloadUrl = function(url, name) {
  const urlCode = `${uploaderUrl}/download.html?url=/${url}&fileName=${name}`
  return encodeURI(urlCode)
}
/**
 * 下载文件
 * @param url ge请求的url
 * @param name 参数
 * @returns 参数的值
 */
export const downloadByUrl = function(url, name) {
  const downloadDom = document.createElement('iframe')
  downloadDom.setAttribute('src', url)
  downloadDom.setAttribute('style', ' display: none')
  document.body.appendChild(downloadDom)
  downloadDom.onload = function() {
    downloadDom.remove()
  }
}
export const base64Encode = function(str) {
  const encode = encodeURI(str)
// 对编码的字符串转化base64
  const base64 = btoa(encode)
  if (base64) {
    return encodeURIComponent(base64)
  }
}
