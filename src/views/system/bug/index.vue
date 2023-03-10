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
      <el-form-item label="创建者id" prop="createrId">
        <el-input
          v-model="queryParams.createrId"
          placeholder="请输入创建者id"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:bug:add']"
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
          v-hasPermi="['system:bug:edit']"
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
          v-hasPermi="['system:bug:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:bug:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bugList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="bugid" align="center" prop="bugId" />
      <el-table-column label="产品id" align="center" prop="productId" />
      <el-table-column label="项目id" align="center" prop="itemId" />
      <el-table-column label="执行id" align="center" prop="executeId" />
      <el-table-column label="指派人id" align="center" prop="designateId" />
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
      <el-table-column label="重现步骤" align="center" prop="reStep" />
      <el-table-column label="相关需求id" align="center" prop="relateNeedId" />
      <el-table-column label="相关任务id" align="center" prop="relateTaskId" />
      <el-table-column label="bug结果" align="center" prop="result">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.bug_result" :value="scope.row.result"/>
        </template>
      </el-table-column>
      <el-table-column label="创建者id" align="center" prop="createrId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:bug:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:bug:remove']"
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

    <!-- 添加或修改bug列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
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
        <el-form-item label="重现步骤">
          <editor v-model="form.reStep" :min-height="192"/>
        </el-form-item>
        <el-form-item label="bug结果" prop="result">
          <el-select v-model="form.result" placeholder="请选择bug结果">
            <el-option
              v-for="dict in dict.type.bug_result"
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
  </div>
</template>

<script>
import { listBug, getBug, delBug, addBug, updateBug } from "@/api/system/bug";

export default {
  name: "Bug",
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
      // bug列表表格数据
      bugList: [],
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
        createrId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询bug列表列表 */
    getList() {
      this.loading = true;
      listBug(this.queryParams).then(response => {
        this.bugList = response.rows;
        this.total = response.total;
        this.loading = false;
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
      this.open = true;
      this.title = "添加bug列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bugId = row.bugId || this.ids
      getBug(bugId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改bug列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bugId != null) {
            updateBug(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBug(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除bug列表编号为"' + bugIds + '"的数据项？').then(function() {
        return delBug(bugIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/bug/export', {
        ...this.queryParams
      }, `bug_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
