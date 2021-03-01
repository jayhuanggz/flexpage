<script>
import Id from "./../utils/id";
import DefaultState from "./store/index";
import StateBindingFactory from "./store/state_binding_factory";
import Util from "./../utils/util";

import { createMachine, interpret } from "xstate";

const FSM_DEF = function () {
  return {
    initial: "mounted",
    states: {
      mounted: {
        on: {
          initialize_state: {
            target: "initialize_state",
          },
        },
      },
      initialize_state: {
        entry: (context, event) => {
          context.onInitializeState(event.data);
        },
        on: {
          initialize_data: {
            target: "initialize_data",
          },
        },
      },
      initialize_data: {
        entry: (context, event) => {
          context.onInitializeData(event.data);
        },
        on: {
          bind: {
            target: "bind",
          },
        },
      },
      bind: {
        entry: (context, event) => {
          context.onBind(event.data);
        },
        on: {
          ready: {
            target: "ready",
            actions: (context, event) => {
              context.onReady(event.data);
            },
          },
        },
      },
      ready: {
        on: {
          state_update: {
            target: "state_update",
          },
          validate: {
            target: "validate",
          },
          reset: {
            target: "reset",
          },
          submit: {
            target: "submit",
          },
        },
      },

      state_update: {
        entry: (context, event) => {
          context.onStateUpdate(event.data);
        },
        on: {
          validate: {
            target: "validate",
          },
          state_update_complete: {
            target: "ready",
          },
        },
      },
      validate: {
        entry: (context, event) => {
          context.onValidate(event.data);
        },
        on: {
          validated: {
            target: "ready",
          },
          invalidated: {
            target: "invalidated",
          },
        },
      },
      invalidated: {
        entry: (context, event) => {
          context.onInvalidated(event.data);
        },
        on: {
          state_update: {
            target: "state_update",
          },
          validate: {
            target: "validate",
          },
          reset: {
            target: "reset",
          },
        },
      },
      reset: {
        entry: (context, event) => {
          context.onResetState(event.data);
        },
        on: {
          reset_completed: {
            target: "ready",
          },
        },
      },
      submit: {
        entry: (context, event) => {
          context.onSubmit(event.data);
        },
        on: {
          submit_fail: {
            target: "ready",
            actions: (context, event) => {
              context.onSubmitFail(event.data);
            },
          },
          submit_success: {
            target: "ready",
            actions: (context, event) => {
              context.onSubmitSuccess(event.data);
            },
          },
        },
      },
    },
  };
};

let mapState = function (props) {
  let result = {};
  props.forEach((prop) => {
    result[prop] = (function (p) {
      return {
        get() {
          return this.$store.state[this.id][p];
        },
        set(value) {
          this.$store.commit(this.id + "/change", {
            property: p,
            value: value,
          });
        },
      };
    })(prop);
  });
  return result;
};

