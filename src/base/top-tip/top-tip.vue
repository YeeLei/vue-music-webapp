<template>
  <transition name="drop">
    <div class="top-tip"
         v-show="showFlag"
         @click.stop="hide">
      <div class="top-tip-wrapper">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay)
    },
    hide () {
      this.showFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
.top-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48%;
  height: 100px;
  z-index: 500;
  .top-tip-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    background: rgba(51, 51, 51, 0.7);
  }
}
.drop-enter-active {
  animation: tip-fadein 0.3s;
  .top-tip-wrapper {
    animation: tip-zoom 0.3s;
  }
}
@keyframes tip-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes tip-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
