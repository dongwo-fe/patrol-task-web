<template>
  <div class="app-container">
    <el-row class="display headerBox">
      <el-col class="searchBox">
        <el-input v-model="listQuery.code" placeholder="CODE码" style="width: 200px" class="filter-item" />
        <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 200px" class="filter-item">
          <el-option label="关闭" :value="0" />
          <el-option label="生效" :value="1" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handerSearch">搜索</el-button>
        <el-button v-waves class="filter-item" type="success" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column v-for="item in tableColumn" :key="item.taskId" :label="item.label" :width="item.width">
        <template slot-scope="{ row }">
          <el-tag v-if="item.showMode === 'tag'" size="small" :type="row[item.content] | statusFilter">{{ row[item.content] ? '生效' : '关闭' }}</el-tag>
          <span v-if="item.showMode === 'text'">{{ row[item.content] }}</span>
          <span v-if="item.showMode === 'date'">{{ row[item.content] | dateFormat() }}</span>
          <el-button v-if="item.showMode === 'checking'" :loading="row[item.content] === 2 ? true : false" size="mini" :type="row[item.content] | checkStatusFilter" plain>{{
            row[item.content] | checkFilter
          }}</el-button>
          <el-tooltip class="ml10" v-if="item.showMode === 'checking' && row[item.content] === 0" effect="dark" :content="row.failureReason" placement="bottom">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <template v-if="item.showMode === 'arr'">
            <el-tag class="mb10" v-for="(varItem, index) in row[item.content]" :key="varItem + index">{{ varItem }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button @click="handleUpdate(row)" size="mini" type="primary"> 修改 </el-button>
            <el-button v-if="row.status === 0" size="mini" type="success" @click="handleStart(row, 1)"> 启用 </el-button>
            <el-button v-if="row.status === 1" size="mini" type="info" @click="handleStart(row, 0)"> 暂停 </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="getlist" />
    <Editor ref="editor_ref" @onSuccess="getlist" />
  </div>
</template>
<script>
import { getCodelist, updateCode } from '@/api/code';
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import Editor from './Editor.vue';

export default {
  name: 'CodeManger',
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
  },
  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        code: '',
        status: undefined,
        pageindex: 0,
      },
      tableColumn: [
        { id: 0, label: 'ID', width: '100', content: 'id', showMode: 'text' },
        { id: 0, label: 'CODE码', width: '100', content: 'code', showMode: 'text' },
        { id: 1, label: '显示文案', width: '280', content: 'name', showMode: 'text' },
        { id: 1, label: '备注和策略', content: 'remark', showMode: 'text' },
        { id: 2, label: '紧急程度', width: '80', content: 'state', showMode: 'text' },
        { id: 5, label: '创建时间', width: '180', content: 'updatedAt', showMode: 'date' },
        { id: 6, label: '创建人', width: '80', content: 'operator', showMode: 'text' },
        { id: 2, label: '状态', width: '80', content: 'status', showMode: 'tag' },
      ],
    };
  },
  mounted: function () {
    this.getlist();
  },
  methods: {
    async getlist(pageindex) {
      this.listLoading = true;
      if (pageindex !== undefined) this.listQuery.pageindex = pageindex;
      try {
        const data = await getCodelist(this.listQuery);
        this.list = data.rows;
        this.total = data.count;
        this.listLoading = false;
      } catch (error) {
        console.log(error);
        this.listLoading = false;
      }
    },
    handerSearch() {
      this.getlist(0);
    },
    handleAdd() {
      this.$refs['editor_ref'].show();
    },
    handleUpdate(row) {
      this.$refs['editor_ref'].show(row);
    },
    handleStart(row, status) {
      const that = this;
      this.$confirm(`是否${status === 1 ? '启用' : '暂停'}：${row.code}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          updateCode({ status, id: row.id });
          this.getlist();
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
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
.el-button {
  margin-left: 10px;
}
</style>
