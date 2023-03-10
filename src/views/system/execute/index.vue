<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="执行名称" prop="executeName">
        <el-input
          v-model="queryParams.executeName"
          placeholder="请输入执行名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行代号" prop="executeCode">
        <el-input
          v-model="queryParams.executeCode"
          placeholder="请输入执行代号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
        </el-date-picker>
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
          v-hasPermi="['system:execute:add']"
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
          v-hasPermi="['system:execute:edit']"
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
          v-hasPermi="['system:execute:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:execute:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="executeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="执行id" align="center" prop="executeId" />-->
      <el-table-column label="所属项目" align="center" prop="itemName" />
      <el-table-column label="对应需求" align="center" prop="productRequirementName" />
      <el-table-column label="执行名称" align="center" prop="executeName" />
      <el-table-column label="执行代号" align="center" prop="executeCode" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行类型" align="center" prop="executeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.execute_type" :value="scope.row.executeType"/>
        </template>
      </el-table-column>
      <el-table-column label="产品负责人" align="center" prop="productPrincipalName" />
      <el-table-column label="测试负责人" align="center" prop="testPrincipalName" />
      <el-table-column label="迭代负责人" align="center" prop="iterationPrincipalName" />
<!--      <el-table-column label="描述" align="center" prop="description">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.execute_type" :value="scope.row.description"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="toMakeTask(scope.row)"
            v-hasPermi="['system:execute:edit']"
          >分解执行任务</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:execute:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:execute:remove']"
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

    <!-- 添加或修改执行列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属项目" prop="itemId">
<!--          <el-input v-model="form.itemId" placeholder="请输入执行名称" />-->
          <el-select v-model="form.itemId" placeholder="请选择所属项目">
            <el-option
              v-for="item in itemList"
              :key="item.itemId"
              :label="item.itemName"
              :value="item.itemId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行名称" prop="executeName">
          <el-input v-model="form.executeName" placeholder="请输入执行名称" />
        </el-form-item>
        <el-form-item label="执行代号" prop="executeCode">
          <el-input v-model="form.executeCode" placeholder="请输入执行代号" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="执行类型" prop="executeType">
<!--          <el-input v-model="form.executeType" placeholder="请输入执行名称" />-->
          <el-select v-model="form.executeType" placeholder="请选择优先级">
            <el-option
              v-for="dict in dict.type.execute_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联产品" prop="relatedProductId">
          <el-select v-model="form.relatedProductId" placeholder="请选择关联产品">
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联计划" prop="relatedPlanId">
<!--          <el-input v-model="form.relatedPlanId" placeholder="请输入执行代号" />-->
          <el-select v-model="form.relatedPlanId" placeholder="请选择关联产品">
            <el-option
              v-for="item in planList"
              :key="item.panId"
              :label="item.planName"
              :value="item.panId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关联需求" prop="relateRequireId">
          <!--          <el-input v-model="form.relatedPlanId" placeholder="请输入执行代号" />-->
          <el-select v-model="form.relateRequireId" placeholder="请选择关联产品">
            <el-option
              v-for="item in requirementList"
              :key="item.productRequirementId"
              :label="item.requirementName"
              :value="item.productRequirementId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="产品负责人" prop="productPrincipalId">
<!--          <el-input v-model="form.productPrincipalId" placeholder="请输入执行代号" />-->
          <el-select v-model="form.productPrincipalId" placeholder="请选择产品负责人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试负责人" prop="testPrincipalId">
<!--          <el-input v-model="form.testPrincipalId" placeholder="请输入执行代号" />-->
          <el-select v-model="form.testPrincipalId" placeholder="请选择产品负责人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="迭代负责人" prop="iterationPrincipalId">
<!--          <el-input v-model="form.iterationPrincipalId" placeholder="请输入执行代号" />-->
          <el-select v-model="form.iterationPrincipalId" placeholder="请选择产品负责人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团队成员" prop="teamMembersIds">
