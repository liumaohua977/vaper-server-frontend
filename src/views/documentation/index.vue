<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="8" style="margin-top:200px;">
     <el-button style="width:100%;height:180px;">
        <a style="width:100%;height:180px;font-size:60px;" target='_blank' href="https://vapering.github.io/vaper-docs/">
          <svg-icon icon-class="github" />
          Github Page
        </a>
     </el-button>
    </el-col>
  </el-row>
</template>
<script>
import DropdownMenu from '@/components/Share/dropdownMenu'

export default {
  name: 'documentation',
  data() {
    return {}
  }
}
</script>

