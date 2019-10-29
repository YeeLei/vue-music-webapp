<template>
  <div id="app">
    <div class="app-bg bg-blur"></div>
    <m-header></m-header>
    <m-tab></m-tab>
    <transition :name="transitionName">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>
<script>
import MHeader from 'components/m-header/m-header'
import MTab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  data () {
    return {
      transitionName: ''
    }
  },
  watch: {
    // 使用watch 监听$router的变化
    $route (to, from) {
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
    }
  },
  components: {
    MHeader,
    MTab,
    Player
  }
}
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;
  .app-bg {
    width: 100%;
    height: 100%;
    background: url('../src/common/image/bg.jpg') no-repeat;
    &.bg-blur {
      float: left;
      filter: brightness(0.8);
      background-size: cover;
    }
  }
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
