
export default {
  bind(el, binding) {
    if (binding.value) {
      let p = 0
      let t = 0
      let down = true
      let selectWrap = el.querySelector('.el-table__body-wrapper')
      selectWrap.addEventListener( 'scroll', function(e) {
        p = e.scrollTop
        if (t < p) {
          down = true
        } else {
          down = false
        }
        t = p;
        const sign = 300
        const scrollDistance = e.scrollHeight - e.scrollTop - e.clientHeight
        if (scrollDistance <= sign && down) {
          binding.value()
        }
      })
    }
  }
}
