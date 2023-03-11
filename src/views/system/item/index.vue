<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="项目名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="项目代号" prop="itemCode">-->
<!--        <el-input-->
<!--          v-model="queryParams.itemCode"-->
<!--          placeholder="请输入项目代号"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="预算" prop="budget">-->
<!--        <el-input-->
<!--          v-model="queryParams.budget"-->
<!--          placeholder="请输入预算"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.item_status"
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
          v-hasPermi="['system:item:add']"
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
          v-hasPermi="['system:item:edit']"
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
          v-hasPermi="['system:item:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:item:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="项目id" align="center" prop="itemId" />-->
      <el-table-column label="所属项目集" align="center" prop="itemSetName" />
      <el-table-column label="项目名称" align="center" prop="itemName" />
<!--      <el-table-column label="项目代号" align="center" prop="itemCode" />-->
      <el-table-column label="负责人" align="center" prop="principalName" />
      <el-table-column label="预算" align="center" prop="budget" />
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
      <el-table-column label="关联产品" align="center" prop="relatedProductName" />
      <el-table-column label="关联计划" align="center" prop="relatedPlanName" />
      <el-table-column label="实际开始时间" align="center" prop="actualStartTime">
        <template slot-scope="scope">
          <span v-if="scope.row.actualStartTime!=''">{{scope.row.actualStartTime}}</span>
          <span v-if="scope.row.actualStartTime==''">无数据</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.item_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="startItem(scope.row)"
            v-hasPermi="['system:item:edit']"
          >开始</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-delete"
            @click="endItem(scope.row)"
            v-hasPermi="['system:item:edit']"
          >关闭</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:item:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:item:remove']"
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

    <!-- 添加或修改项目列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属项目集" prop="itemSetId">
          <el-select v-model="form.itemSetId" placeholder="请选择所属项目集">
            <el-option
              v-for="item in item_setList"
              :key="item.itemSetId"
              :label="item.itemSetName"
              :value="item.itemSetId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目代号" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="请输入项目代号" />
        </el-form-item>
        <el-form-item label="负责人" prop="principalId">
<!--          <el-input v-model="form.principalId" placeholder="请输入项目代号" />-->
          <el-select v-model="form.principalId" placeholder="请选择负责人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预算" prop="budget">
          <el-input v-model="form.budget" placeholder="请输入预算" />
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
        <el-form-item label="关联产品">
          <el-select v-model="form.relatedProductId" placeholder="请选择关联产品">
            <el-option
              v-for="item in productList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联计划">
          <el-select v-model="form.relatedPlanId" placeholder="请选择关联计划">
            <el-option
              v-for="item in planList"
              :key="item.panId"
              :label="item.planName"
              :value="item.panId">
            </el-option>
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
import { listItem, getItem, delItem, addItem, updateItem } from "@/api/system/item";
import { listItem_set } from '@/api/system/item_set'
import { listUser } from '@/api/system/user'
import { listProduct } from '@/api/system/product'
import { listPlan } from '@/api/system/plan'

export default {
  name: "Item",
  dicts: ['item_status'],
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
      // 项目列表表格数据
      itemList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemSetId: null,
        itemName: null,
        itemCode: null,
        principalId: null,
        budget: null,
        startTime: null,
        endTime: null,
        relatedProductId: null,
        relatedPlanId: null,
        status: null
      },
      //查询各种人的参数
      queryParamsUserList: {
      },
      userList: null,
      //查询所属项目集的参数
      queryParamsItemSet: {
      },
      // 项目集表格数据
      item_setList: [],
      queryParamsProductList:{},
      productList:[],
      planList:[],
      queryParamsPlanList:{},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getItem_set();
    this.getUserList();
    this.getProductList();
    this.getPlan();
  },
  methods: {
    /** 查询项目列表列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then(response => {
        this.itemList = response.rows;
        console.log(this.itemList)
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 获取项目集，用于创建项目时选择所属项目集 */
    getItem_set(){
      listItem_set(this.queryParamsItemSet).then(response => {
        this.item_setList = response.rows;
      });
    },
    /** 获取所有用户信息 */
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
          console.log(this.userList)
        }
      );
    },
    /** 查询产品列表，创建需求用 */
    getProductList() {
      listProduct(this.queryParamsProductList).then(response => {
        this.productList = response.rows;
      });
    },

    /** 获取所有计划 */
    getPlan(){
      listPlan(this.queryParamsPlanList).then(response => {
        this.planList = response.rows;
      });
    },
    /** 开始项目 */
    startItem(row){
      this.$confirm('是否确定开启该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var thisTime = year+'-'+month+'-'+day
        this.form.itemId = row.itemId;
        this.form.actualStartTime = thisTime;
        this.form.status = 1
        updateItem(this.form).then(response => {
          this.getList();
        });
        this.$message({
          type: 'success',
          message: '开始成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始项目'
        });
      });
    },
    /** 结束项目 */
    endItem(row){
      this.$confirm('是否确定结束该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.itemId = row.itemId;
        this.form.status = 2;
        updateItem(this.form).then(response => {
          this.getList();
        });
        this.$message({
          type: 'success',
          message: '结束成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消结束'
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
        itemId: null,
        itemSetId: null,
        itemName: null,
        itemCode: null,
        principalId: null,
        budget: null,
        startTime: null,
        endTime: null,
        relatedProductId: null,
        relatedProductName: null,
        relatedPlanId: null,
        relatedPlanName: null,
        description: null,
        actualStartTime: null,
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
      this.ids = selection.map(item => item.itemId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const itemId = row.itemId || this.ids
      getItem(itemId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.itemId != null) {
            updateItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.status = 0
            addItem(this.form).then(response => {
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
      const itemIds = row.itemId || this.ids;
      this.$modal.confirm('是否确认删除项目列表编号为"' + itemIds + '"的数据项？').then(function() {
        return delItem(itemIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/item/export', {
        ...this.queryParams
      }, `item_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
