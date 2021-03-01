<template>
  <div v-bind:class="[baseClass]">
    <ul>
      <li v-for="item in model" :key="item._key">
        <Form
          :key="'combo-list-form_' + item._key"
          ref="forms"
          v-bind="config.itemConfig"
          :initialModel="item"
          @change="onChange"
          v-on:change="onChange($event, item._key)"
          class="form-box"
        />
        <el-button type="danger" @click="deleteItem(item._key)">{{
          config.deleteButtonLabel
        }}</el-button>
      </li>
    </ul>
    <div class="btn-box">
      <el-button type="primary" @click="addItem">
        {{ config.addButtonLabel }}
      </el-button>
    </div>
  </div>
</template>

<script>
let itemKey = 0;
import FormField from "./../form_field";

import Form from "./combo_list_form";
import BaseState from "./../state";
import extend from "./../../store/extend";
import Util from "./../../../utils/util";

let State = extend(
  {
    state() {
      return {
        model: [],
      };
    },
  },
  BaseState
);

export default {
  extends: FormField,
  name: "fp-combo-list",
  data() {
    return {};
  },

  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          items: [],
          max: 0,
          min: 0,
          addButtonLabel: "添加",
          deleteButtonLabel: "删除",
        };
      },
    },
  },

  components: { Form },

  created() {
    this.assignKeysForChildForms();
  },

  mounted() {},
  methods: {
    getStateClass() {
      return State;
    },
    assignKeysForChildForms() {
      let items = this.model;

      if (items && items.length > 0) {
        items.forEach((item) => {
          if (typeof item._key === "undefined") {
            item._key = ++itemKey;
          }
        });
      }
    },

    deleteItem(key) {
      let index = this.model.findIndex((item) => item._key === key);
      if (index >= 0) {
        this.model.splice(index, 1);
        this.fireChange();
      }
    },
    addItem() {
      let items = this.model || [];
      let newItem = {
        _key: ++itemKey,
      };
      items.push(newItem);
      this.updateModel(items);
      this.fireChange();
    },
    onChange(data, key) {
      if (this.updating) {
        return;
      }
      let index = this.model.findIndex((item) => key === item._key);
      if (index >= 0) {
        this.model[index] = data;
        this.fireChange();
      }
    },

    modelUpdated() {
      this.assignKeysForChildForms();
    },

    reset() {
      this.model = Util.deepCopy(this.savedModel);
      this.modelUpdated();
    },
    isValid() {
      let result = true;
      let itemRefs = this.$refs.items;
      if (itemRefs && itemRefs.length > 0) {
        for (let i = 0; i < itemRefs.length; i++) {
          result = itemRefs[i].isValid();
          if (!result) {
            return result;
          }
        }
      }

      return result;
    },
  },
};
</script>

<style lang="scss">
.fp-combo-list {
  margin: 0 0 20px;
  > ul > li {
    margin: 0 0 20px 0;
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>