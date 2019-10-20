<template>
  <div class="tab">
    <router-link to="/recommend"
                 tag="div"
                 class="tab-item">
      <span>热门推荐</span>
    </router-link>
    <router-link to="/singer"
                 tag="div"
                 class="tab-item">
      <span>歌手</span>
    </router-link>
    <router-link to="/rank"
                 tag="div"
                 class="tab-item">
      <span>排行榜</span>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.tab {
  position: fixed;
  top: 44px;
  display: flex;
  width: 100%;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  background: $color-theme;
  .tab-item {
    flex: 1;
    text-align: center;
    color: $color-text-ggg;
    span {
      padding-bottom: 3px;
    }
    &.router-link-active {
      color: $color-text;
      font-weight: bold;
      span {
        border-bottom: 2px solid $color-text;
      }
    }
  }
}
</style>
