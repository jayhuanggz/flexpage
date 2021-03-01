<template>
  <el-form :label-width="labelWidth" :inline="inline">
    <fp-widget
      v-for="(item, index) in items"
      :key="index"
      v-bind="item"
      ref="widgets"
      :eagerInit="true"
    />
  </el-form>
</template>

<script>
export default {
  name: "fp-combo-list-form",
  provide() {
    return {
      fpForm: this,
    };
  },
  props: {
    inline: {
      type: Boolean,
      default() {
        return true;
      },
    },
    labelWidth: {
      type: String,
      default() {
        return "";
      },
    },
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    initialModel: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      model: this.initialModel,
    };
  },
  created() {
    this.formFields = [];
  },
  mounted() {
    let model = this.model;
    this.formFields.forEach((ref) => {
      let value = ref.getValue(model);
      if (typeof value === "undefined") {
        value = ref.defaultModel();
      }
      ref.initModel(value);
    });
  },
  beforeDestroy() {
    delete this.formFields;
  },
  methods: {
    addField(widget) {
      this.formFields.push(widget);
    },

    getModel() {
      return this.model;
    },

    onInvalidated() {},

    validate() {
      let self = this;
      let valid = true;
      self.formFields.forEach((ref) => {
        if (!ref.validate()) {
          valid = false;
        }
      });
      return valid;
    },

    onChange(data) {
      if (data.property && data.property.length > 0) {
        if (typeof data.value === "undefined") {
          delete this.model[data.property];
        } else {
          this.model[data.property] = data.value;
        }
      }
      this.$emit("change", this.model);
      this.validate();
    },
  },
};
</script>

<style lang="scss">
</style>
