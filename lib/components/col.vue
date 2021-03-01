<template>
  <el-col :span="config.span" :offset="config.offset" v-bind:class="[baseClass]">
    <fp-widget v-for="(item,index) in config.items" :key="index" v-bind="item" />
  </el-col>
</template>

<script>
import Base from "./base_widget";

export default {
  name: "fp-column",
  extends: Base,

  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
</style>