<template>
  <div class="song-list">
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
    ...mapActions(['sequencePlay'])
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.song-list {
  .random-play {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    padding-left: 16px;
    @include border-bottom-1px($color-text-lm);
    i {
      font-size: $font-size-large-x;
      color: $color-theme;
      padding-right: 14px;
    }
    .text {
      font-size: $font-size-medium-x;
    }
    .count {
      font-size: $font-size-medium-x;
      color: $color-text-g;
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
            color: $color-theme;
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
