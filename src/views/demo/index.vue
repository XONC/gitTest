<template>
   <BSTable ref="attachTableRef"
              @update-table="updateTable"
              v-bind="tableConfig">
        <template #columns>
          <el-table-column align="center" header-align="center" label="业务类型" prop="bizTypeName" show-overflow-tooltip />
          <el-table-column align="center" header-align="center" label="动态附件名称" prop="attTypeName" show-overflow-tooltip/>
        </template>
      </BSTable>
    
    <selectTree></selectTree>

    <echartsBox/>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
    <p>aa</p>
</template>
<script lang="ts" setup>
import {reactive} from 'vue'
import echartsBox from '@/views/components/echartsBox.vue'

import { getUserAndAttRangeAll} from '@/api/common'
const tableConfig = reactive({
  // 接口地址
  url: getUserAndAttRangeAll,
  // 请求参数
  params: {},
  // 过滤
  query: {
    // 过滤项目
    search: '',
    status: 1
  },
  // 是否分页
  showPagination: true,
  // 每页显示数据条数
  pageSize: 10,
  // 每页允许显示数量列表
  pageSizes: [10, 20, 50, 100],
  // 默认排序字段
  defaultSort: {
    prop: 'attTypeCode',
    order: 'ascending'// ascending||descending
  }
})
function updateTable(data) {
  data.rows = data.data.list
  data.total = data.data.total
}
</script>