<template>
  <div class="song-list">
    <div class="search-song"
         v-show="songs.length> 0 && seekFlag">
      <div class="search-wrapper"
           @click="handleSearch">
        <div class="search-box">
          <i class="iconfont icon-search1"></i>
          <span class="text">搜索此歌手的歌曲</span>
        </div>
        <!-- <search-box :placeholder="placeholder"></search-box> -->
      </div>
    </div>
    <div class="random-play"
         v-if="playBtn">
      <i class="iconfont icon-random-play"
         @click="play"></i>
      <span class="text">播放全部</span>
      <span class="count">({{count}})</span>
    </div>
    <ul>
      <li v-for="(song,index) in songs"
          :key="index"
          @click="selectSong(song,index)"
          class="item">
        <div class="rank"
             v-show="rank">
          <span class="icon"
                :class="{'active': index < 3}">{{index+1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">
            <span class="detail-icon iconfont icon-sq"
                  style="color:#ffcd31">
            </span>
            <span v-show="song.isonly !== 0"
                  class="detail-icon iconfont icon-dujia">
            </span>
            <span class="detail-song-name">{{getDesc(song)}}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    icon: {
      type: Object,
      default () {
        return {}
      }
    },
    rank: {
      type: Boolean,
      default: false
    },
    playBtn: {
      type: Boolean,
      default: true
    },
    seekFlag: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      placeholder: '搜索此歌手的歌曲'
    }
  },
  computed: {
    count () {
      return this.songs.length
    }
  },
  methods: {
    getDesc (song) {
      if (song.albumdesc) {
        return `${song.singer} · ${song.album} · ${song.albumdesc}`
      }
      return `${song.singer} · ${song.album}`
    },
    selectSong (song, index) {
      // 选择播放的歌曲
      this.$emit('selectSong', song, index)
    },
    play () {
      this.sequencePlay({
        list: this.songs
      })
    },
    handleSearch () {
      this.$emit('handleSeach')
    },
    ...mapActions(['sequencePlay'])
  }

}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.song-list {
  .search-song {
    position: relative;
    top: 0;
    width: 100%;
    height: 50px;
    margin-top: 10px;
    .search-wrapper {
      padding: 10px;
      margin: 0 auto;
      .search-box {
        width: 100%;
        height: 35px;
        line-height: 35px;
        background: $color-background-ddd;
        border-radius: 15px;
        text-align: center;
        .icon-search1 {
          font-size: $font-size-medium-x;
          color: rgba(255, 255, 255, 0.4);
        }
        .text {
          margin-left: 5px;
          font-size: $font-size-medium;
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
  .random-play {
    position: relative;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-left: 16px;
    i {
      font-size: $font-size-large-x;
      color: $color-theme-g;
      padding-right: 14px;
    }
    .text {
      font-size: $font-size-medium-x;
    }
    .count {
      font-size: $font-size-medium-x;
      color: $color-text-ggg;
      margin-left: 5px;
    }
  }
  ul {
    padding: 0 15px;
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .rank {
        flex: 0 0 25px;
        width: 25px;
        margin-right: 10px;
        text-align: center;
        line-height: 25px;
        .icon {
          display: inline-block;
          width: 25px;
          height: 25px;
          background-size: 25px 25px;
          &.active {
            color: $color-theme;
          }
        }
      }
      .content {
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name {
          @include no-wrap();
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          margin-top: 4px;
          .detail-song-name {
            font-size: $font-size-small-x;
            color: $color-text-gggg;
            vertical-align: top;
            margin-left: 5px;
          }
          .detail-icon {
            color: $color-theme-g;
            height: 16px;
            display: inline-block;
            vertical-align: top;
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>
