/**
 * ts.config.node.json 的ts 配置对应vite
 * tsconfig.app.json 的ts 配置对应src
 * 
 */

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {execSync} from 'child_process'
import { createHtmlPlugin } from 'vite-plugin-html'
import {config} from './config'

const devBaseUrl = `/${config.PROJECT_NAME}/`;
const devSubBaseUrl = '/modules-psp/';
const DEV_SERVER_PATH = `${config.DEV_SERVER_PATH}`;
const uploaderUrl = `${config.UPLOAD_PATH}`;
const DEV_UPLOAD_PATH = `${config.PREVIEW_SERVER_PATH}` + uploaderUrl
const WF_SERVE = `${config.WF_SERVE}`
const WF_PATH = `${config.WF_SERVE_PATH}` + WF_SERVE
const previewUrl = `${config.PREVIEW_SERVER_NAME}`
const previewPath = `${config.PREVIEW_SERVER_PATH}` + previewUrl
// const publicPath = config.OUTPUT_FILE;
const publicPath = process.env.NODE_ENV === 'production' ? `${config.OUTPUT_FILE}` : `./`;
const pspProcurement = `${config.PROCUREMENT_PATH}`;
const PSPPROCURMENT_SERVER_PATH = config.PSPPROCURMENT_SERVER_PATH

// const commitDate = execSync('git log -1 --format=%cI').toString().trimEnd();
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd();
// const commitHash = execSync('git rev-parse HEAD').toString().trimEnd();
// const lastCommitMessage = execSync('git show -s --format=%s').toString().trimEnd();
const lastTag = execSync('git describe --abbrev=0 --tags ').toString().trimEnd();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          //获取标题变量
          TITLE: config.title,
          VERSION: lastTag,
          BRANCH: branchName,
        },
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 所以这里假设你有 `src/variables.scss` 这个文件
        additionalData: `@import "./src/assets/scss/variables.scss";`,
        sassOptions: {
          outputStyle: 'expanded'
        }
      },
    },
  },
  server: {
    open: false,
    // 配置项目端口
    port: 5173,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      // [devBaseUrl]: {
      //   target: DEV_SERVER_PATH,
      //   ws: true,
      //   changeOrigin: true,
      //   // logLevel: 'debug',
      //   rewrite: (path)=> path.replace(new RegExp(`^${devBaseUrl}`), '/')
      // },
      // [WF_SERVE]: {
      //   target: WF_PATH,
      //   ws: true,
      //   changeOrigin: true,
      //   // logLevel: 'debug',
      //   rewrite: (path)=>path.replace(new RegExp(`^${WF_SERVE}`),'/')
      // },
      // [devSubBaseUrl]: {
      //   target: DEV_SERVER_PATH,
      //   ws: true,
      //   changeOrigin: true,
      //   // logLevel: 'debug',
      //   rewrite: (path)=>path.replace(new RegExp(`^${devSubBaseUrl}`),'/')
      // },
      // [uploaderUrl]: {
      //   target: DEV_UPLOAD_PATH,
      //   ws: true,
      //   changeOrigin: true,
      //   rewrite: (path)=>path.replace(new RegExp(`^${uploaderUrl}`),'/')
      // },
      // [pspProcurement]: {
      //   target: PSPPROCURMENT_SERVER_PATH + pspProcurement,
      //   ws: true,
      //   changeOrigin: true,
      //   rewrite: (path)=>path.replace(new RegExp(`^${pspProcurement}`),'/')
      // },
      // [previewUrl]: {
      //   target: previewPath,
      //   ws: true,
      //   changeOrigin: true,
      //   rewrite: (path)=>path.replace(new RegExp(`^${previewUrl}`),'/')
      // },
      // '/modules-announcement': {
      //   target: 'http://192.168.101.101:3333',
      //   ws: true,
      //   changeOrigin: true,
      //   rewrite: (path)=>path.replace(new RegExp('^/dules-announceme'),'/')
      // }
      // dev环境
      
      '/psp-web/api': {
        target: 'https://dev.gcycloud.cn/psp-gateway/psp-gateway',
        changeOrigin: true,
        rewrite: (path) =>path.replace(/^\/psp-web\/api/, ''),        
      },
      '/api/admin/psp-admin': {
        target: 'https://dev.gcycloud.cn/psp-gateway/psp-gateway/admin/psp-admin',
        ws: true,
        changeOrigin: true,
        rewrite:  (path) => path.replace(/^\/api\/admin\/psp-admin/,'')
      },

      // test环境
      // '/psp-web/api': {
      //           target: 'https://test.gcycloud.cn/psp-gateway/psp-gateway',
      //           ws: true,
      //           changeOrigin: true,
      //           rewrite: (path) => path.replace(new RegExp('/psp-web/api'),'')
      //         },
        //       '/api/admin/psp-admin': {
        //         target: 'https://test.gcycloud.cn/psp-gateway/psp-gateway',
        //         ws: true,
        //         changeOrigin: true,
        //         rewrite: {
        //           [`/api/admin/psp-admin`]: '/admin/psp-admin'
        //         }
        //       },
    }
  }  
})
