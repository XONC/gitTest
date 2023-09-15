import { pspBaseUrl, baseUrl, authBaseUrl } from '@/global/env'
import request from '@/utils/axios'
import md5 from 'js-md5'

/**
 * 获取用户信息
 * */
export function loginByUsername(username, password, grant_type, code) {
  if (grant_type === 'password') {
    username = '1$#$' + username;
    password = md5(password)
  }
  const data = {
    username,
    password,
    grant_type,
    code
  }
  return request({
    url: `${authBaseUrl}/oauth/token`,
    method: 'POST',
    data,
    transformRequest: [function(data) {
      // Do whatever you want to transform the data
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 获取用户信息
 * */
export const getUserInfo = () => {
  return request({
    url: `${pspBaseUrl}/v1/system/user/info`,
    method: 'GET'
  })
}

/**
 * 获取用户权限菜单
 * */
export function getUserMenu() {
  return request({
    url: `${pspBaseUrl}/v1/system/function/getUserFunctionBySelf`,
    method: 'GET'
  })
}

/**
 * 获取系统名称
 * */
export function getSystemTitle() {
  return request({
    url: `${pspBaseUrl}/v1/auth/findTitle`,
    method: 'GET'
  })
}
/**
 * 退出
 * */
export function logout(token) {
  return request({
    url: `${authBaseUrl}/oauth/revokeToken`,
    method: 'post',
    data: {
      access_token: token
    }
  })
}
