<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
<!--      <el-form-item label="需求来源类型" prop="sourceType">-->
<!--        <el-select v-model="queryParams.sourceType" placeholder="请选择需求来源类型" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.requirement_source_type"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="所属产品" prop="requirementName">
<!--        <el-input-->
<!--          v-model="queryParams.requirementName"-->
<!--          placeholder="请输入所属产品"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
        <el-select v-model="queryParams.productRequirementId" placeholder="请选择">
          <el-option
            v-for="item in productList"
            :key="item.productName"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属计划" prop="requirementType">
<!--        <el-select v-model="queryParams.requirementType" placeholder="请选择所属计划" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.requirement_type"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
        <el-select v-model="queryParams.productPlanId" placeholder="请选择">
          <el-option
            v-for="item in planList"
            :key="item.planName"
            :label="item.planName"
            :value="item.panId">
          </el-option>
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
<!--      <el-form-item label="创建者姓名" prop="createUserName">-->
<!--        <el-input-->
<!--          v-model="queryParams.createUserName"-->
<!--          placeholder="请输入创建者姓名"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="支配人id" prop="designateUserId">-->
<!--        <el-input-->
<!--          v-model="queryParams.designateUserId"-->
<!--          placeholder="请输入支配人id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="指派人姓名" prop="designateUserName">-->
<!--        <el-input-->
<!--          v-model="queryParams.designateUserName"-->
<!--          placeholder="请输入指派人姓名"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="阶段" prop="stage">
        <el-select v-model="queryParams.stage" placeholder="请选择阶段" clearable>
          <el-option
            v-for="dict in dict.type.requirement_stage"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.requirement_status"
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
          v-hasPermi="['system:requirement:add']"
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
          v-hasPermi="['system:requirement:edit']"
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
          v-hasPermi="['system:requirement:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:requirement:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="requirementList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="产品需求id" align="center" prop="productRequirementId" />-->
      <el-table-column label="优先级" align="center" prop="priority">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
      <el-table-column label="需求名称" align="center" prop="requirementName" />
      <el-table-column label="所属产品" align="center" prop="productName" />
      <el-table-column label="所属产品计划" align="center" prop="planName" />
      <el-table-column label="创建者姓名" align="center" prop="createUserName" />
      <el-table-column label="指派人姓名" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain v-if="scope.row.designateUserName == null" @click="sendId(scope.row.productRequirementId)">
            <i class="el-icon-thumb"></i>未指派
          </el-button>
          <span v-if="scope.row.designateUserName != ''">{{scope.row.designateUserName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="需求类别" align="center" prop="requirementType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_type" :value="scope.row.requirementType"/>
        </template>
      </el-table-column>


      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="阶段" align="center" prop="stage">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_stage" :value="scope.row.stage"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-folder-delete"
            @click="closeRequire(scope.row)"
            v-hasPermi="['system:requirement:edit']"
          >关闭</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:requirement:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:requirement:remove']"
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

    <!-- 添加或修改研发需求对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属产品" prop="requirementName">
<!--          <el-input v-model="form.requirementName" placeholder="请输入需求名称" />-->
          <el-select v-model="form.productId" placeholder="请选择所属产品">
            <el-option
              v-for="item in productList"
              :key="item.productName"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属计划" prop="requirementName">
<!--          <el-input v-model="form.requirementName" placeholder="请输入需求名称" />-->
          <el-select v-model="form.productPlanId" placeholder="请选择所属计划">
            <el-option
              v-for="item in planList"
              :key="item.planName"
              :label="item.planName"
              :value="item.panId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="需求名称" prop="requirementName">
          <el-input v-model="form.requirementName" placeholder="请输入需求名称" />
        </el-form-item>


        <el-form-item label="需求来源类型" prop="sourceType">
          <el-select v-model="form.sourceType" placeholder="请选择需求来源类型">
            <el-option
              v-for="dict in dict.type.requirement_source_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求类别" prop="requirementType">
          <el-select v-model="form.requirementType" placeholder="请选择需求类别">
            <el-option
              v-for="dict in dict.type.requirement_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
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
        <el-form-item label="描述">
          <editor v-model="form.description" :min-height="192"/>
        </el-form-item>
        <el-form-item label="验收标准">
          <editor v-model="form.acceptanceStandard" :min-height="192"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  指派对话框  -->
    <el-dialog
      title="提示"
      :visible.sync="designateDialog"
      width="50vw">
      <el-form ref="form" :model="designateForm" :rules="rules" label-width="100px">
        <el-form-item label="指派给">
          <el-select v-model="designateForm.designateUserId" placeholder="请选择指派人">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派备注">
          <editor v-model="designateForm.designateRemark" :min-height="192"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="designateDialog = false">取 消</el-button>
    <el-button type="primary" @click="makeSureDesignate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { listRequirement, getRequirement, delRequirement, addRequirement, updateRequirement } from "@/api/system/requirement";
import { listProduct } from '@/api/system/product'
import { listPlan } from '@/api/system/plan'
import { getInfo } from '@/api/login'
import { listUser,getUser } from '@/api/system/user'

export default {
  name: "Requirement",
  dicts: ['requirement_stage', 'requirement_priority', 'requirement_source_type', 'requirement_status', 'requirement_type'],
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
      rowId:null,
      // 研发需求表格数据
      requirementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      designateDialog:false,
      //指派更新参数
      designateForm:{},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productId: null,
        productPlanId: null,
        sourceType: null,
        requirementName: null,
        requirementType: null,
        priority: null,
        description: null,
        acceptanceStandard: null,
        createUserName: null,
        designateUserId: null,
        designateUserName: null,
        stage: null,
        status: null
      },
      //查询各种人的参数
      queryParamsUserList: {
      },
      userList: null,
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
    this.getProductList();
    this.getPlan();
    this.getUserList();
  },
  methods: {
    /** 查询研发需求列表 */
    async getList() {
      this.loading = true;
      await listRequirement(this.queryParams).then(response => {
        this.requirementList = response.rows;
        console.log(this.requirementList)
        console.log(this.requirementList.designateUserName == '')
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询产品列表，创建需求用 */
    getProductList() {
      listProduct(this.queryParamsProductList).then(response => {
        this.productList = response.rows;
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

    /** 获取所有计划 */
    getPlan(){
      listPlan(this.queryParamsPlanList).then(response => {
        this.planList = response.rows;
      });
    },

    /** 获取当前用户信息，创建需求时用*/
    getUserInfo(){
      getInfo().then(resp =>{
        this.form.createUserId = resp.user.userId
        this.form.createUserName = resp.user.nickName;
      })
    },
    /** 点击指派，传递本行id*/
    sendId(id){
      this.designateDialog = true;
      this.rowId = id;
      this.designateForm.productRequirementId = id;
      console.log(this.rowId)
    },
    /** 关闭需求*/
    closeRequire(row){
      this.$confirm('是否确定关闭该需求', '关闭确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.productRequirementId = row.productRequirementId;
        this.form.stage = 3
        updateRequirement(this.form).then(response => {
          this.getList();
        });
        this.$message({
          type: 'success',
          message: '关闭成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消关闭'
        });
      });
    },

    /** 点击确定指派以后执行的更新方法*/
    makeSureDesignate(){
      this.designateDialog = false;
      getUser(this.designateForm.designateUserId).then(resp =>{
        this.designateForm.designateUserName = resp.data.nickName
        console.log(this.designateForm)
        //设置需求列表阶段为进行中
        this.designateForm.stage = 1;
        //设置需求列表状态为已激活
        this.designateForm.status = 1
        updateRequirement(this.designateForm).then(response => {
          this.$modal.msgSuccess("指派成功！");
          this.designateDialog = false;
          this.getList();
        });
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        productRequirementId: null,
        productId: null,
        productPlanId: null,
        sourceType: null,
        requirementName: null,
        requirementType: null,
        priority: null,
        description: null,
        acceptanceStandard: null,
        createUserId: null,
        createUserName: null,
        designateUserId: null,
        designateUserName: null,
        designateRemark: null,
        stage: null,
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
      this.ids = selection.map(item => item.productRequirementId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加研发需求";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const productRequirementId = row.productRequirementId || this.ids
      getRequirement(productRequirementId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改研发需求";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productRequirementId != null) {
            updateRequirement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.stage = 0;
            this.form.status = 0;
            getInfo().then(resp =>{
              this.form.createUserId = resp.user.userId
              this.form.createUserName = resp.user.nickName;
              addRequirement(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            })

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const productRequirementIds = row.productRequirementId || this.ids;
      this.$modal.confirm('是否确认删除研发需求编号为"' + productRequirementIds + '"的数据项？').then(function() {
        return delRequirement(productRequirementIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/requirement/export', {
        ...this.queryParams
      }, `requirement_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
