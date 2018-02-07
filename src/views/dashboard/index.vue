<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <svg-icon icon-class="host" class-name="card-panel-icon" />
          <div class="icon-count">
            {{hostCount}}
            <span class="icon-title">Host</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <svg-icon icon-class="wang" class-name="card-panel-icon" />
          <div class="icon-count">
            {{linksCount}}
            <span class="icon-title">Links</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHostCount } from '@/api/host'
import { getLinksCount } from '@/api/host'

export default {
  name: 'dashboard',
  components: {},
  data() {
    return {
      hostCount: 0,
      linksCount: 0
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    // ...mapGetters(['roles'])
  },
  created() {
    getHostCount()
      .then(response => {
        console.log(response)
        var data = response['data']
        this.hostCount = data['node_count']
      })
      .catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    getLinksCount()
      .then(response => {
        console.log(response)
        var data = response['data']
        this.linksCount = data['linksCount']
      })
      .catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
  }
}
</script>
<style scoped>
.box-card {
  margin: 20px;
  padding: 10px;
}
.box-card .icon-count {
  margin: 10px 0px 0px 0px;
  float: right;
  font-size: 66px;
}
.box-card .icon-count .icon-title {
  color: #666666;
  font-size: 36px;
}
.card-panel-icon {
  width: 100px;
  height: 100px;
  float: left;
  margin: 0px 0px 10px 0px;
}
</style>

