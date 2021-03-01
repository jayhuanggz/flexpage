<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass]">
    <el-date-picker
      v-model="model"
      :type="config.type"
      :default-value="config.defaultValue"
      :placeholder="config.placeholder"
      :editable="config.editable"
      :clearable="config.clearable"
      :readonly="config.readonly"
      value-format="timestamp"
      :picker-options="pickerOptions"
    ></el-date-picker>
  </el-form-item>
</template>

<script>
import Base from "./../base_widget";

import FormFiled from "./form_field";
import DataSourceMixin from "./../../datasource/mixin";

import BaseState from "./state";
import extend from "./../store/extend";
import Util from "./../../utils/util";
import moment from "moment";
import FlexPage from "./../../../index";

export default {
  name: "fp-date",
  extends: FormFiled,

  data() {
    return {};
  },
  computed: {
    pickerOptions() {
      let min = this.config.min,
        max = this.config.max,
        validatetors = [],
        result = {};

      min = this.parseMinMax(min);
      if (typeof min === "number") {
        validatetors.push(
          (function(min) {
            return function(date) {
              return min <= date.getTime();
            };
          })(min)
        );
      }

      max = this.parseMinMax(max);

      if (typeof max === "number") {
        validatetors.push(
          (function(max) {
            return function(date) {
              return max >= date.getTime();
            };
          })(max)
        );
      }
      if (validatetors.length > 0) {
        result.disabledDate = (function(validatetors) {
          return function(date) {
            for (var i = 0; i < validatetors.length; i++) {
              if (!validatetors[i](date)) {
                return true;
              }
            }
            return false;
          };
        })(validatetors);
      }

      let shortcuts = FlexPage.modules.date.getShortcuts(this.config.type);
      result.shortcuts = shortcuts;
      return result;
    }
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Date",
          clearable: true,
          placeholder: "",
          type: "date",
          editable: false,
          readonly: false,
          min: "",
          max: "",
          defaultValue: new Date()
        };
      }
    }
  },
  created() {
    this.options = this.config.options || [];
  },
  mounted() {},
  methods: {
    parseMinMax(val) {
      if (typeof val === "string" && val.length > 0) {
        if (val === "now") {
          val = Date.now();
        } else {
          val = moment(val, "YYYY-MM-DD").valueOf();
        }
      } else if (typeof val === "object") {
        let value = parseInt(val.value, 10),
          unit = val.unit;

        if (!isNaN(value)) {
          val = moment()
            .add(value, unit)
            .valueOf();
        }
      }
      return val;
    }
  }
};
</script>

<style lang="scss">
.fp-date {
}
</style>
