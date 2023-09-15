'use strict';
export const config = {
  title: '采购电子档案系统',
  // 前缀项目路径
  PROJECT_NAME: 'psp-web',
	/* 线上 输出文件路径 */
	OUTPUT_FILE: '/micro-psp-web/',
  // 一级域名
  DEV_SERVER_ORIGIN: 'https://dev.gcycloud.cn',
  // 本地上传文件二级域名
  UPLOAD_PATH: '/psp-uploader',
  // 工作流域名
  WF_SERVE: '/wf',
  // 工作流服务地址
  WF_SERVE_PATH: 'http://192.168.101.56:8765',
  // 本地开发地址
  DEV_SERVER_PATH: 'http://192.168.101.82:8765',
  // DEV_SERVER_PATH: 'https://test.gcycloud.cn/psp-gateway', // 测试环境地址
  // DEV_SERVER_PATH: 'http://117.78.19.87:8077', //改为后端ip
  // 采购需求服务名
  PROCUREMENT_PATH: '/psp-procurement', 
  // 采购需求服务Ip
  PSPPROCURMENT_SERVER_PATH: 'http://117.78.19.87:8077', //改为后端ip
  // 预览服务
  PREVIEW_SERVER_NAME: '/gpx-preview', 
  // 预览服务
  PREVIEW_SERVER_PATH: 'https://dev.gcycloud.cn', 
};

