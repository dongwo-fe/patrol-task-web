<template>
  <div class="app-container">
    <el-row class="display headerBox">
      <el-col class="searchBox">
        <el-input v-model="listQuery.cname" placeholder="任务名称" style="width: 200px" class="filter-item" />
        <el-select v-model="listQuery.state" placeholder="状态" clearable style="width: 200px" class="filter-item">
          <el-option label="关闭" :value="0" />
          <el-option label="生效" :value="1" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="success" icon="el-icon-plus" @click="handleAdd">创建任务</el-button>
        <!-- <el-button v-waves
                   class="filter-item"
                   type="success"
                   @click="handleRun">执行任务</el-button> -->
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column v-for="item in tableColumn" :key="item.taskId" :label="item.label" :width="item.width">
        <template slot-scope="{ row }">
          <el-tag v-if="item.showMode === 'tag'" size="small" :type="row[item.content] | statusFilter">{{ row[item.content] ? '生效' : '关闭' }}</el-tag>
          <span v-if="item.showMode === 'text'">{{ row[item.content] }}</span>
          <span v-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
          <el-button
            v-if="item.showMode === 'checking'"
            :loading="row[item.content] === 2 ? true : false"
            size="mini"
            :type="row[item.content] | checkStatusFilter"
            plain
            >{{ row[item.content] | checkFilter }}</el-button
          >
          <el-tooltip class="ml10" v-if="item.showMode === 'checking' && row[item.content] === 0" effect="dark" :content="row.failureReason" placement="bottom">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <template v-if="item.showMode === 'arr'">
            <el-tag class="mb10" v-for="(varItem, index) in row[item.content]" :key="varItem+index">{{ varItem }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400px">
        <template slot-scope="{ row }">
          <el-button v-if="row.state === 0" @click="handleUpdate(row)" size="mini" slot="reference" type="primary"> 修改 </el-button>
          <el-popconfirm v-if="row.state === 0" title="确定启动此任务吗？" confirm-button-text="确定" cancel-button-text="取消" @onConfirm="handleModifyState(row, 1)">
            <el-button size="mini" slot="reference" type="success"> 启用 </el-button>
          </el-popconfirm>
          <el-popconfirm v-if="row.state === 1" title="确定暂停此任务吗？" confirm-button-text="确定" cancel-button-text="取消" @onConfirm="handleModifyState(row, 0)">
            <el-button  slot="reference" size="mini" type="info"> 暂停 </el-button>
          </el-popconfirm>
          <el-button type="warning" size="mini" @click="handleRunTack(row)"> 手动执行 </el-button>
          <el-button type="primary" size="mini" @click="goDetails(row)"> 巡检详情 </el-button>
          <el-popconfirm v-if="row.state === 0" title="确定删除此任务吗？" confirm-button-text="确定" cancel-button-text="取消" @onConfirm="handleDelete(row)">
            <el-button type="danger" slot="reference" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="fetchData" />
    <Editor ref="editor_ref" @onSuccess="fetchData" />
  </div>
</template>

<script>
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import checkPermission from '@/utils/permission';
import { getTackList, runTack, delateTask, updateState } from '@/api/task';
import Editor from './editor.vue';

export default {
  name: 'Index',
  directives: { waves },
  components: { Pagination, Editor },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray',
        deleted: 'danger',
      };
      return statusMap[status];
    },
    checkStatusFilter(status) {
      const statusMap = {
        1: 'success', // 成功
        0: 'danger', // 失败
        2: 'primary', // 进行中
        3: 'warning', // 未执行
      };
      return statusMap[status];
    },
    checkFilter(status) {
      const statusMap = {
        1: '检测完成', // 成功
        0: '检测失败', // 失败
        2: '检测中', // 进行中
        3: '未执行', // 未执行
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        cname: '',
        pageNum: 0,
      },
      tableColumn: [
        { id: 0, label: 'ID', width: '100', content: 'id', showMode: 'text' },
        { id: 0, label: '任务ID', width: '100', content: 'taskId', showMode: 'text' },
        { id: 1, label: '任务名称', width: '280', content: 'name', showMode: 'text' },
        { id: 2, label: '任务状态', width: '80', content: 'state', showMode: 'tag' },
        { id: 3, label: '检测地址url', content: 'url', showMode: 'text' },
        { id: 4, label: '检测状态', width: '150', content: 'checkState', showMode: 'checking' },
        { id: 5, label: '创建时间', width: '180', content: 'updatedAt', showMode: 'date' },
        { id: 6, label: '创建人', width: '80', content: 'operator', showMode: 'text' },
        { id: 7, label: '执行时间', width: '100', content: 'time', showMode: 'text' },
        { id: 8, label: '使用变量', width: '200', content: 'variableArr', showMode: 'arr' },
      ],
    };
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listQuery.pageNum = 0;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      getTackList(this.listQuery)
        .then((data) => {
          this.list = data.rows;
          this.total = data.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    handleAdd() {
      // 创建
      this.$refs['editor_ref'].show();
    },
    handleUpdate(row) {
      // 创建
      this.$refs['editor_ref'].show(row);
    },
    handleRunTack(rows) {
      // 手动执行
      console.log('run');
      runTack({id: rows.id})
        .then((data) => {
          this.fetchData();
        })
        .catch((err) => {
          this.$message({
            message: err.message || '执行失败',
            type: 'warning',
          });
        });
    },
    handleDelete(rows) {
      // 删除任务
      console.log(rows);
      delateTask({ id: rows.id })
        .then(() => {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          this.fetchData();
        })
        .catch((err) => {
          this.$message({
            message: err.message || '操作失败',
            type: 'warning',
          });
        });
    },
    handleModifyState(rows, state) {
      // 启停任务
      console.log('ssss');
      updateState({ id: rows.id, state })
        .then(() => {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.fetchData();
        })
        .catch((err) => {
          console.log(err.message);
          this.$message({
            message: err.message || '操作失败',
            type: 'warning',
          });
        });
    },
    goDetails(rows) {
      this.$router.push({path: '/taskManagementDetails', query: {taskId: rows.taskId, browser: rows.browser}});
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.headerBox {
  padding: 20px 0;
}
.searchBox {
  > div {
    margin-right: 20px;
  }
}
.textRight {
  text-align: right;
}
.el-button{
  margin-left: 10px;
}
.ml10{
  margin-left: 10px;
}
.mb10{
  margin-bottom: 10px;
}
</style>
