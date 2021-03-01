<template>
  <div v-bind:class="[baseClass]">
    <el-tabs>
      <el-tab-pane :label="tab.label"  v-for="(tab,index) in config.tabs" :key="index">
        <fp-widget v-for="(item,j) in tab.items" :key="index + '_'+ j" v-bind="item" />
      </el-tab-pane>
    </el-tabs>
    <fp-widget v-for="(item,index) in config.items" :key="index" v-bind="item" />
  </div>
</template>

<script>
import Base from "./base_widget";

export default {
  name: "fp-tab",
  extends: Base,

  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
</style>