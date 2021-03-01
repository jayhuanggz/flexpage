<template></template>

<script>
import Base from "./../base_widget";
import Datasource from "./../../datasource/datasource";
let State = extend(
  {
    state() {
      return {
        model: {},
        params: {}
      };
    }
  },
  BaseState
);

export default {
  name: "fp-datasource",
  extends: Base,
  computed: {
    ...Base.mapState(["model", "params"])
  },
  created() {
    if (this.config.params) {
      this.params = this.config.params;
    }
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          type: "direct",
          params: {}
        };
      }
    }
  },
  mounted() {
    this.ds = Datasource.create(config);
    this.ds.loadData(this.params).then(data => {
      this.model = data;
    });
  },
  methods: {
    getStateClass() {
      return State;
    }
  }
};
</script>
