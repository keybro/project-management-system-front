<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="测试标题" prop="testTitle">
        <el-input
          v-model="queryParams.testTitle"
          placeholder="请输入测试标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结果" prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择结果" clearable>
          <el-option
            v-for="dict in dict.type.test_result"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="优先级" prop="priority">
        <el-select v-model="queryParams.priority" placeholder="请选择优先级" clearable>
          <el-option
            v-for="dict in dict.type.requirement_priority"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:exp:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:exp:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:exp:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:exp:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="expList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="测试id" align="center" prop="testId" />-->
      <el-table-column label="所属产品" align="center" prop="productName" />
      <el-table-column label="相关研发需求" align="center" prop="requireName" />
      <el-table-column label="测试标题" align="center" prop="testTitle" />
<!--      <el-table-column label="创建者id" align="center" prop="createrId" />-->
      <el-table-column label="创建者姓名" align="center" prop="createrName" />
      <el-table-column label="结果" align="center" prop="result">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.test_result" :value="scope.row.result"/>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="priority">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="addStep(scope.row)"
            v-hasPermi="['system:exp:edit']"
          >建步骤</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="executeStep(scope.row)"
            v-hasPermi="['system:exp:edit']"
          >执行</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-cpu"
            v-if="scope.row.result==2"
            @click="toMakeBug(scope.row)"
            v-hasPermi="['system:exp:edit']"
          >转bug</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:exp:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:exp:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改测试列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属产品" prop="productId">
          <el-input v-model="productName" :placeholder="this.form.productName" disabled/>
        </el-form-item>
        <el-form-item label="关联研发需求" prop="relateRequirementId">
<!--          <el-input v-model="form.relateRequirementId" placeholder="请输入测试标题" />-->
          <el-select v-model="form.relateRequirementId" placeholder="请选择关联的研发需求">
            <el-option
              v-for="item in requirementList"
              :key="item.productRequirementId"
              :label="item.requirementName"
              :value="item.productRequirementId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试标题" prop="testTitle">
          <el-input v-model="form.testTitle" placeholder="请输入测试标题" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择优先级">
            <el-option
              v-for="dict in dict.type.requirement_priority"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--   创建测试步骤对话框 -->
    <el-dialog
      title="测试步骤创建"
      :visible.sync="testStepDialog"
      width="70vw">
      <el-form label-width="80px" :model="stepInfo">
        <div v-for="(item, index) in stepInfo.stepList" :key="index">
          <el-row>
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form-item label="步骤">
                  <el-input v-model="item.stepName" style="width: 98%"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content bg-purple-light">
                <el-form-item label="预期">
                  <el-input v-model="item.hope" style="width: 98%"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content bg-purple-light">
                <el-form-item>
                  <el-button @click="addItem()"> + </el-button>
                  <el-button
                    @click="deleteItem(index)"
                  >
                    –
                  </el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="testStepDialog = false">取 消</el-button>
    <el-button type="primary" @click="makeSureAddstep">确 定</el-button>
  </span>
    </el-dialog>

    <!--  执行测试用例步骤对话框  -->
    <el-dialog
      title="测试用例执行"
      :visible.sync="exeStepDialog"
      width="80%">
      <el-form label-width="80px">
          <el-row v-for="(item,index) in stepList" :key="index">
            <el-col :span="7">
              <div class="grid-content bg-purple">
                <el-form-item label="步骤">
                  <el-input v-model="item.stepName" style="width: 100%"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="7">
              <div class="grid-content bg-purple-light">
                <el-form-item label="预期">
                  <el-input v-model="item.hope" style="width: 100%"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <el-form-item label="结果" prop="result">
                <el-select v-model="item.result" placeholder="请选择结果" clearable>
                  <el-option
                    v-for="dict in dict.type.test_result"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际情况" prop="physicalTruth">
                <el-input v-model="item.physicalTruth" style="width: 98%"/>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="exeStepDialog = false">取 消</el-button>
    <el-button type="primary" @click="makeSureExecuteStep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { listExp, getExp, delExp, addExp, updateExp } from "@/api/system/exp";
import { listProduct } from '@/api/system/product'
import { listRequirement } from '@/api/system/requirement'
import { getInfo } from '@/api/login'
import { addStep, listStep, updateStep } from '@/api/system/step'

