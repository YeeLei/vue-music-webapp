<template>
  <div class="loading">
    <img src="./loading.svg"
         width="30"
         height="30">
    <p class="desc"
       v-html="title"></p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在加载中...'
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.loading {
  width: 100%;
  text-align: center;
  .desc {
    line-height: 20px;
    font-size: $font-size-small;
    color: $color-text-g;
  }
}
</style>
