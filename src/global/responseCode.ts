import errorCode from './errorCode'
const errorCodeWhiteList = [/^451/, /^452/, '5531', '5563', '5560']

export default {
  success: '200',
  errorCode: errorCode,
  // 不统一提示错误的：白名单
  errorCodeWhiteList: errorCodeWhiteList
}
