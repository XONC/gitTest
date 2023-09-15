// 环境
const ENV = process.env.NODE_ENV !== 'development'
const gatewayConfig = {
  // 网关是否开启
  enable: false,
  // 网关登陆地址
  url: `${window.globalConfig.gatewaySys.GATE_WAY_ORIGIN}/gp-auth-center/login?loginRedirectUrl=${location.href}/`,
  // 网关退出地址
  logoutUrl: `${window.globalConfig.gatewaySys.GATE_WAY_NGINX}/gateway/api/oauth/logout`,
  // 采购人用户管理
  gpbpGpbpUrl: `${window.globalConfig.gatewaySys.GATE_WAY_NGINX}/all-portal/gpbp-gpbp/#/systemManagement/user/regulatorsuser`
}
if (!ENV) {
  gatewayConfig.enable = false
} else {
  gatewayConfig.enable = true
}
export default gatewayConfig
