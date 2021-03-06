<template>
  <div class="search">
    <div class="bg bg-blur"></div>
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange"
                  ref="searchBox">
      </search-box>
      <div class="back"
           @click="back">取消</div>
    </div>
    <!-- 热门搜索关键字 -->
    <scroll class="search-wrapper"
            :data="shortcut"
            v-show="!query"
            :refreshDelay="refreshDelay"
            ref="searchWrapper">
      <div>
        <div class="shortcut-wrapper">
          <!-- 搜索历史 -->
          <div class="search-history"
               v-show="searchHistory.length">
            <h1 class="search-title">
              <span class="text">搜索历史</span>
              <span class="clear"
                    @click="showConfirm">
                <i class="iconfont icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                         @select="addQuery"
                         @delete="deleteOne">
            </search-list>
          </div>
          <div class="shortcut">
            <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li v-for="(item,index) in hotKey"
                    :key="index"
                    @click="addQuery(item.k)">
                  <span class="num"
                        :class="{'active': index<3 ? true: false}">{{index+1}}</span>
                  <span class="key">
                    {{item.k}}
                    <i class="iconfont icon-hot"
                       v-show="index<3"></i>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </scroll>
    <!-- 搜索结果 -->
    <div class="search-result"
         v-show="query">
      <suggest :query="query"
               @listScroll="blurInput"
               @select="saveSearch"
               ref="suggest">
      </suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="deleteAll">
    </confirm>
    <!-- 提示框 -->
    <top-tip ref="topTip">
      <div class="tip-icon">
        <i class="iconfont icon-add-list"></i>
      </div>
      <div class="tip-title">
        <span class="text">1首歌曲已添加到播放队列</span>
      </div>
    </top-tip>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import TopTip from 'base/top-tip/top-tip'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotKey: []
    }
  },
  created () {
    this._getHotKey()
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    deleteOne (item) {
      // 删除选中的一条搜索历史数据
      this.deleteSearchHistory(item)
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    deleteAll () {
      // 删除所有的搜索历史数据
      this.clearSearchHistory()
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '40px' : ''
      this.$refs.searchWrapper.$el.style.bottom = bottom
      this.$refs.searchWrapper.refresh()
    },
    _getHotKey () {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.hotkey)
          this.hotKey = res.data.hotkey.slice(0, 20)
        }
      })
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.searchWrapper.refresh()
        }, this.refreshDelay)
      }
    }
  },
  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm,
    TopTip
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.search {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  .bg {
    width: 100%;
    height: 100%;
    background: url('../../common/image/bg.jpg') no-repeat;
    &.bg-blur {
      float: left;
      filter: brightness(0.7);
      background-size: cover;
    }
  }
  .search-box-wrapper {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 100%;
    height: 35px;
    line-height: 35px;
    .back {
      position: absolute;
      right: 20px;
      top: 0;
      line-height: 35px;
      width: 40px;
      color: $color-text;
      font-weight: 400;
      font-size: $font-size-medium;
    }
  }
  .search-wrapper {
    position: absolute;
    top: 45px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .shortcut-wrapper {
      position: relative;
      top: 0px;
      left: 10px;
      .search-history {
        padding: 20px 0 10px;
        .search-title {
          display: flex;
          align-items: center;
          color: $color-text;
          font-size: $font-size-medium-x;
          font-weight: 400;
          margin-left: 10px;
          margin-bottom: 10px;
          .text {
            flex: 1;
          }
          .clear {
            position: relative;
            right: 30px;
            color: $color-text-ggg;
            @include extend-click();
          }
        }
      }
      .shortcut {
        padding: 20px 0;
        .hot-key {
          .title {
            font-size: $font-size-medium-x;
            font-weight: 400;
            margin-left: 10px;
          }
          ul {
            margin-top: 10px;
            li {
              display: flex;
              align-items: center;
              width: 100%;
              height: 50px;
              line-height: 50px;
              .num {
                flex: 0 0 35px;
                text-align: center;
                line-height: 35px;
                font-size: $font-size-medium-x;
                color: $color-text-ggg;
                &.active {
                  color: #c00;
                }
              }
              .key {
                flex: 1;
                font-size: $font-size-medium;
                .icon-hot {
                  color: #ff1301;
                }
              }
            }
          }
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 45px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .top-tip {
    text-align: center;
    .tip-icon {
      margin: 10px 0;
      height: 40px;
      line-height: 40px;
      .icon-add-list {
        font-size: 30px;
        color: $color-text-llll;
      }
    }
    .text {
      font-size: 15px;
      color: $color-text-llll;
    }
  }
}
</style>
