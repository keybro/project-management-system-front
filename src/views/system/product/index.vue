<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="所属项目集" prop="itemSetId">
<!--        <el-input-->
<!--          v-model="queryParams.itemSetId"-->
<!--          placeholder="请输入所属项目集"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
        <el-select v-model="queryParams.itemSetId" placeholder="请选择所属项目集">
          <el-option
            v-for="item in item_setList"
            :key="item.itemSetName"
            :label="item.itemSetName"
            :value="item.itemSetId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品负责人" prop="productPrincipalId">
<!--        <el-input-->
<!--          v-model="queryParams.productPrincipalId"-->
<!--          placeholder="请输入产品负责人"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
        <el-select v-model="queryParams.productPrincipalId" placeholder="请选择产品负责人">
          <el-option
            v-for="item in selectProductPrincipal"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="测试负责人" prop="testPrincipalId">
<!--        <el-input-->
<!--          v-model="queryParams.testPrincipalId"-->
<!--          placeholder="请输入测试负责人"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
        <el-select v-model="queryParams.testPrincipalId" placeholder="请选择测试负责人">
          <el-option
            v-for="item in selectTestPrincipal"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId">
          </el-option>
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
          v-hasPermi="['system:product:add']"
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
          v-hasPermi="['system:product:edit']"
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
          v-hasPermi="['system:product:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:product:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="产品id" align="center" prop="productId" />-->
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="产品负责人" align="center" prop="productPrincipalName" />
      <el-table-column label="测试负责人" align="center" prop="testPrincipalName" />
      <el-table-column label="研发需求完成率(%)" align="center" prop="productRequireFinishRate" />
      <el-table-column label="bug(个)" align="center" prop="productBugNumber" />
      <el-table-column label="计划(个)" align="center" prop="productPlanNumber" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="upPlan(scope.row)"
            v-hasPermi="['system:product:remove']"
          >计划</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="upNeed(scope.row)"
            v-hasPermi="['system:product:remove']"
          >需求</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:product:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:product:remove']"
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

    <!-- 添加或修改产品列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属项目集" prop="itemSetId">
<!--          <el-input v-model="form.itemSetId" placeholder="请输入所属项目集id" />-->
          <el-select v-model="form.itemSetId" placeholder="请选择所属项目集">
            <el-option
              v-for="item in item_setList"
              :key="item.itemSetName"
              :label="item.itemSetName"
              :value="item.itemSetId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品代号" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入产品代号" />
        </el-form-item>
        <el-form-item label="产品负责人" prop="productPrincipalId">
<!--          <el-input v-model="form.productPrincipalId" placeholder="请输入产品负责人id" />-->
          <el-select v-model="form.productPrincipalId" placeholder="请选择产品负责人">
            <el-option
              v-for="item in userList"
              :key="item.nickName"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试负责人" prop="testPrincipalId">
<!--          <el-input v-model="form.testPrincipalId" placeholder="请输入测试负责人id" />-->
          <el-select v-model="form.testPrincipalId" placeholder="请选择产品负责人">
            <el-option
              v-for="item in userList"
              :key="item.nickName"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
<!--          <el-input v-model="form.description" placeholder="请输入描述与" />-->
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
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/system/product";
import { listItem_set } from '@/api/system/item_set'
import { listUser } from '@/api/system/user'
import { listBug } from '@/api/system/bug'

export default {
  name: "Product",
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
      // 产品列表表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemSetId: null,
        productName: null,
        productPrincipalId: null,
        testPrincipalId: null,
      },
      selectProductPrincipal:[],
      selectTestPrincipal:[],
      //查询所属项目集的参数
      queryParamsItemSet: {
      },
      //查询各种人的参数
      queryParamsUserList: {
      },
      userList: null,
      // 项目集表格数据
      item_setList: [],
      // 表单参数
      form: {},
      queryParamsBugList:{},
      bugList:[],
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    // this.queryParamsBugList.productId
    this.getList();
    this.getItem_set()
    this.getUserList()
  },
  methods: {
    /** 查询产品列表列表 */
    async getList() {
      this.loading = true;
      await listProduct(this.queryParams).then(response => {
        this.productList = response.rows;
        console.log(this.productList)
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取项目集，用于创建产品时选择所属项目集 */
    getItem_set(){
      listItem_set(this.queryParamsItemSet).then(response => {
        this.item_setList = response.rows;
      });
    },
    /** 获取用户信息，用于创建产品时选择负责人和测试人 */
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
          this.selectProductPrincipal = response.rows;
          this.selectTestPrincipal = response.rows;
          console.log(this.userList)
        }
      );
    },
    // getProductBug(){

    // },

    upPlan(row){
      const proId = row.productId;
      this.$router.push('/product/productPlanOne/'+proId)
    },

    upNeed(row){
      const proId = row.productId;
      this.$router.push('/product/productNeedOne/'+proId)
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        productId: null,
        itemSetId: null,
        productName: null,
        productCode: null,
        productPrincipalId: null,
        testPrincipalId: null,
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
      this.ids = selection.map(item => item.productId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const productId = row.productId || this.ids
      getProduct(productId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      const productIds = row.productId || this.ids;
      this.$modal.confirm('是否确认删除产品列表编号为"' + productIds + '"的数据项？').then(function() {
        return delProduct(productIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/product/export', {
        ...this.queryParams
      }, `product_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
