<template>
  <el-row :gutter="config.gutter" v-bind:class="[baseClass]">
    <Col :config="col" v-for="(col,index) in config.cols" :key="index" />
  </el-row>
</template>

<script>
import Col from "./col";
import Base from "./base_widget";

export default {
  name: "fp-row",
  extends: Base,
  components: { Col: Col },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
</style>