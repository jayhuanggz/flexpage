<template>
  <el-form-item :label="config.label" v-bind:class="[baseClass]">
    <el-switch v-model="model"></el-switch>
  </el-form-item>
</template>

<script>
import FormFiled from "./form_field";
export default {
  name: "fp-switch",
  extends: FormFiled,
  data() {
    return {};
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Switch",
          defaultValue: false
        };
      }
    }
  },
  created() {
    this.model = this.config.defaultValue;
  },
  mounted() {},
  methods: {
    defaultModel() {
      return false;
    }
  }
};
</script>

<style lang="scss">
.fp-switch {
}
</style>
