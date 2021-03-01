<template>
  <el-form
    :label-width="config.labelWidth"
    :inline="config.inline"
    v-bind:class="[baseClass]"
    :loading="state === 'submit'"
  >
    <fp-widget v-for="item in config.items" :key="item.id" v-bind="item" ref="widgets" />

    <el-form-item v-if="config.buttons && config.buttons.length > 0" class="fp-form-buttons">
      <el-button
        :autoTrigger="false"
        v-for="(button, index) in config.buttons"
        :key="index"
        v-bind="parseButtonConfig(button)"
        :loading="
          state === 'submit' && button.action && button.action.id == 'submit'
        "
        @click="handleButtonClick(button.action)"
      >{{ button.label }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Base from "./../base_widget";
import DataSourceMixin from "./../../datasource/mixin";

import BaseState from "./state";
import extend from "./../store/extend";
import Util from "./../../utils/util";
import Action from "../actions/action";

let State = extend(
  {
    state() {
      return {
        model: {},
        submittedModel: {},
        valid: true
      };
    }
  },
  BaseState
);

export default {
  extends: Base,
  name: "fp-form",
  mixins: [DataSourceMixin],
  provide() {
    return {
      fpForm: this
    };
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          items: [],
          actions: [],
          submitUrl: ""
        };
      }
    }
  },

  computed: {
    ...Base.mapState(["model", "submittedModel", "valid"])
  },
  data() {
    return {
      loading: false,
      error: ""
    };
  },
  created() {
    this.formFields = [];
  },
  mounted() {
    let self = this;
    self.savedModel = {};
  },
  beforeDestroy() {
    delete this.formFields;
  },
  methods: {
    handleButtonClick(action) {
      Action.triggerAction(action, this.fpContext, this);
    },
    getStateClass() {
      return State;
    },
    parseButtonConfig(button) {
      if (button.action) {
        if (button.action.id === "submit") {
          button.action.trigger = this.submit.bind(this, button.action);
        } else if (button.action.id === "reset") {
          button.action.trigger = this.reset.bind(this, button.action);
        }
      }

      return button;
    },

    addField(widget) {
      this.formFields.push(widget);
    },

    initFormFields() {
      let model = this.model;
      this.formFields.forEach(ref => {
        let value = ref.getValue(model);
        if (typeof value === "undefined") {
          value = ref.defaultModel();
        }
        ref.initModel(value);
      });
    },

    onInvalidated() {},
    onValidate(cb) {
      let self = this;
      let valid = true;
      self.formFields.forEach(ref => {
        ref.validate(v => {
          if (!v) {
            valid = false;
          }
        });
      });
      self.valid = valid;
      self.sendEvent(valid ? "validated" : "invalidated");
      if (typeof cb === "function") {
        cb();
      }
    },
    onStateUpdate(data) {
      if (data && data.property && data.property.length > 0) {
        if (typeof data.value === "undefined") {
          delete this.model[data.property];
        } else {
          this.model[data.property] = data.value;
        }
      }

      this.triggerWatch("model");
      this.$emit("change", this.model);
      this.sendEvent("state_update_complete");
    },

    updateModel(newModel) {
      if (newModel) {
        this.$store.commit(this.id + "/updateModel", newModel);
      }
      let model = this.model;
      this.formFields.forEach(ref => {
        ref.updateModel(ref.getValue(model));
      });
    },

    validate(cb) {
      this.sendEvent("validate", cb);
    },

    initializeData() {
      let self = this;

      self
        .loadData()
        .then(data => {
          if (data) {
            this.$store.commit(this.id + "/updateModel", data);
            this.savedModel = Util.deepCopy(data);
          }
          self.initFormFields();
        })
        .finally(() => {
          self.sendEvent("bind");
        });
    },

    onChange(data) {
      this.sendEvent("state_update", data);
    },
    submit(action) {
      this.validate(() => {
        if (this.valid) {
          this.sendEvent("submit", action);
        }
      });
    },

    onSubmitFail() {},

    /**
     * save current state of the form on submit success
     */
    onSubmitSuccess(reset) {
      this.submittedModel = Util.deepCopy(this.model);

      if (reset !== false) {
        this.savedModel = this.submittedModel;
        this.formFields.forEach(ref => {
          ref.save();
        });
      }
    },
    onSubmit(action) {
      if (action.delegate) {
        let result;
        try {
          result = Action.triggerAction(
            action.delegate,
            this.fpContext,
            this,
            this.model
          );
        } catch (err) {
          this.sendEvent("submit_fail");
          return;
        }

        if (Util.isPromise(result)) {
          result
            .then(() => {
              this.sendEvent("submit_success");
            })
            .catch(err => {
              this.sendEvent("submit_fail");
            });
        } else {
          this.sendEvent("submit_success");
        }
      } else {
        this.sendEvent("submit_success", false);
      }
    },
    onResetState() {
      let model = Util.deepCopy(this.savedModel);
      this.model = model;
      this.formFields.forEach(ref => {
        ref.reset();
      });
      this.$nextTick(() => {
        this.sendEvent("reset_completed");
      });
    },
    reset() {
      this.sendEvent("reset");
    }
  }
};
</script>

<style lang="scss">
.fp-form {
  .fp-form-buttons {
    button {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}
</style>
