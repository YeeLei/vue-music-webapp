<template>
  <div class="song-list">
    <div class="random-play">
      <i class="iconfont icon-random-play"></i>
      <span class="text">播放全部</span>
      <span class="count">(共{{count}}首)</span>
    </div>
    <ul>
      <li v-for="(song,index) in songs"
          :key="index"
          class="item">
        <div class="rank"
             v-show="rank">
          <span class="icon icon0">{{index+1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">
            <span class="detail-icon iconfont icon-sq"
                  style="color:#ffcd31">
            </span>
            <span v-show="song.isonly !== 0"
                  class="detail-icon iconfont icon-dujia"
                  style="color:#31c27c;margin-top: 1px;">
            </span>
            <span class="detail-song-name">{{getDesc(song)}}</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
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
    }
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
    border-bottom: 1px solid $color-text-lm;
    i {
      font-size: $font-size-large-x;
      color: $color-theme;
      padding-right: 14px;
    }
    .text {
      font-size: $font-size-medium-x;
    }
    .count {
      font-size: $font-size-medium;
      color: $color-text-g;
    }
  }
  ul {
    margin-top: 41px;
    padding: 0 15px;
    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      border-bottom: 1px solid $color-text-lm;
      &:last-child {
        border: 0;
      }
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
            color: $color-text-g;
            vertical-align: top;
            margin-left: 5px;
          }
          .desc-icon {
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
