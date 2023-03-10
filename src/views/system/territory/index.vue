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
            <span>项目清单</span>
          </div>
          <div>
            <el-card shadow="hover" style="width: 30%" v-for="item in productList" :key="item" @click.native="toProduct">
              <span>{{item.productName}}</span>
              <div style="margin-top: 20px">
                <span>进度:</span>
                <div style="margin-top: 15px"></div>
                <el-progress :text-inside="true" :stroke-width="16" :percentage="item.productRequireFinishRate"></el-progress>
              </div>
            </el-card>
          </div>
        </el-card>

      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { listTask } from '@/api/system/task'
import { getInfo } from '@/api/login'
import { listProductBug } from '@/api/system/productBug'
import { listRequirement } from '@/api/system/requirement'
import { listProduct } from '@/api/system/product'

export default {
  name: 'index',
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
    })

  },
  methods:{
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
        console.log(this.productList)
      });
    }
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
