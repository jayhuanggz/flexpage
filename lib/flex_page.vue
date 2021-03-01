<template>
  <div class="fp">
    <fp-widget v-for="(item, index) in items" :key="index" v-bind="item" />
  </div>
</template>

<script>
import WidgetManager from "./components/widget_manager";
import Id from "./utils/id";
import UrlParamProvider from "./variable/url_param_provider";
import Util from "./utils/util";
import DataSource from "./datasource/datasource";

const State = {
  namespaced: true,
  state() {
    return {
      model: {},
      variables: {},
    };
  },
  mutations: {
    updateModel: (state, data) => {
      state.model = data;
    },
    updateVariables: (state, data) => {
      state.variables = data;
    },
  },
};
export default {
  name: "flexpage",
  provide() {
    return {
      fpContext: this.context,
      fpParent: undefined,
    };
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      },
    },
    datasource: { type: Object },
    value: {
      type: Object,
    },

    variableProviders: {
      type: Array,
      default() {
        return [new UrlParamProvider()];
      },
    },

    context: {
      type: Object,
      default() {
        return new Context(Id.random(), this);
      },
    },
  },
  computed: {
    model: {
      get() {
        return this.$store.state[this.context.id].model;
      },
      set(value) {
        this.$store.commit(this.context.id + "/updateModel", value);
      },
    },
    variables: {
      get() {
        return this.$store.state[this.context.id].variables;
      },
      set(value) {
        this.$store.commit(this.context.id + "/updateVariables", value);
      },
    },
  },
  created() {
    this.$store.registerModule(this.context.id, State, {
      preserveState: false,
    });
    if (typeof this.value !== "undefined") {
      this.model = this.value;
    }
    this.context.bindVariables();
    this.loadDataFromDatasource();
  },
  mounted() {
    this.context.widgetManager.traverse((widget) => {
      widget.sendEvent("initialize_state");
    });
  },
  beforeDestroy() {
    this.context.destroy();
    this.$store.unregisterModule(this.context.id);
  },

  methods: {
    loadDataFromDatasource() {
      if (
        this.datasource &&
        this.datasource.type &&
        this.datasource.type.length > 0
      ) {
        DataSource.loadData(
          this.datasource,
          undefined,
          undefined,
          undefined,
          this.context
        ).then((data) => {
          this.model = data;
        });
      }
    },
  },
};

class Context   {
  constructor(id, page) {
    this.page = page;
    this.id = id;
    this.widgetManager = new WidgetManager();
    this.watches = [];
  }

  bindVariables() {
    let providers = this.page.variableProviders;
    let allVariables = {};
    this.page.variables = allVariables;

    if (providers && providers.length > 0) {
      providers.forEach((provider) => {
        let variables = provider.supply();
        if (typeof variables !== "undefined") {
          if (Util.isPromise(variables)) {
            variables.then((data) => {
              Object.assign(allVariables, data);
            });
          } else {
            Object.assign(allVariables, variables);
          }
        }
      });
    }
  }

  getId() {
    return this.id;
  }
  getState() {
    return this.page.$store.state[this.id];
  }

  watch(prop, fn) {
    this.watches.push(
      this.page.$store.watch(
        (state) => {
          return state[this.id][prop];
        },
        (newVal, oldVal) => {
          if (Util.isDiff(newVal, oldVal)) {
            fn(newVal, oldVal);
          }
        }
      )
    );
  }

  destroy() {
    this.watches.forEach((w) => w());
    this.watches = undefined;
    this.page = undefined;
  }
}
</script>

<style lang="scss" >
@import "./flex_page.scss";
</style>