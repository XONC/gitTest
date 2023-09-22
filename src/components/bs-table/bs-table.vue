<!--介于原table不支持的属性，不动原来的插件-->
<template>
  <div :class="{'bs-table-store-style':!hasBorder,'has-border':hasBorder}"
       :style="{height:height}"
       class="bs-table">
    <div :style='{height:getTalbeMainHeight}' class="bs-table-main" :class="{'card-table': isShadow}" v-loading="loading">
      <el-table
        v-bind="$attrs"
        :data="option.data"
        :height="height"
        :max-height="maxHeight"
        :row-class-name="rowClassName"
        @current-change="currentChangeTable"
        @select="selection"
        @select-all="selectionAll"
        @selection-change="selectionChange"
        ref="tableRef"
        style="width: 100%;"
        v-loadmore="loadLazy ? getMore : ''">
        <slot name="columns">
          <el-table-column :align="column.align||'center'"
                           :formatter="column.formatter"
                           :key="index"
                           :label="column.title"
                           :prop="column.field"
                           :showOverflowTooltip="column.showOverflowTooltip"
                           :width="column.width"
                           v-for="(column,index) in option.columns"
          >
          </el-table-column>
        </slot>
      </el-table>
    </div>
    <div class="bs-table-footer" v-if="created && showPagination">
      <el-pagination :current-page="option.activeIndex"
                     :layout="paginationLayout"
                     :page-size="option.pageSize"
                     :page-sizes="option.pageSizes"
                     :total="option.total"
                     @current-change="currentChange"
                     @size-change="sizeChange"
                     background
                     v-show="option.total>0">
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import type { TableInstance } from 'element-plus';
import {computed, reactive,watch, ref, watchEffect, onMounted} from 'vue'
export interface Props {
  // 接口地址
  url?: string | Function;
  // 请求延迟
  delay?: number | boolean;
  // 请求类型
  type?: string;
  // 表格分页等参数
  params?: {};
  // 查询参数
  query?: {};
  // 表格数据
  data?: any[] | {};
  // 是否分页
  showPagination: boolean;
  // 每页显示数据条数
  pageSize?: number;
  // 每页允许显示数量列表
  pageSizes?: number[];
  // 列定义
  columns?: any[];
   // 行标题过滤函数
  height?: string | number;
  maxHeight?: string | number;
  rowTitle?: Function,
  // 表格展示阴影(主要是列表)
  isShadow?: boolean;
  selfCheckedKey?: string;
  rowClassName?: string | Function;
  loadLazy?: boolean;
  customPageParam?:Function;
  paginationType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 300,
  type: 'get',
  data: ()=>[],
  showPagination: true,
  pageSize: 40,
  pageSizes: ()=>[5, 10, 15, 20],
  columns: ()=>[],
  isShadow: true,
  selfCheckedKey: '_checked',
  loadLazy: false

})
const emit = defineEmits<{
  'update-table': [data: any] // 具名元组语法
  'before-search': [data: any]
  'size-change': [data: any]
  'update:activeIndex': [data: any]
  'current-change': [data: any, oldData?:any]
  'selection-change': [data: any]
  'select': [data: any, row: any]
  'select-all': [data: any]
}>()
let CancelToken = axios.CancelToken
let cancel = ref<Function | null>(null)

const tableRef = ref<TableInstance>()
const timer = ref<NodeJS.Timeout>()
// 加载中
const loading = ref(false)
// 表格是否初次创建
const created = ref(false)
const ajaxTimer = ref(0)
let searchData = reactive({})
const loadTrue = ref(true)
console.log(props.pageSize)
// 表格参数
const option= reactive({
  type: props.type,
  params: Object.assign({}, props.params),
  query: Object.assign({}, props.query),
  data: props.data,
  total: 0,
  paginationType: props.paginationType,
  // 默认页
  activeIndex: 1,
  // 分页可选数据量以及当前页数据量
  pageSizes: props.pageSizes,
  pageSize: props.pageSize,
  columns: props.columns
})
const filterDataForSelfChecked = (data = [], selfCheckedKey) => {
  data.forEach(function(value: {}, index) {
    value[selfCheckedKey] = typeof value[selfCheckedKey] === 'undefined' ? value[selfCheckedKey] : false;
  });
};
// 分页布局(当前页数据量大于总数据量时不显示 页数选择 以及 跳页 部分)
const paginationLayout = computed(()=>{
  if (props.showPagination === false) {
    return false
  }
  return option.total > option.pageSize ? 'total, sizes, prev, pager, next, jumper' : 'total, sizes'
})
const getTalbeMainHeight = computed(()=>{
  return hasPagination ? 'calc(' + props.height + ' - 50px)' : props.height
})
const hasPagination = computed(()=>{
  return created && props.showPagination
})
const hasBorder = computed(()=>{
  return false
})
watch(()=>props.type,()=>{
  option.type = props.type
})
watch(()=>props.paginationType,()=>{
  option.paginationType = props.paginationType
  updateTableList()
})
watch(()=>props.pageSizes,()=>{
  option.pageSizes = props.pageSizes
  updateTableList()
})
watch(()=>props.pageSize,()=>{
  option.pageSize = props.pageSize
  updateTableList()
})

