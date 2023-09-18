/// <reference types="vite/client" />
import globalConfig from './public/static/config.js'

declare global {  //设置全局属性
  interface Window {  //window对象属性
    globalConfig: typeof globalConfig;   //加入对象
    myToken: string
  }


}