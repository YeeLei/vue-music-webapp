<template>
  <div class="search-list"
       v-show="searches.length">
    <transition-group name="list"
                      tag="ul">
      <li v-for="(item,index) in searches"
          :key="item"
          @click="selectItem(item)"
          class="search-item">
        <span class="num">{{index+1}}、</span>
        <span class="text">{{item}}</span>
        <span class="icon"
              @click.stop="deleteOne(item)">
          <i class="iconfont icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    deleteOne (item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.search-list {
  padding: 0 10px;
  overflow: hidden;
  .search-item {
    display: flex;
    align-items: center;
    height: 40px;
    color: #000;
    .num {
      font-size: $font-size-medium-x;
    }
    .text {
      flex: 1;
      font-size: $font-size-medium;
    }
    .icon {
      position: relative;
      right: 17px;
      @include extend-click();
      .icon-delete {
        font-size: $font-size-large-x;
        color: gray;
      }
    }
    &.list-enter-active,
    &.list-leave-active {
      transition: all 0.1s;
    }
    &.list-enter,
    &.list-leave-to {
      height: 0;
    }
  }
}
</style>
