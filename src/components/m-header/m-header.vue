<template>
  <div class="header">
    <h1 class="text">YeeLeiMusic</h1>
    <div class="mine">
      <i class="iconfont icon-list"></i>
    </div>
    <div class="search">
      <i class="iconfont icon-search"></i>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.header {
  position: relative;
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background: $color-theme;
  .text {
    font-weight: bold;
    color: $color-text-l;
    letter-spacing: 3px;
  }
  .iconfont {
    display: block;
    font-size: 20px;
    color: $color-text-l;
  }
  .mine {
    position: absolute;
    top: 0;
    left: 5px;
    width: 44px;
    height: 44px;
  }
  .search {
    position: absolute;
    right: 5px;
    top: 0;
    width: 44px;
    height: 44px;
  }
}
</style>
