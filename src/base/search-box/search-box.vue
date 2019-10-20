<template>
  <div class="search-box">
    <i class="iconfont icon-search1"></i>
    <input v-model="query"
           class="box"
           :placeholder="placeholder"
           ref="query">
    <i class="iconfont icon-delete"
       v-show="query"
       @click="clear">
    </i>
    <slot></slot>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    // 监听query变化,向外暴露,对query进行防抖操作
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    },
    blur () {
      this.$refs.query.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 80%;
  padding: 0 12px;
  height: 35px;
  background: $color-background-ddd;
  border-radius: 15px;
  .icon-search1 {
    font-size: $font-size-large;
    color: rgba(255, 255, 255, 0.4);
  }
  .box {
    flex: 1;
    margin: 0 10px;
    line-height: 18px;
    color: $color-text-llll;
    font-size: $font-size-medium;
    background: transparent;
    outline: 0;
    caret-color: $color-theme;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .icon-delete {
    font-size: $font-size-large-x;
    color: $color-theme;
  }
}
</style>
