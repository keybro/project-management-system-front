<template>
<!-- 地盘界面 -->
<div>
  <el-row>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-card class="box-card" style="height: 315px">
          <div style="margin-top: 20px">
            <el-statistic :value="myTaskNumber" title="我的任务" style="font-weight: bold;font-size: larger">
              <template slot="suffix">
              <span @click="toMyTask">
                <i class="el-icon-star-on" style="color:red"></i>
              </span>
              </template>
            </el-statistic>
          </div>
          <div style="margin-top: 50px">
            <el-statistic :value="myBugNumber" title="我的bug" style="font-weight: bold;font-size: larger">
              <template slot="suffix">
              <span @click="toMyBug">
                <i class="el-icon-star-on" style="color:red"></i>
              </span>
              </template>
            </el-statistic>
          </div>
          <div style="margin-top: 50px;margin-bottom: 20px">
            <el-statistic :value="myRequireNumber" title="我的需求" style="font-weight: bold;font-size: larger">
              <template slot="suffix">
              <span @click="toMyRequire">
                <i class="el-icon-star-on" style="color:red"></i>
              </span>
              </template>
            </el-statistic>
          </div>
        </el-card>
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light">
        <el-card class="box-card" style="height: 315px">
          <div slot="header" class="clearfix">
            <span>产品清单</span>
          </div>
          <div>
            <el-row>
              <el-col :span="8"  v-for="item in productList">
                <el-card shadow="hover" style="width: 95%;margin-right: 10px" :key="item" @click.native="toProduct">
                  <span>{{item.productName}}</span>
                  <div style="margin-top: 20px">
                    <span>进度:</span>
                    <div style="margin-top: 15px"></div>
                    <el-progress :text-inside="true" :stroke-width="16" :percentage="item.productRequireFinishRate" :color="customColorMethod"></el-progress>
                  </div>
                </el-card>
              </el-col>
            </el-row>

          </div>
        </el-card>

      </div>
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="8">
      <div class="grid-content bg-purple" id="round" style="height: 315px">
      </div>
    </el-col>
    <el-col :span="16">
      <div class="grid-content bg-purple-light" id="zhu" style="height: 315px">
      </div>
    </el-col>
  </el-row>
  <div style="text-align: center">
    <h2>系统访问日志</h2>
  </div>
  <el-row>
    <el-col :span="24">
      <el-table ref="tables" v-loading="loading" :data="list" :default-sort="defaultSort">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="访问编号" align="center" prop="infoId" />
        <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
<!--        <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />-->
        <el-table-column label="浏览器" align="center" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column label="登录状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作信息" align="center" prop="msg" :show-overflow-tooltip="true" />
        <el-table-column label="登录日期" align="center" prop="loginTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParamsLogLogin.pageNum"
        :limit.sync="queryParamsLogLogin.pageSize"
        @pagination="getLoginInfoList"
      />
    </el-col>
  </el-row>

    <el-row style="text-align: center">
      <h1>系统操作日志</h1>
    </el-row>
  <el-row>

<!--    系统操作日志-->
  <el-table ref="tables" v-loading="opLoading" :data="opList" :default-sort="defaultSortOp">
    <el-table-column type="selection" width="50" align="center" />
    <el-table-column label="日志编号" align="center" prop="operId" />
    <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true" />
    <el-table-column label="操作类型" align="center" prop="businessType">
      <template slot-scope="scope">
        <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.businessType"/>
      </template>
    </el-table-column>
    <el-table-column label="操作人员" align="center" prop="operName" width="110" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
    <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
    <el-table-column label="操作状态" align="center" prop="status">
      <template slot-scope="scope">
        <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
      </template>
    </el-table-column>
    <el-table-column label="操作日期" align="center" prop="operTime" width="160" sortable="custom" :sort-orders="['descending', 'ascending']">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.operTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="消耗时间" align="center" prop="costTime" width="110" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']">
      <template slot-scope="scope">
        <span>{{ scope.row.costTime }}毫秒</span>
      </template>
    </el-table-column>
<!--    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--      <template slot-scope="scope">-->
<!--        <el-button-->
<!--          size="mini"-->
<!--          type="text"-->
<!--          icon="el-icon-view"-->
<!--          @click="handleView(scope.row,scope.index)"-->
<!--          v-hasPermi="['monitor:operlog:query']"-->
<!--        >详细</el-button>-->
<!--      </template>-->
<!--    </el-table-column>-->
  </el-table>

  <pagination
    v-show="totalOp>0"
    :total="totalOp"
    :page.sync="queryParamsOp.pageNum"
    :limit.sync="queryParamsOp.pageSize"
    @pagination="getOpList"
  />



  </el-row>
</div>
</template>

