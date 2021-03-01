<template>
  <div v-bind:class="[baseClass]">
    <div class="fp-table-top">
      <div class="fp-table-header-buttons">
        <el-button
          v-for="(button, index) in config.headerButtons"
          :key="index"
          v-bind="button"
          :autoTrigger="false"
          @click="handleHeaderButtonClick(button.action)"
        >{{ button.label }}</el-button>
      </div>
      <div class="fp-table-header-actions" v-if="config.headerActions.length > 0">
        <el-dropdown @command="handleHeaderAction" split-button>
          {{config.headerActionLabel}}
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :disabled="!(selected.rows && selected.rows.length > 0)"
              :command="action"
              v-for="(action, index) in config.headerActions"
              :key="index"
            >{{ action.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-table
      v-loading="loading"
      :default-sort="defaultSort()"
      :data="tableData"
      ref="table"
      header-row-class-name="fp-table-header"
      @selection-change="onSelectChange"
      @sort-change="onSortChange"
    >
      <el-table-column v-if="config.selectable" type="selection" />

      <el-table-column
        v-for="col in config.cols"
        :key="col.property"
        :prop="col.property"
        :label="col.label"
        :sortable="col.sortable ? 'custom' : false"
      >
        <template slot-scope="scope">
          <span v-html="formatCol(col, scope.row)"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="config.rowActions.length > 0"
        fixed="right"
        :label="config.rowActionLabel"
        width="150"
      >
        <template slot-scope="scope">
          <Button
            :config="{type:'text'}"
            v-for="(action, index) in config.rowActions"
            :key="index"
            v-bind="action"
            v-on:click="handleRowAction(scope.row, action)"
          />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-on:change="onPageChange"
      :datasource="config.pagination.datasource"
      ref="pagination"
      :config="config.pagination"
    ></Pagination>
  </div>
</template>

<script>
import BaseState from "./../store/index";
import extend from "./../store/extend";
import Pagination from "./../../pagination/pagination";
import Base from "./../base_widget";
import DataSourceMixin from "./../../datasource/mixin";
import DataType from "./../../data_type/data_type";
import Action from "./../../components/actions/action";
import Button from "./../../utils/button";
let State = extend(
  {
    state() {
      return {
        tableData: [],
        filter: {},
        selected: {}
      };
    }
  },
  BaseState
);

export default {
  name: "fp-table",
  extends: Base,
  mixins: [DataSourceMixin],
  components: { Pagination, Button },
  data() {
    return {
      loading: false
    };
  },

  computed: {
    ...Base.mapState(["tableData", "filter", "selected"])
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          selectable: true,
          //表头设置
          cols: [
            {
              property: "id",
              label: "id",
              sortable: false,
              id: true
            }
          ],
          //分页设置
          pagination: {
            pageSize: 20,
            pageSizes: [10, 20, 30, 40, 50]
          },
          rowActionLabel: "操作",
          //行操作按钮
          rowActions: [],
          headerButtons: [],
          headerActionLabel: "批量操作",
          //header操作按钮
          headerActions: [],
          defaultSort: {},
          defaultSelectedIds: []
        };
      }
    }
  },

  created() {
    this.rows = [];
    let cols = this.config.cols;
    if (cols && cols.length > 0) {
      for (var i = 0; i < cols.length; i++) {
        if (cols[i].id) {
          this.idProperty = cols[i].property;
          break;
        }
      }
    }
    this.sort = this.config.defaultSort || {};
  },

  filters: {},
  methods: {
    reloadAll() {
      let self = this;
      self.reload();
      self.$refs.pagination.refresh();
    },
    handleHeaderButtonClick(action) {
      Action.triggerAction(action, this.fpContext, this);
    },
    defaultSort() {
      if (this.config.defaultSort && this.defaultSort.property) {
        return {
          prop: this.config.defaultSort.property,
          order: this.config.defaultSort.desc ? "descending" : "ascending"
        };
      }
      return {};
    },
    getStateClass: () => State,
    formatCol(col, row) {
      return DataType.format(col.dataType, row[col.property]);
    },
    onPageChange(e) {
      this.reload();
    },
    ready() {
      let self = this;
      this.watch("filter", newVal => {
        this.reload();
        self.$refs.pagination.refresh();
      });
    },

    initializeData() {
      let self = this;

      self.reload().finally(() => {
        self.sendEvent("bind");
      });
      self.$refs.pagination.refresh();
    },
    reload() {
      let self = this;
      let params = this.config.datasource.params || {};
      params.params = self.filter;
      self.loading = true;
      self.$refs.table.clearSelection();

      return self
        .loadData(params, self.$refs.pagination.getData(), self.sort)
        .then(data => {
          self.selected = {};
          self.tableData = data || [];
          self.tableData.forEach(row => {
            let id = row[this.idProperty];
            if (typeof id !== "undefined") {
              row._id = id;
            }
          });
          self.$nextTick(() => {
            self.selectDefault();
          });
        })
        .finally(() => {
          self.loading = false;
        });
    },
    selectDefault() {
      let defaultSelectedIds = this.config.defaultSelectedIds,
        self = this,
        selectedRows = [];
      if (defaultSelectedIds && defaultSelectedIds.length > 0) {
        let rows = [],
          tableData = this.tableData;
        if (tableData && tableData.length > 0) {
          tableData.forEach(row => {
            if (defaultSelectedIds.indexOf(row._id) !== -1) {
              self.$refs.table.toggleRowSelection(row, true);
              selectedRows.push(row);
            }
          });
        }
      }
      self.selected = { rows: selectedRows, ids: defaultSelectedIds };
    },

    onSelectChange(rows) {
      let ids = [];

      if (this.idProperty) {
        rows.forEach(row => {
          let id = row[this.idProperty];
          if (typeof id !== "undefined") {
            ids.push(id);
          }
        });
      }
      this.selected = {
        rows: rows,
        ids: ids
      };
    },
    handleHeaderAction(action) {
      this.loading = true;
      Action.triggerAction(
        action,
        this.fpContext,
        this,
        this.selected,
        () => (this.loading = false)
      );

    },
    handleRowAction(row, action) {
      let actionInstance = Action.getAction(action.id);
      if (actionInstance) {
        this.loading = true;

        actionInstance.trigger(
          this.fpContext,
          this,
          action.params,
          row,
          () => (this.loading = false)
        );
      }
    },
    onSortChange(column) {
      this.sort = {
        property: column.prop,
        desc: column.order === "descending"
      };
      this.reload();
    }
  }
};
</script>

<style lang="scss">
.fp-table {
  .fp-table-header > th {
    background-color: #f5f7fa;
    color: #606266;
  }
  img {
    width: 60px;
    height: 60px;
  }

  .fp-table-top {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 15px 0;

    .fp-table-header-actions {
      flex: 1;
      .el-dropdown-link {
        cursor: pointer;
        color: #409eff;
      }
      text-align: right;
    }
  }
}
</style>