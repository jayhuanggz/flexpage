<template>
  <el-popconfirm v-if="popConfirm" :title="popConfirm.title" @confirm="onClick">
    <el-button
      slot="reference"
      v-bind="config"
      :loading="loading"
      :disabled="disabled"
      >{{ label }}</el-button
    >
  </el-popconfirm>
  <el-button
    v-else
    @click="onClick"
    v-bind="config"
    :loading="loading"
    :disabled="disabled"
    >{{ label }}</el-button
  >
</template>

<script>
import Action from "./../components/actions/action";
export default {
  name: "fp-util-button",

  props: {
    loading: {
      type: Boolean,
    },
    autoTrigger: {
      type: Boolean,
      default() {
        return true;
      },
    },
    popConfirm: {
      type: Object,
    },

    config: {
      type: Object,
    },
    action: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },

    label: {
      type: String,
    },
  },
  created() {},
  mounted() {},
  methods: {
    onClick(e) {
      e && e.preventDefault();
      if (this.autoTrigger) {
        let actionConfig = this.action;
        if (actionConfig) {
          Action.triggerAction(actionConfig, this.fpContext, this);
        }
      }
      this.$emit("click", this.action);
    },
  },
};
</script>

<style lang="scss">
.el-button.el-popover__reference {
  margin-left: 10px;
}
</style>