<script>
import { listTask } from '@/api/system/task'
import { getInfo } from '@/api/login'
import { listProductBug } from '@/api/system/productBug'
import { listRequirement } from '@/api/system/requirement'
import { listProduct } from '@/api/system/product'
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import { list, delLogininfor, cleanLogininfor, unlockLogininfor } from "@/api/monitor/logininfor";
import { listop, delOperlog, cleanOperlog } from "@/api/monitor/operlog";

export default {
  name: 'index',
  dicts: ['sys_common_status','sys_oper_type', 'sys_common_status'],
  data(){
    return{
      myTask:null,
      queryParamsTaskList:{},
      taskList:[],
      myTaskNumber:null,
      queryParamsBugList:{},
      productBugList:[],
      myBugNumber:null,
      queryParamsRequireList:{},
      requirementList:[],
      myRequireNumber:null,
      queryParamsProductList:{},
      productList:[],
      chart:null,
      chartZhu:null,
      chartData: {
        type: Object,
        required: true
      },
      chartDataZhu:{

      },
      //登录日志请求参数
      queryParamsLogLogin:{
        pageNum: 1,
        pageSize: 10,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      },
      queryParamsOp: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      },
      //登录日志list
      list: [],
      opList:[],
      //登录日志total
      total: 0,
      totalOp:0,
      // 默认排序,登录日志用
      defaultSort: {prop: 'loginTime', order: 'descending'},
      // 默认排序
      defaultSortOp: {prop: 'operTime', order: 'descending'},
      // 遮罩层-登录日志
      loading: true,
      opLoading:true,
    }
  },
  created() {
    getInfo().then(resp =>{
      this.currentUserId = resp.user.userId
      this.queryParamsTaskList.designateId = this.currentUserId;
      this.queryParamsRequireList.designateUserId = this.currentUserId;
      this.getTaskList();
      this.getMyBug();
      this.getMyRequire();
      this.getProductList();
      this.getLoginInfoList();
      this.getOpList();
      this.initChart()
      this.initChartZhu();
    })
  },
  mounted() {
    this.$nextTick(() => {
      // this.initChart()
      // this.initChartZhu();
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods:{
    /** 查询登录日志列表 */
    getLoginInfoList() {
      this.loading = true;
      list(this.queryParamsLogLogin).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询登录日志 */
    getOpList() {
      this.opLoading = true;
      listop(this.queryParamsOp).then( response => {
          this.opList = response.rows;
          this.totalOp = response.total;
          this.opLoading = false;
        }
      );
    },
    toMyTask(){
      this.$router.push('execute/mytask')
    },
    toMyBug(){
      this.$router.push('test/myBug')
    },
    toMyRequire(){
      this.$router.push('product/myRequirement')
    },
    toProduct(){
      this.$router.push('product/product')
    },
    getTaskList(){
      listTask(this.queryParamsTaskList).then(response => {
        this.taskList = response.rows;
        this.myTaskNumber = this.taskList.length;
      });
    },
    getMyBug(){
      listProductBug(this.queryParamsBugList).then(response => {
        this.productBugList = response.rows;
        this.myBugNumber = this.productBugList.length;
      });
    },
    getMyRequire(){
      listRequirement(this.queryParamsRequireList).then(response => {
        this.requirementList = response.rows;
        this.myRequireNumber = this.requirementList.length
      });
    },
    async getProductList(){
      await listProduct(this.queryParamsProductList).then(response => {
        this.productList = response.rows;
        // console.log(this.productList)
      });
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('round'), 'macarons')
      this.setOptions()
    },
    initChartZhu() {
      this.chart = echarts.init(document.getElementById('zhu'), 'macarons')
      this.setOptionsZhu(this.chartDataZhu)
    },
    setOptions({ expectedData, actualData } = {}) {
      // listTask(this.queryParamsTaskList).then(response => {
      //   this.taskList = response.rows;
      //   this.myTaskNumber = this.taskList.length;
      // });
      console.log("打印")
      console.log(this.myRequireNumber)
      this.chart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              // { value: this.myRequireNumber, name: '我的需求' },
              // { value: this.myTaskNumber, name: '我的任务' },
              // { value: this.myBugNumber, name: '我的bug' },
              // { value: this.productList.length, name: '我的项目' },
              { value: 1, name: '我的需求' },
              { value: 2, name: '我的任务' },
              { value: 1, name: '我的bug' },
              { value: 1, name: '我的项目' },
            ]
          }
        ]
      })
    },
    setOptionsZhu({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title:{
          text:"本周任务完成情况"
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '完成任务数',
            type: 'bar',
            barWidth: '60%',
            data: [1, 1, 0, 1, 0, 0, 1]
          }
        ]

      })
    },
    customColorMethod(percentage) {
      if (percentage < 30) {
        return '#e63e31';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },

  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}

</style>
