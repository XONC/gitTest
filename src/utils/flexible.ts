export const flexible = {
  docEl: document.documentElement,
  dpr: window.devicePixelRatio || 1,
  setBodyFontSize() {
    if (document.body) document.body.style.fontSize = (16 * this.dpr) + 'px'
    else {
      document.addEventListener('DOMContentLoaded', this.setBodyFontSize)
    }
  },
  setRemUnit() {
    var rem = document.documentElement.clientWidth / 24
    document.documentElement.style.fontSize = rem + 'px'
  },
  setListener(e) {
    if (e.persisted) {
      this.setRemUnit()
    }
  },
  setDetect() {
    if (this.dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      document.documentElement.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        document.documentElement.classList.add('hairlines')
      }
      document.documentElement.removeChild(fakeBody)
    }
  },
  setRem() {
    this.setBodyFontSize();
    this.setRemUnit();
    window.addEventListener('resize', this.setRemUnit)
    window.addEventListener('pageshow', this.setListener)
    this.setDetect()
  },
  removeRem() {
    window.removeEventListener('resize', this.setRemUnit)
    window.removeEventListener('pageshow', this.setListener)
  }
}
