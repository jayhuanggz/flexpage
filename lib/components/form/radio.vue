<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass]">
    <el-radio
      v-model="model"
      :label="item.value"
      v-for="item in options"
      :key="item.value"
      >{{ item.label }}</el-radio
    >
  </el-form-item>
</template>

<script>
import Base from "./../base_widget";

import FormFiled from "./form_field";
import DataSourceMixin from "./../../datasource/mixin";

import BaseState from "./state";
import extend from "./../store/extend";
import Util from "./../../utils/util";
let State = extend(
  {
    state() {
      return {
        model: "",
      };
    },
  },
  BaseState
);
export default {
  name: "fp-radio",
  extends: FormFiled,

  mixins: [DataSourceMixin],

  data() {
    return {
      options: [],
    };
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Radio",
          options: [],
          datasource: {},
          defaultValue: "",
        };
      },
    },
  },
  created() {
    this.options = this.config.options || [];
    if (this.config.defaultValue && this.config.defaultValue.length > 0) {
      this.model = this.config.defaultValue;
    }
  },

  methods: {
    getStateClass: () => State,
    defaultModel() {
      if (this.config.defaultValue && this.config.defaultValue.length > 0) {
        return this.config.defaultValue;
      }
    },
    initializeData() {
      let self = this;
      if (
        self.config.datasource &&
        typeof self.config.datasource.type === "string"
      ) {
        self
          .loadData()
          .then((data) => {
            let options = [],
              valueProp = self.config.valueProp,
              labelProp = self.config.labelProp;
            data.forEach((item) => {
              let value = item,
                label = item;

              if (typeof valueProp === "string") {
                value = item[valueProp];
              }
              if (typeof labelProp === "string") {
                label = item[labelProp];
              }

              options.push({
                value: value,
                label: label,
              });
            });
            self.options = options;
          })
          .finally(() => {
            self.sendEvent("bind");
          });
      } else {
        self.sendEvent("bind");
      }
    },
  },
};
</script>

<style lang="scss">
.fp-radio {
}
</style>
