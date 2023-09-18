import './assets/scss/index.scss'
// vue相关
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// element-plus 相关
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 登录相关
import './permission'
// 自定义全局组件
import globalComponents from '@/components/index'

const app = createApp(App)
// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, { size: 'small', locale: zhCn,})
app.use(createPinia())
app.use(router)
app.use(globalComponents,{})
app.mount('#app')
