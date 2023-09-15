<template>
  <div class="work-platform flex-box height-full">
    <el-row>
      <el-col :span="24">
        <div class="marginBottom">
          <ProjectSchedule />
          <!--<CommonFunctions />-->
        </div>
      </el-col>
      <div style="background: #fff;float: left;width: 100%;" class="bottom-wrap">
        <el-col :span="12">
          <div  class="marginRight">
            <TodoMessage />
          </div>
        </el-col>
        <el-col :span="12" style="height: 100%;">
          <div>
            <BusinessMatters />
          </div>
        </el-col>
      </div>
    </el-row>

  </div>
</template>

<script>
import ProjectSchedule from '@/page/home/components/project-schedule'
import TodoMessage from '@/page/home/components/todo-message'
import BusinessMatters from '@/page/home/components/business-matters'

export default {
  name: 'homeIndex',
  components: {
    ProjectSchedule,
    TodoMessage,
    BusinessMatters
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .marginBottom {
    margin-bottom: 10px;
  }
  .marginRight {
    border-right: 10px solid $bgColors;
    height: 100%;
  }
  .marginLeft {
    border-left: 10px solid $bgColors;
    height: 100%;
  }
  .bottom-wrap{
    display: flex;
    .el-col{
      flex: 1;
    }
  }
</style>
