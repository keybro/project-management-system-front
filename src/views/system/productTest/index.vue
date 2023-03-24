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
            :key="item.itemSetId"
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
            v-for="item in userList"
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
            v-for="item in userList"
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
          v-hasPermi="['system:productTest:add']"
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
          v-hasPermi="['system:productTest:edit']"
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
          v-hasPermi="['system:productTest:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:productTest:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productTestList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="产品id" align="center" prop="productId" />-->
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="所属项目集" align="center" prop="itemSetName" />
      <el-table-column label="产品负责人" align="center" prop="productPrincipalName" />
      <el-table-column label="测试负责人" align="center" prop="testPrincipalName" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-add"
            @click="ToMakeStep(scope.row)"
            v-hasPermi="['system:productTest:edit']"
          >建测试用例</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-cpu"-->
<!--            @click="toMakeBug(scope.row)"-->
<!--            v-hasPermi="['system:productTest:remove']"-->
<!--          >建bug</el-button>-->
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

    <!-- 添加或修改产品测试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属项目集id" prop="itemSetId">
          <el-input v-model="form.itemSetId" placeholder="请输入所属项目集id" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品代号" prop="productCode">
          <el-input v-model="form.productCode" placeholder="请输入产品代号" />
        </el-form-item>
        <el-form-item label="产品负责人id" prop="productPrincipalId">
          <el-input v-model="form.productPrincipalId" placeholder="请输入产品负责人id" />
        </el-form-item>
        <el-form-item label="测试负责人id" prop="testPrincipalId">
          <el-input v-model="form.testPrincipalId" placeholder="请输入测试负责人id" />
        </el-form-item>
        <el-form-item label="描述与" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述与" />
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
import { listProductTest, getProductTest, delProductTest, addProductTest, updateProductTest } from "@/api/system/productTest";
import { listItem_set } from '@/api/system/item_set'
import { listUser } from '@/api/system/user'

export default {
  name: "ProductTest",
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
      // 产品测试表格数据
      productTestList: [],
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      queryParamsItemSet:{},
      item_setList:[],
      queryParamsUserList:{},
      userList:[],
    };
  },
  created() {
    this.getList();
    this.getItemSet();
    this.getUserList();
  },
  methods: {
    /** 获取用户信息，用于创建产品时选择负责人和测试人 */
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
        }
      );
    },
    /** 查询产品测试列表 */
    getList() {
      this.loading = true;
      listProductTest(this.queryParams).then(response => {
        this.productTestList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询产品测试列表 */
    getItemSet() {
      listItem_set(this.queryParamsItemSet).then(response => {
        this.item_setList = response.rows;
      });

    },

    ToMakeStep(row){
      const proId = row.productId;
      this.$router.push('/productTest/toProductTestExample/'+proId)
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
      this.title = "添加产品测试";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const productId = row.productId || this.ids
      getProductTest(productId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改产品测试";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId != null) {
            updateProductTest(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProductTest(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除产品测试编号为"' + productIds + '"的数据项？').then(function() {
        return delProductTest(productIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/productTest/export', {
        ...this.queryParams
      }, `productTest_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
