<template>
  <el-form-item
    :label="config.label"
    v-bind:class="[baseClass]"
    :required="required"
    :error="error"
  >
    <el-input
      v-if="config.type === 'number'"
      :placeholder="config.placeholder"
      v-model.number="model"
      :type="config.type"
      :minLength="config.minLength"
      :maxLength="config.maxLength"
      v-bind="config"
    ></el-input>

    <el-input
      v-else
      :placeholder="config.placeholder"
      v-model="model"
      :type="config.type"
      :minLength="config.minLength"
      :maxLength="config.maxLength"
      v-bind="config"
    ></el-input>
  </el-form-item>
</template>

<script>
import FormFiled from "./form_field";
export default {
  name: "fp-input",
  extends: FormFiled,
  data() {
    return {};
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          label: "Text",
          type: "",
          placeholder: "",
          minLength: "",
          maxLength: "",
        };
      },
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.fp-input {
}
</style>
