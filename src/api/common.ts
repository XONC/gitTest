import { pspBaseUrl, baseUrl, authBaseUrl } from '@/global/env'
import request from '@/utils/axios'

// 查看列表
export function getUrlConfigByUrlCode(params) {
  return request({
    url: `${pspBaseUrl}/v1/system/urlconfig/getUrlConfigByUrlCode`,
    method: 'GET',
    params
  })
}