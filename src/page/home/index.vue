<!-- 预算管理-->
<template>
  <div class="child-view">
    <PageDetail v-if="!pageActiveType" />
    <PageTable v-else-if="pageActiveType == 'table'" />
    <BusMatters v-else-if="pageActiveType == 'busMatters'" />
  </div>
</template>

<script>
import PageDetail from './detail.vue'
import PageTable from '@/page/more-project-schedule/index'
import recordKeeyAlive from '@/mixins/recordKeeyAlive'
import BusMatters  from '@/page/more-business-matters/index'

export default {
  name: 'buyplanIndex',
  mixins: [recordKeeyAlive('page')],
  components: {
    PageTable,
    PageDetail,
    BusMatters
  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style scoped></style>
