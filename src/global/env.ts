import gatewayConfig from './gateway-config'
import {config} from '../../config'
import { ApiBaseUrl, WfBaseUrl, AuthBaseUrl } from '@/global/constant.js'

// 环境
const ENV = process.env.NODE_ENV !== 'development'
let baseUrl = ''
// 项目名称
const projectName = config.PROJECT_NAME
// const GATE_WAY_KEY = window.globalConfig.systemTemp.isGateWay ? '/' + config.GATE_WAY_KEY : ''
// staticUrl
let staticUrl
// APIBaseUrl
let pspBaseUrl
let wfBaseUrl
let authBaseUrl
// 上传
let uploaderUrl
// 预览
let previewUrl
// uploaderAllUrl
let uploaderAllUrl
// 网关地址
const gpsGateWay = window.globalConfig.gatewaySys.GATE_WAY_ORIGIN
if (gatewayConfig.enable) {
  pspBaseUrl = '' + ApiBaseUrl
  wfBaseUrl = '' + WfBaseUrl
  authBaseUrl = '' + AuthBaseUrl
  baseUrl = ''
  staticUrl = `/${projectName}`
  uploaderUrl = location.origin + window.globalConfig.servePath.uploaderUrl
  uploaderAllUrl = location.origin + window.globalConfig.servePath.uploaderUrl
  previewUrl = location.origin + window.globalConfig.servePath.uploaderUrl
} else {
  pspBaseUrl = `/${projectName}` + ApiBaseUrl
  wfBaseUrl = (window.globalConfig.systemTemp.isLogin ? `/${projectName}` : '') + WfBaseUrl
  authBaseUrl = `/${projectName}` + AuthBaseUrl
  baseUrl = `/${projectName}`
  uploaderUrl = window.globalConfig.servePath.uploaderUrl
  staticUrl = ``
  previewUrl = config.DEV_SERVER_ORIGIN + window.globalConfig.servePath.uploaderUrl
  uploaderAllUrl = config.DEV_SERVER_ORIGIN + window.globalConfig.servePath.uploaderUrl
}

export {
  pspBaseUrl,
  baseUrl,
  gatewayConfig,
  gpsGateWay,
  projectName,
  staticUrl,
  uploaderUrl,
  ENV,
  previewUrl,
  uploaderAllUrl,
  wfBaseUrl,
  authBaseUrl
}
