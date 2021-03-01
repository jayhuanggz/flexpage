<template>
  <el-pagination
    @size-change="fireChange"
    @current-change="fireChange"
    layout="sizes, prev, pager, next"
    v-bind="config"
    :total="total"
    :current-page.sync="currentPage"
    :page-size.sync="pageSize"
    class="fp-pagination"
    background
  ></el-pagination>
</template>

<script>
import DataSourceMixin from "./../datasource/mixin";
export default {
  name: "fp-pagination",
  mixins: [DataSourceMixin],
  data() {
    let config = this.config;

    return {
      total: 0,
      currentPage: 1,
      pageSize: config.pageSize
    };
  },
  props: {
    datasource: {
      type: Object,
      default() {
        return {};
      }
    },
    config: {
      type: Object,
      default() {
        return {
          "page-size": 10,
          background: true
        };
      }
    }
  },

  mounted() {
    this.refresh();
  },
  methods: {
    fireChange() {
      this.$emit("change", this.getData());
    },
    getData() {
      return {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
    },

    refresh() {
      this.currentPage = 1;
      this.loadData().then(data => {
        this.total = data || 0;
      });
    }
  }
};
</script>

<style lang="scss">
.fp-pagination {
  margin: 20px 0 0;
}
</style>
