<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass]">
    <el-select
      v-model="model"
      :multiple="config.multiple"
      :placeholder="config.placeholder"
      :clearable="config.clearable"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import FormFiled from "./form_field";
import DataSourceMixin from "./../../datasource/mixin";

import BaseState from "./state";
import extend from "./../store/extend";
let State = extend(
  {
    state() {
      return {
        model: "",
        options: [],
      };
    },
  },
  BaseState
);
export default {
  name: "fp-select",
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
          label: "Select",
          clearable: true,
          placeholder: "",
          options: [],
          datasource: {},
          multiple: false,
        };
      },
    },
  },
  created() {
    this.options = this.config.options || [];
  },

  methods: {
    getStateClass: () => State,

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
.fp-select {
}
</style>
