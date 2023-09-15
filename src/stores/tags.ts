import { setStore, getStore, removeStore } from '@/utils/store'
import { defineStore } from 'pinia'
const tagObj = {
  label: '',
  value: '',
  query: '',
  num: '',
  close: true
}

function setFistTag(list) {
  if (list.length === 1) {
    list[0].close = false
  } else {
    list.some(a => {
      a.close = true
    })
  }
  return list
}

export const useTagsStore = defineStore('tags', {
  state: ()=>({
    tagList: getStore({ name: 'tagList' }) || [],
    tag: getStore({ name: 'tag' }) || tagObj,
    tagMain: {
      label: '首页',
      value: '/main'
    },
    tagCurrent: getStore({ name: 'tagCurrent' }) || []
  }),
  actions: {
    ADD_TAG(action) {
      this.tag = action
      setStore({ name: 'tag', content: this.tag, type: 'session' })
      if (this.tagList.some(a => a.value === action.value)) return
      this.tagList.push({
        label: action.label,
        value: action.value,
        query: action.query
      })
      this.tagList = setFistTag(this.tagList)
      setStore({ name: 'tagList', content: this.tagList, type: 'session' })
    },
    // 更新标签
    UPDATA_TAG(action) {
      const tagIndex = this.tagList.findIndex(item => item.value === action.value)
      this.tagList.splice(tagIndex, 1, {
        label: action.label,
        value: action.value,
        query: action.query
      })
    },
    SET_TAG_CURRENT(tagCurrent) {
      this.tagCurrent = tagCurrent
      setStore({ name: 'tagCurrent', content: this.tagCurrent, type: 'session' })
    },
    SET_TAG(value) {
      this.tagList.forEach((ele, num) => {
        if (ele.value === value) {
          this.tag = this.tagList[num]
          setStore({ name: 'tag', content: this.tag, type: 'session' })
        }
      })
    },
    DEL_ALL_TAG(action) {
      this.tag = tagObj
      this.tagList = []
      // this.tagList.push(this.tagMain)
      removeStore({ name: 'tag' })
      removeStore({ name: 'tagList' })
    },
    DEL_TAG_OTHER(action) {
      this.tagList.forEach((ele, num) => {
        if (ele.value === this.tag.value) {
          this.tagList = this.tagList.slice(num, num + 1)
          this.tag = this.tagList[0]
          this.tagList[0].close = false
          setStore({ name: 'tag', content: this.tag, type: 'session' })
          setStore({ name: 'tagList', content: this.tagList, type: 'session' })
        }
      })
    },
    DEL_TAG(action) {
      this.tagList.forEach((ele, num) => {
        if (ele.value === action.value) {
          this.tagList.splice(num, 1)
          this.tagList = setFistTag(this.tagList)
          setStore({ name: 'tag', content: this.tag, type: 'session' })
          setStore({ name: 'tagList', content: this.tagList, type: 'session' })
        }
      })
    }
  }
})
