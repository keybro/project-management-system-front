<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="所属执行" prop="executeId">-->
<!--        <el-select v-model="queryParams.executeId" placeholder="请选择所属执行" clearable>-->
<!--          <el-option-->
<!--            v-for="item in executeList"-->
<!--            :key="item.executeId"-->
<!--            :label="item.executeName"-->
<!--            :value="item.executeId"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="相关需求" prop="executeId">-->
<!--        <el-select v-model="queryParams.relateRequirement" placeholder="请选择相关需求" clearable>-->
<!--          <el-option-->
<!--            v-for="item in requirementList"-->
<!--            :key="item.productRequirementId"-->
<!--            :label="item.requirementName"-->
<!--            :value="item.productRequirementId"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="任务类型" prop="taskType">
        <el-select v-model="queryParams.taskType" placeholder="请选择任务类型" clearable>
          <el-option
            v-for="dict in dict.type.task_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
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
      <!--      <el-form-item label="实际开始时间" prop="actualStartTime">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.actualStartTime"-->
      <!--          placeholder="请输入实际开始时间"-->
      <!--          clearable-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="任务状态" prop="taskState">
        <el-select v-model="queryParams.taskState" placeholder="请选择任务状态" clearable>
          <el-option
            v-for="dict in dict.type.task_state"
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
          v-hasPermi="['system:task:add']"
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
          v-hasPermi="['system:task:edit']"
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
          v-hasPermi="['system:task:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:task:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="执行id" align="center" prop="taskId" />-->
      <el-table-column label="所属执行" align="center" prop="executeName" />
      <!--      <el-table-column label="任务类型" align="center" prop="taskType">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.task_type" :value="scope.row.taskType"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="指派人id" align="center" prop="designateId" />-->
      <el-table-column label="指派人" align="center" prop="designateName" />
      <el-table-column label="相关研发需求" align="center" prop="relateRequirementName" />
      <el-table-column label="任务名称" align="center" prop="taskName" />
      <!--      <el-table-column label="描述" align="center" prop="description" />-->
      <el-table-column label="优先级" align="center" prop="priority">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.requirement_priority" :value="scope.row.priority"/>
        </template>
      </el-table-column>
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
      <el-table-column label="实际开始时间" align="center" prop="actualStartTime">
        <template slot-scope="scope">
          <span v-if="scope.row.actualStartTime == null">无数据</span>
          <span v-if="scope.row.actualStartTime != null">{{scope.row.actualStartTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总耗时" align="center" prop="timeConsuming" />
      <el-table-column label="任务状态" align="center" prop="taskState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.task_state" :value="scope.row.taskState"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="startTask(scope.row)"
            v-hasPermi="['system:task:edit']"
            v-if="scope.row.taskState!=1"
          >开始</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="finishTask(scope.row)"
            v-hasPermi="['system:task:edit']"
            v-if="scope.row.taskState==1"
          >完成</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:task:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:task:remove']"
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

    <!-- 添加或修改任务列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50vw" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
<!--        <el-form-item label="所属执行" prop="executeId">-->
<!--          <el-select v-model="form.executeId" placeholder="请选择所属执行">-->
<!--            <el-option-->
<!--              v-for="item in executeList"-->
<!--              :key="item.executeId"-->
<!--              :label="item.executeName"-->
<!--              :value="item.executeId"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="form.taskType" placeholder="请选择任务类型">
            <el-option
              v-for="dict in dict.type.task_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指派给" prop="designateId">
          <el-select v-model="form.designateId" placeholder="请选择指派人">
            <el-option
              v-for="item in groupUserList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="关联研发需求" prop="relateRequirement">-->
<!--          <el-select v-model="form.relateRequirement" placeholder="请选择指派人">-->
<!--            <el-option-->
<!--              v-for="item in requirementList"-->
<!--              :key="item.productRequirementId"-->
<!--              :label="item.requirementName"-->
<!--              :value="item.productRequirementId"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入任务名城管" />
        </el-form-item>
        <el-form-item label="描述">
          <editor v-model="form.description" :min-height="192"/>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--  开始任务提示框  -->
    <el-dialog
      title="提示"
      :visible.sync="startTaskDialog"
      width="30%">
      <span>是否确定开始此任务</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="startTaskDialog = false">取 消</el-button>
    <el-button type="primary" @click="makeSureStartTask">确 定</el-button>
  </span>
    </el-dialog>

    <!--  完成任务提示框  -->
    <el-dialog
      title="提示"
      :visible.sync="finishTaskDialog"
      width="30%">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所用工时" prop="executeId">
          <el-input v-model="form.timeConsuming" placeholder="单位:小时"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="finishTaskDialog = false">取 消</el-button>
    <el-button type="primary" @click="makeSureFinishTask">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/system/task";
import { listExecute } from '@/api/system/execute'
import { listRequirement } from '@/api/system/requirement'
import { getUser, listUser } from '@/api/system/user'
import { listItem } from '@/api/system/item'

export default {
  name: "index",
  dicts: ['requirement_priority', 'task_state', 'task_type'],
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
      // 任务列表表格数据
      taskList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      startTaskDialog:false,
      finishTaskDialog:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        executeId: null,
        taskType: null,
        designateId: null,
        designateName: null,
        relateRequirement: null,
        taskName: null,
        description: null,
        priority: null,
        startTime: null,
        endTime: null,
        actualStartTime: null,
        timeConsuming: null,
        taskState: null
      },
      queryParamsExecuteList:{},
      executeList:[],
      queryParamsRequireList:{},
      requirementList:[],
      queryParamsUserList:{},
      userList:[],
      groupUserList:[],
      exeId:null,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      queryParamsExecuteListOne:{},
      queryParamsItem:{},
      execute:[],
      itemList:[],
    };
  },
  created() {
    this.exeId = this.$route.params.exeId;
    this.queryParams.executeId = this.exeId
    this.queryParamsExecuteList.executeId = this.exeId;
    this.getList();
    this.getExecuteList();
    this.getRequreList();
    this.getUserList();
  },
  methods: {
    /** 查询任务列表列表 */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询执行列表 */
    getExecuteList(){
      this.queryParamsExecuteList.executeId = this.exeId;
      listExecute(this.queryParamsExecuteList).then(response => {
        this.executeList = response.rows;
        const groupIds = this.executeList[0].teamMembersIds.split(',')
        for (let i = 0; i < groupIds.length; i++) {
          getUser(groupIds[i]).then(response => {
            this.groupUserList[i] = response.data;
          });
        }
        // console.log(this.groupUserList)
      });
    },
    /** 获取需求列表*/
    getRequreList(){
      listRequirement(this.queryParamsRequireList).then(response => {
        this.requirementList = response.rows;
      });
    },
    /** 获取用户信息，用于创建产品时选择负责人和测试人 */
    getUserList(){
      listUser(this.queryParamsUserList).then(response => {
          this.userList = response.rows;
        }
      );
    },
    startTask(row){
      //判断任务所属项目是否已经开始
      //如果没有开始，提示等待项目经理开始
      var exeId = row.executeId;
      this.queryParamsExecuteListOne.executeId = exeId;
      //获取执行信息，进而过得itemId
      listExecute(this.queryParamsExecuteListOne).then(response => {
        this.execute = response.rows;
        console.log(this.execute)
        var itemId = this.execute[0].itemId;
        this.queryParamsItem.itemId = itemId;
        //获取项目信息
        listItem(this.queryParamsItem).then(response => {
          this.itemList = response.rows;
          console.log("在这")
          console.log(this.itemList)
          if (this.itemList[0].status==0){
            console.log("没开始")
            this.$confirm('项目尚未开始，请联系项目负责人', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          }
          if (this.itemList[0].status==2){
            this.$confirm('项目已结束，请联系项目负责人', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          }
          if (this.itemList[0].status==1){
            //如果开始了，跳出开始对话框
            this.startTaskDialog = true;
            this.form.taskId = row.taskId;
          }
        });
      });
    },
    /** 确定开始任务 */
    makeSureStartTask(){
      this.startTaskDialog = false;
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1;
      var day = date.getDate();
      var thisTime = year+'-'+month+'-'+day;
      this.form.actualStartTime = thisTime;
      this.form.taskState = 1;
      updateTask(this.form).then(response => {
        this.$modal.msgSuccess("开始成功");
        this.getList();
      });
    },

    finishTask(row){
      this.finishTaskDialog = true;
      this.form.taskId = row.taskId;
    },
    /** 确定结束任务 */
    makeSureFinishTask(){
      this.finishTaskDialog = false;
      this.form.taskState = 2;
      updateTask(this.form).then(response => {
        this.$modal.msgSuccess("结束成功");
        this.getList();
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
        taskId: null,
        executeId: null,
        taskType: null,
        designateId: null,
        designateName: null,
        relateRequirement: null,
        taskName: null,
        description: null,
        priority: null,
        startTime: null,
        endTime: null,
        actualStartTime: null,
        timeConsuming: null,
        taskState: null
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
      this.queryParams.relateRequirement = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.taskId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const taskId = row.taskId || this.ids
      getTask(taskId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.taskId != null) {
            updateTask(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.taskState = 0;
            this.form.timeConsuming = 0;
            //点击任务分解进入的任务界面，创建时是不需要选择所属执行和关联需求的
            this.form.executeId = this.$route.params.exeId;
            this.form.relateRequirement = this.executeList[0].relateRequireId
            addTask(this.form).then(response => {
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
      const taskIds = row.taskId || this.ids;
      this.$modal.confirm('是否确认删除任务列表编号为"' + taskIds + '"的数据项？').then(function() {
        return delTask(taskIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/task/export', {
        ...this.queryParams
      }, `task_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
