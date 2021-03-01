
<script>
import Base from "./../base_widget";
import State from "./state";
import Util from "./../../utils/util";
import Validator from "./validate/validator";

export default {
  extends: Base,
  name: "fp-form-field",
  inject: ["fpForm"],
  props: {},
  data() {
    return {
      error: ""
    };
  },
  computed: {
    ...Base.mapState(["model", "valid"]),
    required() {
      let rules = this.config.rules;

      if (rules && rules.length > 0) {
        return rules.findIndex(r => r.required) !== -1;
      }
      return false;
    }
  },

  mixins: [
    {
      created() {
        this.fpForm.addField(this);
      }
    }
  ],
  methods: {
    getValue(formModel) {
      let property = this.config.property;

      if (
        property &&
        Object.prototype.hasOwnProperty.call(formModel, property)
      ) {
        return formModel[property];
      }
    },

    onValidate(cb) {
      let rules = this.config.rules;
      if (rules && rules.length > 0) {
        let result = Validator.validateRules(
          this.fpContext,
          rules,
          this.model,
          this.fpForm
        );
        if (result === true) {
          this.valid = true;
          this.error = "";
        } else if (typeof result === "string") {
          this.valid = false;
          this.error = result;
        } else {
          this.error = "";
          this.valid = false;
        }
      }
      if (typeof cb === "function") {
        cb(this.valid);
      }
      this.sendEvent(this.valid ? "validated" : "invalidated");
    },
    validate(cb) {
      this.sendEvent("validate", cb);
    },

    onInitializeState() {},

    ready() {
      this.watch("model", () => {
        this.fireChange();
      });
      this.watch("hidden", () => this.clear());
    },

    initModel(model) {
      let newModel = model;
      if (typeof model === "undefined") {
        newModel = this.defaultModel();
      }
      this.$store.commit(this.id + "/updateModel", newModel);
      this.save();
      this.modelUpdated();
      this.sendEvent("initialize_data");
    },

    onStateUpdate(model) {
      let newModel = model;
      if (typeof model === "undefined") {
        newModel = this.defaultModel();
      }

      this.$store.commit(this.id + "/updateModel", newModel);
      this.modelUpdated();
    },
    updateModel(model) {
      this.sendEvent("state_update", model);
    },

    clearError() {
      this.error = "";
    },

    defaultModel() {
      return undefined;
    },
    clear() {
      this.model = undefined;
      this.onClear();
    },
    /**
     * 存档model，用作下次reset回档
     */
    save() {
      this.savedModel = Util.deepCopy(this.model);
      this.onSave();
    },

    onResetState() {
      this.model = Util.deepCopy(this.savedModel);
      this.onReset();
      this.clearError();
      this.$nextTick(() => {
        this.sendEvent("reset_completed");
      });
    },

    reset() {
      this.sendEvent("reset");
    },
    onClear() {},
    onReset() {},
    onSave() {},
    modelUpdated() {},
    fireChange() {
      this.validate();
      this.triggerBindings("model");
      this.fpForm.onChange({
        property: this.config.property,
        value: this.model
      });
    },
    getStateClass() {
      return State;
    }
  }
};
</script>
