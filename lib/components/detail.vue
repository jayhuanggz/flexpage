<template>
  <div v-bind:class="[baseClass, { inline: config.inline }]">
    <div class="field" v-for="field in config.fields" :key="field.property">
      <label class="field-label">{{ field.label }}:</label>
      <span class="field-value" v-html="formatField(field)"></span>
    </div>
  </div>
</template>

<script>
import Base from "./base_widget";

import BaseState from "./store/index";
import extend from "./store/extend";
import DataSourceMixin from "./../datasource/mixin";
import Util from "../utils/util";

let State = extend(
  {
    state() {
      return {
        model: {},
      };
    },
  },
  BaseState
);

export default {
  name: "fp-detail",
  extends: Base,
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          model: {},
          fields: [],
          inline: true,
        };
      },
    },
  },

  created() {
    if (this.config.model) {
      this.model = this.config.model;
    }
  },

  mixins: [DataSourceMixin],
  methods: {
    getStateClass() {
      return State;
    },
    formatField(field) {
      return Util.format(
        this.model[field.property],
        field.dataType,
        field.dataTypeConfig,
        field.decorators
      );
    },

    initializeData() {
      let self = this;

      this.loadData(this.config.datasource.params)
        .then((data) => {
          self.model = data || [];
        })
        .finally(() => {
          self.sendEvent("bind");
        });
    }
  },
};
</script>

<style lang="scss">
.fp-detail {
  .field {
    margin: 15px 10px;
  }
  .field-label {
    margin-bottom: 12px;
    display: block;
  }

  .field-value {
    display: block;
  }

  &.inline {
    .field {
      display: inline-block;
      width: 300px;
      vertical-align: top;
    }
    .field-label {
      display: inline-block;
      margin-bottom: 0;
      width: 100px;
      margin: 10px 0;
      padding-right: 15px;
    }

    .field-value {
      display: inline-block;
      vertical-align: top;
      margin: 10px 0;

      img {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>