export default {
  mapState: mapState,
  name: "fp-widget-base",
  inject: ["fpContext", "fpParent"],
  provide() {
    return {
      fpParent: this,
    };
  },
  props: {
    eagerInit: {
      type: Boolean,
      default() {
        return false;
      },
    },
    id: {
      type: String,
      default() {
        return Id.random();
      },
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    defaultConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    extras: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  methods: {
    getId() {
      return this.id;
    },
  },

  mixins: [
    {
      created() {
        let merged = {};
        Object.assign(merged, this.defaultConfig, this.config);
        for (var key in merged) {
          this.config[key] = merged[key];
        }
      },
    },
    {
      created() {
        this.$store.registerModule(this.id, this.getStateClass(), {
          preserveState: false,
        });

        this.fpContext.widgetManager.addWidget(this.id, this);
        this.watches = {};
        let fsmDef = this.getFsmDef();
        fsmDef.id = this.id;
        fsmDef.context = this;
        this.fsm = interpret(createMachine(fsmDef));
        this.fsm.onTransition((state) => {
          this.state = state.value;
        });
        this.fsm.start();
      },

      beforeDestroy() {
        this.fpContext.widgetManager.removeWidget(this.id);

        for (let key in this.watches) {
          let watches = this.watches[key];
          watches.forEach((w) => w.watch());
        }
        delete this.watches;

        if (this.bindings && this.bindings.length > 0) {
          this.bindings.forEach((b) => b.destroy());
          this.bindings = undefined;
        }
        this.$store.unregisterModule(this.id);
        this.fsm.stop();
      },
      mounted() {
        if (this.eagerInit) {
          this.fpContext.widgetManager.traverse((widget) => {
            widget.sendEvent("initialize_state");
          }, this.id);
        }
      },
      computed: {
        ...mapState(["hidden", "model", "state"]),

        baseClass() {
          let base = "";
          if (this.hidden) {
            base += " hidden";
          }
          return base;
        },
      },
      methods: {
        getFsmDef() {
          return FSM_DEF();
        },
        getStateClass() {
          return DefaultState;
        },
        onInvalidated() {},
        onValidate() {},
        onStateUpdate(data) {},
        onResetState() {},
        onReady() {
          this.ready && this.ready();
        },
        onBind() {
          let self = this;
          self.createBindings();
          self.fsm.send("ready");
        },

        onInitializeState() {
          let self = this;
          if (typeof self.initializeState === "function") {
            self.initializeState();
          } else {
            self.fsm.send("initialize_data");
          }
        },
        onInitializeData() {
          let self = this;
          if (typeof self.initializeData === "function") {
            self.initializeData();
          } else {
            self.fsm.send("bind");
          }
        },

        createBindings() {
          let bindings = this.config.bindings;
          if (bindings && bindings.length > 0) {
            this.bindings = [];
            bindings.forEach((bindingConfig) => {
              let binding = StateBindingFactory.create(
                this.fpContext,
                this,
                bindingConfig
              );
              this.bindings.push(binding);
              binding.triggerChange();
            });
          }
        },

        triggerBindings(sourceProperty) {
          if (this.bindings && this.bindings.length > 0) {
            this.bindings.forEach((b) => b.triggerChange(sourceProperty));
          }
        },

        sendEvent(event, data) {
          this.fsm.send({
            type: event,
            data: data,
          });
        },

        /**
         * Manually trigger watches for a property.
         * This is called when a watched property is an object and
         * did not specify deep:true when calling watch() for better performance
         */
        triggerWatch(prop) {
          let watchesForProp = this.watches[prop];
          if (watchesForProp && watchesForProp.length > 0) {
            let value = this.getState()[prop];
            watchesForProp.forEach((w) => w.fn(value, value));
          }
        },

        getState() {
          return this.$store.state[this.id];
        },
        watch(prop, fn, options) {
          let watchesForProp = this.watches[prop];
          if (typeof watchesForProp === "undefined") {
            watchesForProp = [];
            this.watches[prop] = watchesForProp;
          }

          for (let i = 0; i < watchesForProp.length; i++) {
            if (watchesForProp[i].fn === fn) {
              return watchesForProp[i].watch;
            }
          }
          if (watchesForProp.indexOf(fn) === -1) {
            let orgWatch = this.$store.watch(
              (state) => {
                return state[this.id][prop];
              },
              (newVal, oldVal) => {
                if (Util.isDiff(oldVal, newVal)) {
                  fn(newVal, oldVal);
                }
              },
              options
            );
            let w = (function (widget, prop, orgWatch) {
              return function () {
                orgWatch();
                let watchesForProp = widget.watches[prop];
                if (watchesForProp && watchesForProp.length > 0) {
                  let index = watchesForProp.findIndex(
                    (w) => w.watch === orgWatch
                  );
                  if (index !== -1) {
                    watchesForProp.splice(index, 1);
                  }
                }
              };
            })(this, prop, orgWatch);

            watchesForProp.push({
              fn: fn,
              watch: w,
            });
          }
        },
      },
    },
  ],
  mounted() {},
};
</script>

<style lang="scss">
.fp-widget {
  &.hidden {
    display: none;
  }
}
</style>