watch(() => props.params,(newVal)=>{
  if (newVal) {
    option.params = Object.assign({}, newVal);
    option.activeIndex = 1
    updateTableList();
  }
},{deep: true})
watch(() => props.query,(newVal)=>{
  if (newVal) {
    option.query = Object.assign({}, newVal);
    option.activeIndex = 1
    updateTableList();
  }
},{deep: true})
watch(() => props.data,(newVal)=>{
  if (newVal) {
    option.data = Object.assign({}, newVal);
    option.activeIndex = 1
    updateTableList();
  }
},{deep: true})
watch(() => props.columns,(newVal)=>{
  if (newVal) {
    option.columns = Object.assign({}, newVal);
  }
},{deep: true})

/**
     * 更新表格数据,根据vm.url参数向后端判断
     * */
function updateTableList(lazyLoad?:any) {
  // 清除重复请求
  console.log('cancel',cancel.value)
  if (cancel.value) {
    cancel.value();
  }
  // 根据是否传入url参数判断要发接口还是直接将数据于总页数
  if (props.url && (props.url.length || typeof props.url === 'function')) {
    const params = getTableParams();
    const send = typeof props.url === 'function' ? props.url(params) : axios[props.type](props.url, {
      params: getTableParams(),
      cancelToken: new CancelToken(function executor(c) {
        cancel.value = c;
      })
    });
    loading.value = !lazyLoad
    console.log(props.delay)
    // 防止重复请求
    if (props.delay) {
      timer.value = setTimeout(() => {
        send.then((res) => {
          if (!lazyLoad) {
            emit('update-table',res.data)
            loading.value = false;
            // 根据是否开启分页判断总数
            filterDataForSelfChecked(res.data.rows, props.selfCheckedKey);
            option.data = res.data.rows
            option.total = res.data.total
            if (res.data.rows.length == option.pageSize) {
              loadTrue.value = true
            } else {
              loadTrue.value = false
            }
          } else {
            let param = res.data.data
            if (param && param.length > 0) {
              if (JSON.stringify(param[param.length - 1]).indexOf('合计') != -1) {
                param.splice(param.length - 1, 1)
              }
            }
            let nowData = (option.data as []).concat(param)
            option.data = nowData
            if (!(param && param.length < option.pageSize)) {
              loadTrue.value = true
            } else {
              loadTrue.value = false
            }
          }
          // 检测是否为初次创建 并改变
          if (!created.value) {
            created.value = true;
          }
        }).catch((error) => {
          console.log(error);
          loading.value = false;
        });
      }, props.delay as number);
    }
    //  数据传入方式
  } else {
    emit('update-table', props.data)
    option.data = props.data
    option.total = (props.data as []).length
    created.value = true;
  }
}

function getMore() {
  if (loadTrue.value) {
    loadTrue.value = false
    option.activeIndex = ++option.activeIndex
    updateTableList(true)
  }
}
// 合并获取表格过滤参数等数据
function getTableParams() {
  let params = {
  // 当前页
    pageNumber: option.activeIndex,
    pageNum: option.activeIndex, // 不同的接口分页参数不同
    // 当前页容量
    pageSize: option.pageSize,
  };
  // 由外部自定义分页参数
  props.customPageParam && props.customPageParam(params,option)
  Object.assign(params, option.params, option.query, searchData)
  emit('before-search', params)
  return params
}
/**
 * 获取表格数据
 * */
function getData() {
  return option.data;
}
function search(search) {
  clearSearch();
  // 初始化页面
  option.activeIndex = 1
  Object.assign(searchData, search);
  updateTableList()
}
// 清除上次查询参数
function clearSearch() {
  searchData = reactive({});
}
// 向上传递分页变更事件
function sizeChange(val) {
  option.pageSize = val;
  updateTableList();
  emit('size-change', val)
}
// 向上传递分页变更事件
function currentChange(val) {
  option.activeIndex = val;
  updateTableList();
  emit('update:activeIndex', val);
  emit('current-change', val);
}
function currentChangeTable(currentRow, oldCurrentRow) {
  emit('current-change', currentRow, oldCurrentRow);
}
function selectionChange(selection) {
  emit('selection-change', selection)
}
function selection(selection, row) {
  emit('select', selection, row)
}
function selectionAll(selection) {
  emit('select-all', selection)
}
// 集成el-table方法
function setCurrentRow(row) {
  tableRef.value && tableRef.value.setCurrentRow(row)
}
// 切换行选择状态
function toggleRowSelection(row, selected) {
  tableRef.value && tableRef.value.toggleRowSelection(row, selected)
}
onMounted(()=>{
  updateTableList()
})
defineExpose({
  setCurrentRow,
  toggleRowSelection,
})
</script>

<style lang="scss">
.card-table{
  // padding: 15px 0 25px;
  background: #fff;
  border-radius: 0 4px 4px 4px;
  // margin-bottom: 20px;
}
.bs-table-footer {
  display: flex;
  justify-content: end;
  margin-top: 15px;
}
</style>
