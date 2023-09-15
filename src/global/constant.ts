const projectTitle = window.globalConfig.systemTemp.projectName
export const login = {}
export const header = {}
// 标题名称
export const title = projectTitle
// 底部文字
export const footer = 'Copyright © 2019 福建博思软件股份有限公司 Inc.All rights reserved'
// logo文字
export const logo = {
  title: projectTitle,
  subhead: 'Supervisory Early Warning Management System'
}
// 接口前缀
export const ApiBaseUrl = window.globalConfig.systemTemp.apiBaseUrl ? window.globalConfig.systemTemp.apiBaseUrl : ''
export const WfBaseUrl = window.globalConfig.systemTemp.wfBaseUrl ? window.globalConfig.systemTemp.wfBaseUrl : ''
export const AuthBaseUrl = window.globalConfig.systemTemp.authBaseUrl ? window.globalConfig.systemTemp.authBaseUrl : ''

// switch开关状态
export const switchStatus = {
  // 额外的数字
  other: 2,
  // 启用
  enable: 1,
  // 停用
  disable: 0,
  // 全部
  whole: ''
}
// 页面状态
export const processStatus = {
  All: '2',
  Todo: '1',
  Disable: '0'
}
// token 存储Key值字段
export const tokenTypeKey = window.globalConfig.systemTemp.tokenTypeKey ? window.globalConfig.systemTemp.tokenTypeKey : 'access_token'
// 接口获取token字段
export const responseKey = 'access_token'

// post请求时无用字段类型
export const UnnecessaryKeys = [
  // 创建时间
  'createDate',
  'createUser',
  // 最后修改时间
  'latestModifyDate',
  'latestModifyUser'
]
export const budgetStatus = [
  { value: 0, type: 'add', label: '新增' },
  { value: 1, type: 'revoke', label: '撤销' },
  { value: 2, type: 'modify', label: '调整' },
  { value: 5, type: 'moneyappend', label: '资金追加' },
  { value: 4, type: 'replace', label: '资金替换' }
]
export const buyPlanCreateType = {
  1: { type: 'add', label: '计划创建', value: 1},
  3: { type: 'revoke', label: '计划撤销', value: 3},
  4: { type: 'modify', label: '计划调整', value: 4},
}

// 按钮名称
export const buttonsNameLib = {
  // 审核
  AUDIT: 'AUDIT',
  // 新增
  ADD: 'ADD',
  // 批量删除
  DELETE_BATCH: 'DELETE_BATCH',
  // 删除
  DELETE: 'DELETE'
}
// ca接口正确code
export const CA_API_SUCCESS_CODE = '0000'
// ca接口错误Code
export const CA_API_ERROR_CODE = '9999'
export const CA_ERROR_MESSAGE = {
  noCa: '请插入CA',
  hasMoreCa: '检测到多个CA，请移除多余CA',
  getKeySnError: '获取证书用户标识失败'
}

export const iframeTxt = 'iframetxt'

export const tableWidth = {
  statusWidth: '110',
  operationWidth: '130'
}

export const initParentPage = 'initParentPage'

