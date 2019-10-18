<template>
  <div class="no-result">
    <!-- <div class="no-result-icon iconfont icon-no-result"></div> -->
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.no-result {
  text-align: center;
  .no-result-icon {
    width: 86px;
    height: 90px;
    margin: 0 auto;
  }
  .no-result-text {
    margin-top: 30px;
    font-size: $font-size-medium;
    color: #31c27c;
    line-height: 30px;
  }
}
</style>
