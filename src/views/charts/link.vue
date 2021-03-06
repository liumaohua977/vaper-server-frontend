<template>
<div class="chart-container">
  <el-row>
    <el-col :span="18">
      <el-card class="box-card" >
        <div id="nodes-graph" ></div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card" v-if="mainNode != undefined">
        <h3>Central Node</h3>
        <div class="text item">
          identity: {{mainNode.identity}}
        </div>
        <div class="text item">
          hostname: {{mainNode.properties.hostname}}
        </div>
        <div class="text item">
          ips: {{mainNode.properties.ips}}
        </div>
      </el-card>
      <el-card class="box-card" >
        <el-form label-width="120px">
          <el-form-item label="Deepth">
            <el-input-number v-model="deepth" @change="handleChange" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="Dimension">
            <el-radio-group v-model="dimension" @change="dimensionChange">
              <el-radio :label="2">2D</el-radio>
              <el-radio :label="3">3D</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Text on Node" v-if="dimension==2">
            <el-select v-model="pointText" placeholder="choose" @change="pointChange">
              <el-option
                v-for="item in pointTextOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card" v-if="node_hover.identity != ''">
        <div class="text item">
          <h3>Selected Node</h3>
        </div>
        <div class="text item">
          Id in Neo4j: {{node_hover.identity}}
        </div>
        <div class="text item">
          Unique id: {{node_hover.properties.uid}}
        </div>
        <div class="text item">
          hostname: {{node_hover.properties.hostname}}
        </div>
        <div class="text item">
          IP: {{node_hover.properties.ips}}
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
import ForceGraph3D from '3d-force-graph'
import axios from 'axios'
import { fetchListByIdNDeepth } from '@/api/host'
import { fetchListByUids } from '@/api/host'
import * as echarts from 'echarts'
import $ from 'jquery'

