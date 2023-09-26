<template>
  <div class="app-container">
    <el-row class="display headerBox">
      <el-col class="searchBox">
        <el-input clearable v-model="listQuery.name" placeholder="任务名称" style="width: 200px" class="filter-item" />
        <el-date-picker
          v-model="listQuery.checkTime"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select v-model="listQuery.browser" placeholder="浏览器类型" style="width: 200px" class="filter-item">
          <el-option label="PC端 " :value="1" />
          <el-option label="移动端" :value="2" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      </el-col>
    </el-row>
    <div v-loading="listLoading">
      <detailsList :list="list" :browser="browserType"></detailsList>
    </div>
    <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="fetchData" />
  </div>
</template>

<script>
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import DetailsList from '../components/detailsList';
import checkPermission from '@/utils/permission';
import { getTackRecord } from '@/api/task';

export default {
  name: 'Details',
  directives: { waves },
  components: { Pagination, DetailsList },
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
        name: '',
        pageNum: 0,
        checkTime: '',
        browser: 1,
      },
      browserType: 1,
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
      this.browserType = this.listQuery.browser;
      this.fetchData();
    },
    fetchData() {
      console.log(this.listQuery);
      this.listLoading = true;
      getTackRecord(this.listQuery)
        .then((data) => {
          this.list = data.rows;
          this.total = data.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.list = [];
          this.$message.error(err.message);
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
