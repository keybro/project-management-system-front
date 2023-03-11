<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="bug类型" prop="bugType">
        <el-select v-model="queryParams.bugType" placeholder="请选择bug类型" clearable>
          <el-option
            v-for="dict in dict.type.bug_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="bug标题" prop="bugTitle">
        <el-input
          v-model="queryParams.bugTitle"
          placeholder="请输入bug标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="bug结果" prop="result">
        <el-select v-model="queryParams.result" placeholder="请选择bug结果" clearable>
          <el-option
            v-for="dict in dict.type.bug_result"
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
          v-hasPermi="['system:productBug:add']"
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
          v-hasPermi="['system:productBug:edit']"
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
          v-hasPermi="['system:productBug:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:productBug:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productBugList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="bugid" align="center" prop="bugId" />-->
      <el-table-column label="产品" align="center" prop="productName" />
      <el-table-column label="项目" align="center" prop="itemName" />
      <el-table-column label="执行" align="center" prop="executeName" />
      <el-table-column label="指派人" align="center" prop="designateName" />
      <el-table-column label="bug类型" align="center" prop="bugType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bug_type" :value="scope.row.bugType"/>
        </template>
      </el-table-column>
      <el-table-column label="bug标题" align="center" prop="bugTitle" />
      <el-table-column label="优先级" align="center" prop="priority">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
      <!--      <el-table-column label="重现步骤" align="center" prop="reStep" />-->
      <el-table-column label="相关需求" align="center" prop="requireName" />
      <el-table-column label="相关任务" align="center" prop="taskName" />
      <el-table-column label="bug结果" align="center" prop="result">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bug_result" :value="scope.row.result"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click="okThisBug(scope.row)"
            v-hasPermi="['system:productBug:edit']"
          >解决</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-delete"
            @click="endThisBug(scope.row)"
            v-hasPermi="['system:productBug:edit']"
          >关闭</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:productBug:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:productBug:remove']"
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

    <!-- 添加或修改产品bug列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属产品">
          <el-select v-model="form.productId" placeholder="请选择所属项目">
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属项目" prop="itemId">
          <el-select v-model="form.itemId" placeholder="请选择所属项目">
            <el-option
              v-for="item in itemList"
              :key="item.itemId"
              :label="item.itemName"
              :value="item.itemId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属执行" prop="executeId">
          <el-select v-model="form.executeId" placeholder="请选择所属执行">
            <el-option
              v-for="item in executeList"
              :key="item.executeId"
              :label="item.executeName"
              :value="item.executeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派给" prop="designateId">
          <el-select v-model="form.designateId" placeholder="请选择指派人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="bug类型" prop="bugType">
          <el-select v-model="form.bugType" placeholder="请选择bug类型">
            <el-option
              v-for="dict in dict.type.bug_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="bug标题" prop="bugTitle">
          <el-input v-model="form.bugTitle" placeholder="请输入bug标题" />
        </el-form-item>
        <el-form-item label="严重程度" prop="priority">
          <el-select v-model="form.priority" placeholder="请选择严重程度">
            <el-option
              v-for="dict in dict.type.requirement_priority"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重现步骤">
          <editor v-model="form.reStep" :min-height="192"/>
        </el-form-item>

        <el-form-item label="相关需求" prop="relateNeedId">
          <el-select v-model="form.relateNeedId" placeholder="请选择相关需求">
            <el-option
              v-for="item in requirementList"
              :key="item.productRequirementId"
              :label="item.requirementName"
              :value="item.productRequirementId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关任务" prop="relateTaskId">
          <el-select v-model="form.relateTaskId" placeholder="请选择相关任务">
            <el-option
              v-for="item in taskList"
              :key="item.taskId"
              :label="item.taskName"
              :value="item.taskId"
            ></el-option>
          </el-select>
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
import { listProductBug, getProductBug, delProductBug, addProductBug, updateProductBug } from "@/api/system/productBug";
import { listProduct } from '@/api/system/product'
import { listItem } from '@/api/system/item'
import { listExecute } from '@/api/system/execute'
import { listUser } from '@/api/system/user'
import { listRequirement } from '@/api/system/requirement'
import { listTask } from '@/api/system/task'
import { getInfo } from '@/api/login'

