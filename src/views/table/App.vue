
<template>
  <div id="app">
    <flexpage v-bind="page"></flexpage>
  </div>
</template>

<script>
import flexpage from "./../../../index";

import Page from "./page";

export default {
  name: "app",

  components: {
    flexpage
  },
  data() {
    return {
      page: Page
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
.box {
  background: #000;
}
.test {
  color: red;
}
.foo {
  color: #000;
}
</style>
