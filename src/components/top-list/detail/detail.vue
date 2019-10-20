<template>
  <transition name="fade">
    <div class="top-list-detail"
         v-if="flag">
      <div class="header">
        <div class="back"
             @click="back">
          <i class="fa fa-angle-left"></i>
        </div>
        <h1 class="title"
            v-html="detail.topinfo.ListName">
        </h1>
      </div>
      <div class="detail">
        <p class="info"
           v-html="detail.topinfo.info"></p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'detail'
    ])
  },
  methods: {
    back () {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.top-list-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background: $color-background;
  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      width: 40px;
      height: 40px;
      i {
        display: block;
        text-align: center;
        line-height: 40px;
        font-size: 30px;
        color: rgba(0, 0, 0, 0.6);
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      text-align: center;
      line-height: 40px;
      font-size: $font-size-medium-x;
      font-weight: 400px;
      color: #000;
      @include no-wrap();
    }
  }
  .detail {
    margin-top: 20px;
    padding: 0 10px;
    box-sizing: border-box;
    color: $color-text;
    line-height: 24px;
    font-size: $font-size-small-x;
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
</style>
