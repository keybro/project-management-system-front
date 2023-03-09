<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="项目集名称" prop="itemSetName">
        <el-input
          v-model="queryParams.itemSetName"
          placeholder="请输入项目集名称"
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
          v-hasPermi="['system:item_set:add']"
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
          v-hasPermi="['system:item_set:edit']"
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
          v-hasPermi="['system:item_set:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:item_set:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="item_setList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="项目集id" align="center" prop="itemSetId" />-->
      <el-table-column label="项目集名称" align="center" prop="itemSetName" />
      <el-table-column label="负责人姓名" align="center" prop="principalName" />
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
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:item_set:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:item_set:remove']"
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

    <!-- 添加或修改项目集对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="项目集名称" prop="itemSetName">
          <el-input v-model="form.itemSetName" placeholder="请输入项目集名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="itemSetName">
          <el-select v-model="form.principalId" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.nickName"
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
import { listItem_set, getItem_set, delItem_set, addItem_set, updateItem_set } from "@/api/system/item_set";
import { listUser,getUser } from '@/api/system/user'

export default {
  name: "Item_set",
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
      // 项目集表格数据
      item_setList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //用户列表，选择负责人用
      userList: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemSetName: null,
        principalName: null,
        startTime: null,
        endTime: null,
        state: null,
      },
      queryParamsUserList: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getUserInfo()
    this.getList();
  },
  methods: {
    /** 查询项目集列表 */
    getList() {
      this.loading = true;
      listItem_set(this.queryParams).then(response => {
        this.item_setList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 用户信息，指派负责人用 */
    getUserInfo(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
          console.log(this.userList)
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        itemSetId: null,
        itemSetName: null,
        principalId: null,
        principalName: null,
        budget: null,
        startTime: null,
        endTime: null,
        description: null,
        state: null
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
      this.ids = selection.map(item => item.itemSetId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目集";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const itemSetId = row.itemSetId || this.ids
      getItem_set(itemSetId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目集";
      });
    },
    /** 提交按钮 */
    async submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.itemSetId != null) {
            updateItem_set(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            //获取负责人姓名并存储
            const userId = this.form.principalId;
            getUser(userId).then(resp =>{
              this.form.principalName = resp.data.nickName
              this.form.state = 1;
              addItem_set(this.form).then(response => {
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
      const itemSetIds = row.itemSetId || this.ids;
      this.$modal.confirm('是否确认删除项目集编号为"' + itemSetIds + '"的数据项？').then(function() {
        return delItem_set(itemSetIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/item_set/export', {
        ...this.queryParams
      }, `item_set_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
