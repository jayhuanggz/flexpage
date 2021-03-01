<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass]">
    <el-select
      size="medium"
      :value="values"
      multiple
      clearable
      :multiple-limit="config.multiple && config.limit > 0 ? config.limit : 0"
      :placeholder="config.placeholder"
      popper-class="fp-select-popup-popper"
      @focus="handleFocus"
      @remove-tag="handleRemove"
      @clear="clear"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>

    <fp-widget
      v-bind="popupConfig"
      ref="popup"
      :eagerInit="true"
      v-on:confirm="handleConfirm"
      v-if="showPopup"
      v-on:close="showPopup=false"
    />
  </el-form-item>
</template>

<script>

import FormFiled from "./form_field";

import BaseState from "./state";
import extend from "./../store/extend";
import Transformer from "./../../transformer/transformer";
let State = extend(
  {
    state() {
      return {
        model: []
      };
    }
  },
  BaseState
);
export default {
  name: "fp-select-popup",
  extends: FormFiled,

  computed: {
    popupConfig() {
      let config = this.config.popup;
      if (!config) {
        config = {};
      }
      config.type = "popup";

      return config;
    },
    options() {
      let options = [],
        model = this.model,
        valueProp = this.config.valueProp,
        labelProp = this.config.labelProp;
      if (model && model.length > 0) {
        model.forEach(item => {
          options.push({
            label: item[labelProp],
            value: item[valueProp]
          });
        });
      }
      return options;
    },
    values() {
      let values = [],
        model = this.model,
        valueProp = this.config.valueProp;
      if (model && model.length > 0) {
        model.forEach(item => {
          values.push(item[valueProp]);
        });
      }
      return values;
    }
  },

  data() {
    return { showPopup: false };
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Select Popup",
          clearable: true,
          placeholder: "",
          multiple: false,
          popup: {},
          valueProp: "id",
          labelProp: "name",
          transformers: [],
          limit: 1
        };
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    getStateClass: () => State,
    handleFocus() {
      if (!this.showPopup) {
        this.showPopup = true;
        this.$nextTick(() => {
          if (this.$refs.popup) {
            this.$refs.popup.open();
          }
        });
      }
    },
    handleConfirm(data) {
      let self = this;
      let transformers = self.config.transformers;
      if (transformers && transformers.length > 0) {
        data = Transformer.runPipeline(transformers, self.fpContext, data);
      }

      if (data && data.length > 0) {
        // insert items that do not exist in the current selection
        let model = this.model || [],
          valueProp = this.config.valueProp;
        data.forEach(item => {
          let index = model.findIndex(
            current => current[valueProp] === data[valueProp]
          );
          if (index === -1) {
            model.push(item);
          }
        });
        let manualFire = this.model === model;
        this.model = model;
        if (manualFire) {
          this.fireChange();
        }
      }
    },

    handleRemove(value) {
      let valueProp = this.config.valueProp;
      let index = this.model.findIndex(item => {
        return item[valueProp] === value;
      });
      if (index >= 0) {
        this.model.splice(index, 1);
        this.fireChange();
      }
    },
    clear() {
      this.model = [];
    }
  }
};
</script>

<style lang="scss">
.fp-select-popup-popper {
  display: none;
}
.fp-select-popup {
}
</style>
