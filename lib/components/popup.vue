<template>
  <div
    style="z-index: 2001"
    v-show="!hidden"
    v-bind:class="[baseClass,'el-dialog__wrapper']"
    @click="close"
  >
    <transition name="fade">
      <div
        role="dialog"
        aria-modal="true"
        class="el-dialog"
        v-show="!hidden"
        @click="handleBodyClick"
      >
        <section>
          <div class="el-dialog__header">
            <span class="el-dialog__title">{{ config.title }}</span>
            <button type="button" aria-label="Close" class="el-dialog__headerbtn" @click="close">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <div class="el-dialog__body">
            <fp-widget v-for="(item, index) in config.items" :key="index" v-bind="item" />
          </div>
          <div class="el-dialog__footer" v-if="config.footerButtons.length > 0">
            <span class="dialog-footer">
              <el-button
                :autoTrigger="false"
                target="parent"
                v-for="(button, index) in config.footerButtons"
                :key="index"
                v-bind="parseButtonConfig(button)"
                @click="handleFooterButtonClick(button.action)"
              >{{button.label}}</el-button>
            </span>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
import Base from "./base_widget";
import extend from "./store/extend";
import BaseState from "./store/index";
import Action from "./actions/action";
let State = extend(
  {
    state() {
      return {
        model: {}
      };
    }
  },
  BaseState
);

export default {
  name: "fp-popup",
  extends: Base,

  computed: {
    ...Base.mapState(["model"])
  },
  data() {
    return {};
  },
  props: {
    defaultConfig: {
      type: Object,
      default() {
        return {
          title: "弹窗",
          items: [],
          footerButtons: [
            {
              label: "关闭",
              action: {
                id: "close"
              }
            }
          ]
        };
      }
    }
  },
  created() {
    this.watch("hidden", hidden => {
      this.triggerBindings("hidden");
    });
    this.hidden = true;
  },
  mounted() {},
  methods: {
    handleBodyClick(e) {
      e.stopPropagation();
    },
    handleFooterButtonClick(action) {
      Action.triggerAction(action, this.fpContext, this);
    },
    parseButtonConfig(button) {
      if (button.action) {
        if (button.action.id === "close") {
          button.action.trigger = this.close.bind(this);
        } else if (button.action.id === "confirm") {
          button.action.trigger = this.confirm.bind(this);
        }
      }

      return button;
    },
    close() {
      this.hidden = true;
      this.$emit("close");
    },
    open() {
      this.hidden = false;
    },
    confirm() {
      this.$emit("confirm", this.model);
      this.close();
    },
    getStateClass() {
      return State;
    }
  }
};
</script>

<style  lang="scss">
.fp-popup {
  background: rgba(0, 0, 0, 0.6);
  margin: 0 !important;

  .el-dialog__body {
    margin: -15px -20px;
  }
  .el-dialog {
    margin: 10vh auto 30px auto;
    z-index: 2002;
    opacity: 1;
    width: 70%;
  }

  .fade-enter-active {
    transition: all 0.3s linear;
  }
  .fade-leave-active {
    transition: all 0.3s linear;
  }
  .fade-enter,
  .fade-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>