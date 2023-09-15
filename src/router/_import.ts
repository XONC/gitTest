// 首先把你需要动态路由的组件地址全部获取
let modules = import.meta.glob('../**/*.vue')
console.log(modules)
export const _import = (file, path) =>{ 
  if (!path) path = 'page'
   // 然后动态路由的时候这样来取
  return modules[`../${path}/${file}.vue`]
} 