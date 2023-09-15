import Cookies from 'js-cookie'
import { tokenTypeKey } from '@/global/constant'
// import { renewal } from "@/api/common";

export function getToken() {
  return Cookies.get(tokenTypeKey)
}

export function setToken(token) {
  return Cookies.set(tokenTypeKey, token)
}

export function removeToken() {
  return Cookies.remove(tokenTypeKey)
}
// 设置、获取、清除cookie
export function setCookie(key, value) {
  return Cookies.set(key, value)
}

export function getCookie(name) {
  return Cookies.get(name)
}

export function removeCookie(name) {
  return Cookies.remove(name)
}

// 刷新token
export const refreshToken = () => {
  // return renewal();
}
