<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <div style="margin-bottom:10px;">
          </div>
          <el-table :data="tableData" style="width: 100%" :stripe="true" :border="true" @selection-change="selectionChange">
            <el-table-column prop="identity" label="identity"></el-table-column>
            <el-table-column prop="source" label="source"></el-table-column>
            <el-table-column prop="target" label="target"></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { fetchLinks } from '@/api/link'

export default {
  name: 'hostlist',
  data() {
    return {
      form: {
        name: '',
        ips: ''
      },
      tableData: [],
      fetchSuccess: true,
      tableSelections: [],
      dialogVisible: false,
      hostInEdit: {},
      tagInputVisible: false,
      tagInputValue: ''
    }
  },
  methods: {
    loadData: function() {
      fetchLinks({})
        .then(response => {
          console.log(response)
          var data = response['data']
          this.tableData = data['links']
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    }
  },
  mounted() {},
  created() {
    this.loadData()
  }
}
</script>

<style scoped>
.content-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
.box-card {
  margin: 0px 5px;
}
.links-icon {
  width: 24px;
  height: 24px;
}
.input-new-tag {
  width: 100px;
}
</style>

