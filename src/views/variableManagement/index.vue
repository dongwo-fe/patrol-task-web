<template>
  <div class="app-container">
    <el-row class="display headerBox">
      <el-col class="searchBox">
        <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px" class="filter-item" />
        <el-select v-model="listQuery.type" placeholder="变量类型" clearable style="width: 200px" class="filter-item">
          <el-option label="localstorage " :value="1" />
          <el-option label="sessionstorage" :value="2" />
          <el-option label="cookie" :value="3" />
          <el-option label="head头" :value="4" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-waves class="filter-item" type="success" icon="el-icon-plus" @click="handleAdd">添加变量</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column v-for="item in tableColumn" :key="item.id" :label="item.label" :width="item.width">
        <template slot-scope="{ row }">
          <el-tag v-if="item.showMode === 'tag'" size="small">{{ row[item.content] | typeFilter}}</el-tag>
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
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="350px">
        <template slot-scope="{ row }">
          <!-- <el-button type="primary" size="mini" @click="goDetails(row)"> 查看 </el-button> -->
          <el-button type="warning" size="mini" @click="handleUpdate(row)"> 修改 </el-button>
          <el-popconfirm title="删除变量可能导致对应的巡检任务执行失败，确定要删除吗？" confirm-button-text="确定" cancel-button-text="取消" @onConfirm="handleDelete(row)">
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
import { getVariableList, delateVariable, getByID } from '@/api/variable';
import Editor from './editor.vue';

export default {
  name: 'VariableManagement',
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
    typeFilter(status) {
      const statusMap = {
        1: 'localstorage',
        2: 'sessionstorage',
        3: 'cookie',
        4: 'head头',
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
        name: '',
        type: '',
        pageNum: 0,
      },
      tableColumn: [
        { id: 0, label: 'ID', width: '100', content: 'id', showMode: 'text' },
        { id: 1, label: '名称', width: '280', content: 'name', showMode: 'text' },
        { id: 2, label: '类型', width: '150', content: 'type', showMode: 'tag' },
        { id: 3, label: 'key', width: '180', content: 'key', showMode: 'text' },
        { id: 4, label: 'value', content: 'value', showMode: 'text' },
        { id: 5, label: 'cookieDomain', width: '200', content: 'cookieDomain', showMode: 'text' },
        { id: 5, label: '创建时间', width: '200', content: 'createdAt', showMode: 'date' },
        { id: 6, label: '创建人', width: '100', content: 'operator', showMode: 'text' },
      ],
    };
  },
  created() {},
  mounted() {
    this.fetchData();
    this.handleByID();
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listQuery.pageNum = 0;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      getVariableList(this.listQuery)
        .then((data) => {
          this.list = data.rows;
          this.total = data.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleAdd() {
      // 创建
      this.$refs['editor_ref'].show();
    },
    handleUpdate(row) {
      this.$refs['editor_ref'].show(row);
    },
    handleDelete(rows) {
      // 删除变量
      console.log(rows);
      delateVariable({ id: rows.id })
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
    handleByID(rows) {
      // 删除变量
      console.log(rows);
      getByID({ ids: [1, 3] })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
</style>
