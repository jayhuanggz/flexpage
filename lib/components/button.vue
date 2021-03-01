<template>
  <el-popconfirm v-if="config.popConfirm" :title="config.popConfirm.title" @confirm="onClick">
    <el-button
      slot="reference"
      v-bind="config"
      :loading="loading"
      :disabled="disabled"
      v-bind:class="[baseClass]"
    >{{config.label}}</el-button>
  </el-popconfirm>
  <el-button
    v-else
    v-bind="config"
    :loading="loading"
    @click="onClick"
    :disabled="disabled"
    v-bind:class="[baseClass]"
  >{{config.label}}</el-button>
</template>

<script>
import Base from "./base_widget";
import Action from "./actions/action";
import BaseState from "./store/index";
import extend from "./store/extend";

let State = extend(
  {
    state() {
      return {
        disabled: false
      };
    }
  },
  BaseState
);

export default {
  name: "fp-button",
  extends: Base,
  computed: {
    ...Base.mapState(["disabled"])
  },
  props: {
    loading: {
      type: Boolean
    },
    autoTrigger: {
      type: Boolean,
      default() {
        return true;
      }
    },

    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Label",
          disabled: false
        };
      }
    }
  },
  created() {
    this.disabled = this.config.disabled;
  },
  mounted() {},
  methods: {
    onClick(e) {
      e && e.preventDefault();
      if (this.autoTrigger) {
        let actionConfig = this.config.action;
        if (actionConfig) {
          Action.triggerAction(actionConfig, this.fpContext, this);
        }
      }

      this.$emit("click", this.config.action);
    },
    getStateClass() {
      return State;
    }
  }
};
</script>

<style lang="scss">
.el-button.el-popover__reference {
  margin-left: 10px;
}
</style>
