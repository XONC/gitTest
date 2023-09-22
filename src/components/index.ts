import BSTable from '@/components/bs-table/bs-table.vue'
import selectTree from '@/components/input/selectTree.vue'
import loadmore from '@/components/directive/tableLazy'

export default {
  install: (app, options) => {
    // 注入一个全局可用的 $translate() 方法
    // app.config.globalProperties.$translate = (key) => {
    //   // 获取 `options` 对象的深层属性
    //   // 使用 `key` 作为索引
    //   return key.split('.').reduce((o, i) => {
    //     if (o) return o[i]
    //   }, options)
    // }
    
    // 带分页表格
    app.component('BSTable', BSTable)

    // 树
    app.component('selectTree',selectTree)

    // 注册指令
    app.directive('loadmore', loadmore)
  }
}