export default {
  name: "index",
  dicts: ['requirement_priority', 'test_result'],
  data() {
    return {
      // 遮罩层
      loading: true,
      stepInfo: {
        stepList: [{ stepName: "", hope: ""}],
      },
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      testStepDialog:false,
      exeStepDialog:false,
      // 总条数
      total: 0,
      // 测试列表表格数据
      expList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productId: null,
        relateRequirementId: null,
        testTitle: null,
        createrId: null,
        createrName: null,
        result: null,
        priority: null
      },
      queryParamsProductList:{},
      productName:null,
      productId:null,
      productList:[],
      queryParamsRequireList:{},
      requirementList:[],
      createrId:null,
      createrName:null,
      // 表单参数
      form: {},
      testId: null,
      addStepForm:{},
      stepList:[],
      queryParamsStepList:{},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.proId = this.$route.params.proId;
    this.queryParams.productId = this.proId;
    this.queryParamsProductList.productId = this.proId
    this.queryParamsRequireList.productId = this.proId;
    this.getList();
    this.getProductList();
    this.getRequireList()
    this.getUserInfo();
  },
  methods: {
    /** 查询测试列表列表 */
    getList() {
      this.loading = true;
      listExp(this.queryParams).then(response => {
        this.expList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询产品列表，创建测试用例用 */
    getProductList(){
      listProduct(this.queryParamsProductList).then(response => {
        console.log("执行到")
        this.productList = response.rows;
        console.log(this.productList)
        this.form.productId = this.productList[0].productId;
        this.productId = this.productList[0].productId;
        this.form.productName = this.productList[0].productName
        this.productName = this.productList[0].productName
      });
    },
    /** 查询需求列表，创建测试用例用*/
    getRequireList(){
      listRequirement(this.queryParamsRequireList).then(response => {
        this.requirementList = response.rows;
      });
    },
    /** 获取当前用户信息，创建测试用例时用*/
    getUserInfo(){
      getInfo().then(resp =>{
        this.createrId = resp.user.userId
        this.createrName = resp.user.nickName;
      })
    },

    /** 执行测试用例*/
    addStep(row){
      this.testStepDialog = true;
      this.testId = row.testId
      this.queryParamsStepList.testId = this.testId
      listStep(this.queryParamsStepList).then(response => {
        this.stepList = response.rows;
        if (this.stepList.length!=0){
          this.stepInfo.stepList = this.stepList
        }
        console.log("建用例")
        console.log(this.stepList)
      })

    },

    async makeSureAddstep(){
      this.testStepDialog = false;
      console.log(this.stepInfo.stepList)
      for (let i = 0; i < this.stepInfo.stepList.length; i++) {
        this.addStepForm.testId = this.testId;
        this.addStepForm.stepName = this.stepInfo.stepList[i].stepName;
        this.addStepForm.hope = this.stepInfo.stepList[i].hope;
        this.addStepForm.result = 0;
        //批量添加执行步骤
        await addStep(this.addStepForm).then(response => {
          console.log("添加了步骤")
        });
      }
      this.$modal.msgSuccess("新增成功");
    },

    /** 转bug*/
    toMakeBug(row){
      const proId = row.productId;
      console.log(proId)
      this.$router.push('/productTest/toProductBug/'+proId)
    },

    /** 运行测试步骤*/
    executeStep(row){
      this.testId = row.testId;
      this.queryParamsStepList.testId = this.testId
      listStep(this.queryParamsStepList).then(response => {
        this.stepList = response.rows;
        console.log("有没有搞错")
        console.log(this.stepList)
        //如果已经建立测试步骤，显示执行界面
        if (this.stepList.length!=0){
          this.exeStepDialog = true;
        }
        else {
          this.$confirm('该测试用例尚未建立测试步骤，请先建立测试步骤?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
      });

    },
    /** 确定执行测试步骤*/
    async makeSureExecuteStep(){
      this.exeStepDialog = false;
      console.log(this.stepList)
      let passFlag = true;
      //  1.依次更新步骤表里的执行结果
      for (let i = 0; i < this.stepList.length; i++) {
        console.log(this.stepList[i])
        const form = {
          stepId:this.stepList[i].stepId,
          testId:this.stepList[i].testId,
          stepName:this.stepList[i].stepName,
          hope:this.stepList[i].hope,
          result:this.stepList[i].result,
          physicalTruth:this.stepList[i].physicalTruth
        }
        if (this.stepList[i].result==2){
          passFlag = false
        }
        await updateStep(form).then(response => {
          // this.$modal.msgSuccess("修改成功");
        });
      }
      //所有用例都通过，则测试通过
      if (passFlag == true){
        const upTestForm = {
          testId:this.testId,
          result:1
        }
        updateExp(upTestForm).then(response => {
          // this.$modal.msgSuccess("修改成功");
          this.getList();
        });
      }
      //有一个测试用例不通过，那么一整个都不通过
      else {
        const upTestForm = {
          testId:this.testId,
          result:2
        }
        updateExp(upTestForm).then(response => {
          // this.$modal.msgSuccess("修改成功");
          this.getList();
        });
      }
      this.$modal.msgSuccess("执行成功");
    },

    /** 增加测试条目*/
    addItem() {
      let that = this;
      that.stepInfo.stepList.push({
        stepName: "",
        hope: "",
      });
    },
    /** 删除测试条目*/
    deleteItem(i) {
      if (this.stepInfo.stepList.length <= 1) {
        return false;
      }
      this.stepInfo.stepList.splice(i, 1);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        testId: null,
        productId: null,
        relateRequirementId: null,
        testTitle: null,
        createrId: null,
        createrName: null,
        result: null,
        priority: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.testId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加测试列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const testId = row.testId || this.ids
      getExp(testId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改测试列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.testId != null) {
            updateExp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.productId = this.productId;
            this.form.createrId = this.createrId;
            this.form.createrName = this.createrName
            //创建时未执行
            this.form.result = 0;
            addExp(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const testIds = row.testId || this.ids;
      this.$modal.confirm('是否确认删除测试列表编号为"' + testIds + '"的数据项？').then(function() {
        return delExp(testIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/exp/export', {
        ...this.queryParams
      }, `exp_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