<!--          <el-input v-model="form.teamMembersIds" placeholder="请输入执行代号" />-->
          <el-select v-model="form.teamMembersIds" multiple placeholder="请选择团队成员" style="width: 50%">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <editor v-model="form.description" :min-height="192"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listExecute, getExecute, delExecute, addExecute, updateExecute } from "@/api/system/execute";
import { listItem } from '@/api/system/item'
import { listProduct } from '@/api/system/product'
import { listPlan } from '@/api/system/plan'
import { listUser } from '@/api/system/user'
import { addExe } from '@/api/system/exe'
import { listRequirement } from '@/api/system/requirement'

export default {
  name: "Execute",
  dicts: ['execute_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 执行列表表格数据
      executeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemId: null,
        executeName: null,
        executeCode: null,
        startTime: null,
        endTime: null,
        executeType: null,
        relatedProductId: null,
        relatedPlanId: null,
        productPrincipalId: null,
        testPrincipalId: null,
        iterationPrincipalId: null,
        description: null
      },
      queryParamsItemList:{
      },
      itemList:[],
      queryParamsProductList:{},
      productList:[],
      queryParamsPlanList:{},
      planList:[],
      queryParamsUserList:{},
      userList:[],
      queryParamsRequireList:{},
      requirementList:[],
      // 表单参数
      form: {},
      addUserForm:{},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getItemList();
    this.getProductList();
    this.getPlanList();
    this.getUserList();
    this.getRequireList()
  },
  methods: {
    /** 查询执行列表列表 */
    getList() {
      this.loading = true;
      listExecute(this.queryParams).then(response => {
        this.executeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询所有项目列表，创建执行用*/
    getItemList(){
      listItem(this.queryParamsItemList).then(response => {
        this.itemList = response.rows;
      });
    },
    /** 查询所有产品列表，创建执行用*/
    getProductList(){
      listProduct(this.queryParamsProductList).then(response => {
        this.productList = response.rows;
      });
    },
    /** 查询所有计划列表，创建执行用*/
    getPlanList(){
      listPlan(this.queryParamsPlanList).then(response => {
        this.planList = response.rows;
      });
    },
    /** 查询所有用户，创建执行用*/
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
          console.log(this.userList)
        }
      );
    },
    getRequireList(){
      listRequirement(this.queryParamsRequireList).then(response => {
        this.requirementList = response.rows;
      });
    },

    addGroupMembers(){
      const memberIds = this.form.teamMembersIds
      const list  = memberIds.split(',')
      console.log(list)
      for (let i = 0; i < list.length; i++) {
        addExe(this.addUserForm).then(response => {
          this.$modal.msgSuccess("新增成功");
        });
      }
    },
    //执行的任务分解
    toMakeTask(row){
      const exeId = row.executeId;
      this.$router.push('/execute/exeToTask/'+exeId)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        executeId: null,
        itemId: null,
        executeName: null,
        executeCode: null,
        startTime: null,
        endTime: null,
        executeType: null,
        relatedProductId: null,
        relatedPlanId: null,
        productPrincipalId: null,
        testPrincipalId: null,
        iterationPrincipalId: null,
        teamMembersIds: [],
        description: null
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
      this.ids = selection.map(item => item.executeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加执行列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const executeId = row.executeId || this.ids
      getExecute(executeId).then(response => {
        this.form = response.data;
        this.form.teamMembersIds = this.form.teamMembersIds.split(",");
        this.open = true;
        this.title = "修改执行列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.teamMembersIds = this.form.teamMembersIds.join(",");
          if (this.form.executeId != null) {
            updateExecute(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.addGroupMembers()
            // addExecute(this.form).then(response => {
            //   this.$modal.msgSuccess("新增成功");
            //   this.open = false;
            //   this.getList();
            // });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const executeIds = row.executeId || this.ids;
      this.$modal.confirm('是否确认删除执行列表编号为"' + executeIds + '"的数据项？').then(function() {
        return delExecute(executeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/execute/export', {
        ...this.queryParams
      }, `execute_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
