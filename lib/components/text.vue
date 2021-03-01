<template>
  <div v-bind:class="[baseClass]">
    <template>
      <h1 v-if="config.tag === 'h1'">{{model}}</h1>
      <h2 v-else-if="config.tag === 'h2'">{{model}}</h2>
      <h3 v-else-if="config.tag === 'h3'">{{model}}</h3>
      <h4 v-else-if="config.tag === 'h4'">{{model}}</h4>
      <h5 v-else-if="config.tag === 'h5'">{{model}}</h5>
      <template v-else>{{model}}</template>
    </template>
  </div>
</template>

<script>
import Base from "./base_widget";

export default {
  name: "fp-text",
  extends: Base,
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          value: "Text",
          tag: "h1"
        };
      }
    }
  },
  mounted() {
    this.model = this.config.value;
  },
  methods: {}
};
</script>

<style lang="scss">
</style>