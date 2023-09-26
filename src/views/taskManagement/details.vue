<template>
  <div class="app-container">
    <div v-loading="listLoading">
      <detailsList :list="list" :browser="listQuery.browser"></detailsList>
    </div>
    <pagination v-show="total > 0" layout="total, prev, pager, next" class="textRight" :total="total" :page.sync="listQuery.pageindex" @pagination="fetchData" />
  </div>
</template>

<script>
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import checkPermission from '@/utils/permission';
import DetailsList from '../components/detailsList';
import { getTackDetails } from '@/api/task';
import Editor from './editor.vue';

export default {
  name: 'Details',
  directives: { waves },
  components: { Pagination, DetailsList },

  data() {
    return {
      listLoading: false,
      list: [],
      total: 0,
      listQuery: {
        taskId: this.$route.query.taskId,
        browser: this.$route.query.browser,
        pageindex: 0,
      },
    };
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  methods: {
    checkPermission,
    handleFilter() {
      this.listQuery.pageindex = 0;
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      getTackDetails(this.listQuery)
        .then((data) => {
          this.list = data.rows;
          this.total = data.count;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.list = [];
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