export default {
  name: 'HelloWorld',
  data() {
    return {
      nodes: [],
      nodes_rich: [],
      node_hover: {
        identity: '',
        properties: { uid: '', hostname: '', ips: [] }
      },
      link: [],
      link_rich: [],
      deepth: 1,
      mainUid: 0,
      mainNode: undefined,
      myGraph: {},
      dimension: 2,
      pointTextOptions: [
        {
          value: 'hostname',
          label: 'hostname'
        },
        {
          value: 'ips',
          label: 'ip'
        },
        {
          value: 'tags',
          label: 'Tags'
        }
      ],
      pointText: 'hostname',
      pointTextDefault: 'hostname'
    }
  },
  methods: {
    dimensionChange: function(value) {
      if (this.dimension === 2) {
        this.myGraph.resetProps()
        this.myGraph = {}
        $('#nodes-graph').html()
      } else if (this.dimension === 3) {
        this.myGraph.dispose()
      }
      this.dimension = value
      this.getNodesByIdNDeepth(this.mainUid, this.deepth)
    },
    /**
     * @augments id array
     */
    getLinks: function(uids) {
      var self = this
      axios
        .post('/api/netflow/search', { uids: uids })
        .then(function(response) {
          var links = response.data.links
          var links_ = []
          var links_rich = []
          for (let i = 0; i < links.length; i++) {
            const link = links[i]
            links_rich.push(link)
            links_.push({
              source: link.source,
              target: link.target,
              value: link.value,
              color: '#ffffff'
            })
          }
          self.links = links_
          self.links_rich = links_rich
          var dom = document.getElementById('nodes-graph')
          var width = $('#nodes-graph').width()
          if (self.dimension === 2) {
            self.initGraphByEcharts(dom, width)
          } else if (self.dimension === 3) {
            self.initGraphByForceGraph3D(dom, width)
          }
        })
        .catch(function(error) {
          console.error(error)
        })
    },
    initGraphByForceGraph3D: function(dom, width) {
      var myGraph = ForceGraph3D()(dom)
      myGraph.width(width)
      myGraph.height('600')
      myGraph.forceEngine('d3')
      myGraph.backgroundColor('#000033')
      myGraph.linkColorField('color')
      myGraph.lineOpacity(0.2)
      myGraph.colorField('color')
      myGraph.d3AlphaDecay(0.1)
      myGraph.nodeResolution(16)
      myGraph.showNavInfo(false)
      myGraph.graphData({
        nodes: this.nodes,
        links: this.links
      }) // end of graphData
      var self = this
      myGraph.onNodeHover(function(node) {
        if (node != null) {
          var uid = node.id
          var node_t = self.search_node_rich(uid)
          if (node_t !== false) {
            self.node_hover = node_t
          }
        }
      })
      this.myGraph = myGraph
    }, // end of initGraphByForceGraph3D
    initGraphByEcharts: function(dom, width) {
      var nodes = []
      var self = this
      // 处理node数据
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        nodes.push({
          name: node.identity,
          x: null,
          y: null,
          label: {
            formatter: function(params) {
              var uid = params.data.name
              var node_t = self.search_node_rich(uid)
              if (node_t !== false) {
                var labels = node_t.properties[self.pointText]
                if (labels === undefined || labels.length === 0) {
                  return node_t.properties[self.pointTextDefault]
                } else {
                  return labels
                }
              } else {
                return 'Unknown'
              }
            }
          }
        })
      }
      // 处理link数据
      var links = []
      for (i = 0; i < this.links_rich.length; i++) {
        var link = this.links_rich[i]
        links.push({
          source: link.source,
          target: link.target
        })
      }
      this.myGraph = echarts.init(dom)
      var option = {
        title: {
          text: 'graph'
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'force',
            roam: true,
            symbol: 'circle',
            symbolSize: 30,
            cursor: 'pointer',
            label: {
              position: 'right',
              normal: {
                fontSize: 12,
                show: true
              }
            },
            draggable: true,
            focusNodeAdjacency: true,
            edgeSymbol: ['none', 'none'],
            data: nodes,
            links: links,
            force: {
              initLayout: 'circle',
              repulsion: 1000
            }
          }
        ]
      } // end of option
      this.myGraph.setOption(option)
      this.myGraph.on('click', function(params) {
        var name = params.data.name
        var node = self.search_node_rich(name)
        if (node !== false) {
          self.node_hover = node
        }
      })
    }, // end of initGraphByEcharts
    getNodesByUids: function(uids) {
      var self = this
      fetchListByUids({ uids: uids })
        .then(response => {
          var data = response.data.nodes
          var uids = []
          var nodes = []
          var nodes_rich = []
          for (let i = 0; i < data.length; i++) {
            const node = data[i]
            nodes_rich.push(node)
            uids.push(node.properties.uid)
            nodes.push({
              id: node.identity,
              group: 1,
              color: '#CCFFFF'
            })
          }
          self.nodes = nodes
          self.nodes_rich = nodes_rich
          self.mainNode = self.search_node_rich_by_uid(self.mainUid)
          self.getLinks(uids)
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    },
    search_node_rich_by_uid: function(uid) {
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        if (node.properties.uid === uid) {
          return node
        }
      }
      return false
    },
    search_node_rich: function(uid) {
      for (var i = 0; i < this.nodes_rich.length; i++) {
        var node = this.nodes_rich[i]
        if (node['identity'] === uid) {
          return node
        }
      }
      return false
    },
    getNodesByIdNDeepth: function(identity, deepth) {
      var self = this
      var uids = [identity]
      fetchListByIdNDeepth({ identity: identity, deepth: deepth })
        .then(response => {
          console.log(response)
          var data = response['data']
          for (var i = 0; i < data['nodes'].length; i++) {
            var node = data['nodes'][i]
            uids.push(node['properties']['uid'])
          }
          self.getNodesByUids(uids)
          // var data = response['data']
          // this.tableData = data['nodes']
        })
        .catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
    }, // end of fetchListByIdNDeepth
    handleChange: function(value) {
      this.getNodesByIdNDeepth(this.mainUid, value)
    },
    pointChange: function() {
      this.getNodesByIdNDeepth(this.mainUid, this.deepth)
    }
  },
  mounted() {
    var params = this.$route.params
    this.mainUid = params.identity
    this.getNodesByIdNDeepth(this.mainUid, this.deepth)

    // this.getGraphData()
  },
  created() {}
}
</script>

<style scoped>
.chart-container {
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
#nodes-graph {
  width: 100%;
  height: 600px;
}
</style>