export default {
  name: "ProductBug",
  dicts: ['requirement_priority', 'bug_result', 'bug_type'],
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
      // 产品bug列表表格数据
      productBugList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productId: null,
        itemId: null,
        executeId: null,
        designateId: null,
        bugType: null,
        bugTitle: null,
        priority: null,
        reStep: null,
        relateNeedId: null,
        relateTaskId: null,
        result: null,
      },
      // 表单参数
      form: {},
      productId:null,
      queryParamsProductList:{},
      productList:[],
      productName:null,
      queryParamsItemList:{},
      itemList:[],
      queryParamsExecuteList:{},
      executeList:[],
      queryParamsUserList:{},
      userList:[],
      queryParamsRequireList:{},
      requirementList:[],
      queryParamsTaskList:{},
      taskList:[],
      createrId:null,
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    getInfo().then(resp =>{
      this.currentUserId = resp.user.userId
      this.queryParams.designateId = this.currentUserId;
      this.getList();
      this.getProductList();
      this.getItemList();
      this.getExecuteList();
      this.getUserList();
      this.getRequireList();
      this.getTaskList();
      this.getUserInfo();
    })
  },
  methods: {
    /** 查询产品bug列表列表 */
    getList() {
      this.loading = true;
      listProductBug(this.queryParams).then(response => {
        this.productBugList = response.rows;
        console.log(this.productBugList)
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询产品列表，创建bug用 */
    getProductList(){
      listProduct(this.queryParamsProductList).then(response => {
        this.productList = response.rows;
        this.productName = this.productList[0].productName;
      });
    },
    /** 查询项目列表，创建bug用 */
    getItemList(){
      listItem(this.queryParamsItemList).then(response => {
        this.itemList = response.rows;
      });
    },
    /** 查询执行列表，创建bug用 */
    getExecuteList(){
      listExecute(this.queryParamsExecuteList).then(response => {
        this.executeList = response.rows;
      });
    },
    /** 查询所有用户，指派bug用*/
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
        }
      );
    },
    /** 查询需求，创建bug用*/
    getRequireList(){
      listRequirement(this.queryParamsRequireList).then(response => {
        this.requirementList = response.rows;
      });
    },
    /** 查询任务，创建bug用*/
    getTaskList(){
      listTask(this.queryParamsTaskList).then(response => {
        this.taskList = response.rows;
      });
    },
    /** 获取当前用户信息，创建bug创建者id用*/
    getUserInfo(){
      getInfo().then(resp =>{
        this.createrId = resp.user.userId
      })
    },
    /** 解决bug*/
    okThisBug(row){
      this.$confirm('确定已成功修改bug?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.bugId = row.bugId;
        this.form.result = 1;
        updateProductBug(this.form).then(response => {
          this.getList();
        });
        this.$message({
          type: 'success',
          message: '修改bug成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });

    },
    /** 关闭bug*/
    endThisBug(row){
      this.$confirm('确定bug已被成功解决?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.bugId = row.bugId;
        this.form.result = 2;
        updateProductBug(this.form).then(response => {
          this.getList();
        });
        this.$message({
          type: 'success',
          message: 'bug解决成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消bug解决确认'
        });
      });

    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        bugId: null,
        productId: null,
        itemId: null,
        executeId: null,
        designateId: null,
        bugType: null,
        bugTitle: null,
        priority: null,
        reStep: null,
        relateNeedId: null,
        relateTaskId: null,
        result: null,
        createrId: null,
        status: null
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
      this.ids = selection.map(item => item.bugId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.reStep = "[步骤]\n"+"\n\n[结果]\n\n\n"+"[期望]"
      this.open = true;
      this.title = "添加产品bug列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bugId = row.bugId || this.ids
      getProductBug(bugId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品bug列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bugId != null) {
            updateProductBug(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            // this.form.productId = this.productId;
            this.form.createrId = this.createrId;
            this.form.result = 0;
            addProductBug(this.form).then(response => {
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
      const bugIds = row.bugId || this.ids;
      this.$modal.confirm('是否确认删除产品bug列表编号为"' + bugIds + '"的数据项？').then(function() {
        return delProductBug(bugIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/productBug/export', {
        ...this.queryParams
      }, `productBug_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
