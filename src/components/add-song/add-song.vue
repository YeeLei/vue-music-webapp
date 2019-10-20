<template>
  <transition name="slide">
    <div class="add-song"
         v-show="showFlag"
         @click.stop>
      <div class="bg-image">

      </div>
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close"
             @click="hide">
          关闭
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <search-box @query="onQueryChange"
                    placeholder="请输入搜索歌曲"
                    ref="searchBox">
        </search-box>
      </div>
      <!-- tab -->
      <div class="shortcut"
           v-show="!query">
        <switches :switches="switches"
                  :currentIndex="currentIndex"
                  @switch="switchItem">
        </switches>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <scroll v-if="currentIndex === 0"
                  :data="playHistory"
                  class="list-scroll"
                  ref="songList"
                  :refreshDelay="refreshDelay">
            <div class="list-inner">
              <song-list :songs="playHistory"
                         @selectSong="selectSong"
                         :playBtn="false">
              </song-list>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll v-if="currentIndex === 1"
                  :data="searchHistory"
                  class="list-scroll"
                  ref="searchList">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory"
                           @select="addQuery"
                           :searches="searchHistory">
              </search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!-- 搜索列表 -->
      <div class="search-result"
           v-show="query">
        <suggest :query="query"
                 :showSinger="showSinger"
                 @select="selectSuggest"
                 @listScroll="blurInput">
        </suggest>
      </div>
      <!-- 顶部提示框 -->
      <top-tip ref="topTip">
        <div class="tip-icon">
          <i class="iconfont icon-add-list"></i>
        </div>
        <div class="tip-title">
          <span class="text">1首歌曲已添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import { searchMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import Song from 'common/js/song'
export default {
  mixins: [searchMixin],
  data () {
    return {
      showFlag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [{
        name: '最近播放'
      }, {
        name: '搜索历史'
      }]
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        // 当scroll组件渲染完毕后,由于songList和searchList组件还是处于hidden状态,
        // 当改变showFlag为true时,造成scroll高度计算不对,所以需要refresh
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    selectSuggest () {
      // 保存搜索历史
      this.saveSearch()
      // 展示提示框
      this.showTip()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song, index) {
      if (index !== 0) {
        // 因为song是从playHistory取得的,需要进行对song实例化
        this.insertSong(new Song(song))
        this.showTip()
      }
    },
    showTip () {
      this.$refs.topTip.show()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  .bg-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url('../../common/image/bg.jpg') no-repeat;
    background-size: cover;
    filter: brightness(0.8);
  }
  &.slide-enter-active,
  &.slide-leave-active {
    transition: all 0.5s;
  }
  &.slide-enter,
  &.slide-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    background: $color-background-ddd;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text-llll;
      font-weight: 400;
    }
    .close {
      position: absolute;
      top: 12px;
      right: 15px;
      font-size: $font-size-medium-x;
      color: $color-text-llll;
    }
  }
  .search-box-wrapper {
    margin: 20px;
    .search-box {
      width: 100%;
    }
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 119px;
    bottom: 0;
    width: 100%;
    .suggest {
      position: absolute;
      top: 0;
    }
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
