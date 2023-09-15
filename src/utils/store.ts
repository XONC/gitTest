//@ts-nocheck
import { validatenull } from '@/utils/validate'
import { projectName } from '@/global/env'
/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const {
    name,
    content,
    type
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if (type) window.sessionStorage.setItem(`${projectName}-${name}`, JSON.stringify(obj))
  else window.localStorage.setItem(`${projectName}-${name}`, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */
export const getStore = (params) => {
  const {
    name
  } = params
  let obj: {} | string | null = {}
  let content
  obj = window.localStorage.getItem(`${projectName}-${name}`)
  if (validatenull(obj)) obj = window.sessionStorage.getItem(`${projectName}-${name}`)
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = params => {
  let {
    name
  } = params
  window.localStorage.removeItem(`${projectName}-${name}`)
  window.sessionStorage.removeItem(`${projectName}-${name}`)
}
