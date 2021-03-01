<template>
  <div v-bind:class="[baseClass]">
    <fp-widget v-for="(item,index) in config.items" :key="index" v-bind="item" />
  </div>
</template>

<script>
import Base from "./base_widget";

export default {
  name: "fp-section",
  extends: Base,

  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
</style>