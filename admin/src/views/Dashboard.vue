<template>
  <div class="dashboard">
    <div id="chart" ref="chart" style="width: 100%; height: 300px"></div>
    <el-table width="300px" :data="items">
      <el-table-column prop="title" label="文章名称"></el-table-column>
      <el-table-column prop="read" label="查阅量"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import ECharts from 'echarts'

export default {
  data() {
    return {
      items: [],
      chartCategory: [],
      chartScore: []
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get('rest/articles')
      this.items = res.data
      for (let value of res.data) {
        value.categories
      }
      await this.getCharData()
      await this.setChart()
      // console.log(res)
    },
    async setChart() {
      let chartDom = document.getElementById('chart');
      let myChart = ECharts.init(chartDom);
      let option;

      // console.log(this.chartCategory)
      option = {
        grid: {//直角坐标系内绘图网格
          // show: true,//是否显示直角坐标系网格。[ default: false ]
          // left: '20%',//grid 组件离容器左侧的距离。
          // right: '30px',
          // borderColor: '#c45455',//网格的边框颜色
          bottom: '100px' //
        },
        xAxis: {
          type: 'category',
          data: this.chartCategory,
          axisLabel : {//坐标轴刻度标签的相关设置。
            formatter : (params) => {
              let newParamsName = "";// 最终拼接成的字符串
              let paramsNameNumber = params.length;// 实际标签的个数
              let provideNumber = 4;// 每行能显示的字的个数
              let rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (let p = 0; p < rowNumber; p++) {
                  let tempStr = "";// 表示每一次截取的字符串
                  let start = p * provideNumber;// 开始截取的位置
                  let end = start + provideNumber;// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber);
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + "\n";
                  }
                  newParamsName += tempStr;// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params;
              }
              //将最终的字符串返回
              return newParamsName
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.chartScore,
          type: 'line'
        }]
      };

      option && myChart.setOption(option);
    },
    async getCharData() {
      let category = []
      let score = []
      for (let item of this.items) {
        category.push(item.title)
        score.push(item.read)
      }
      // console.log(category)
      this.chartCategory = category
      this.chartScore = score
    }
  },
  created() {
    this.fetch()
  },
  mounted() {
    this.setChart()
  }
}
</script>