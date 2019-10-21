<template>
  <div class="music-list"
       ref="musicList">
    <div class="header"
         ref="header">
      <div class="back"
           @click="back">
        <i class="fa fa-angle-left"></i>
      </div>
      <div class="title"
           ref="title"></div>
    </div>
    <div class="bg-image"
         :style="bgStyle"
         ref="bgImage">
      <div class="text"
           v-html="title"></div>
      <div class="play-wrapper"
           v-show="playBtn">
        <div class="play"
             v-show="songs.length > 0"
             ref="playBtn"
             @click="random">
          <i class="iconfont icon-random-play"></i>
          <span class="play-text">随机播放全部</span>
        </div>
      </div>
      <div class="date-wrapper">
        <p class="date"
           v-show="dateTime">
          {{dateTime}}更新
          <i class="iconfont icon-tishi"
             @click="detail"></i>
        </p>
      </div>
      <slot></slot>
      <div class="filter"
           ref="filter">
      </div>
    </div>
    <div class="bg-layer"
         ref="bgLayer">
      <div class="bg bg-blur"></div>
    </div>
    <scroll :data="songs"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   :rank="rank"
                   @selectSong="selectSong">
        </song-list>
      </div>
    </scroll>
    <div class="loading-container"
         v-show="!songs.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { getSongInfo } from 'api/song'
import { ERR_OK } from 'api/config'
import { mapMutations, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  mixins: [playlistMixin],
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    },
    playBtn: {
      type: Boolean,
      default: true
    },
    dateTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    // 处理背景
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 最小滚动距离
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = this.imageHeight + 'px'
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    selectSong (song, index) {
      // 保存点击的当前歌曲的信息
      this._getSongInfo(song.type, song.mid, song.id)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    detail () {
      this.$emit('detailList')
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '40px' : ''
      this.$refs.musicList.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _getSongInfo (type, mid, id) {
      getSongInfo(type, mid, id).then(res => {
        if (res.code === ERR_OK) {
          const songinfo = res.songinfo.data
          this.setSongInfo(songinfo)
        }
      })
    },
    ...mapActions(['selectPlay', 'randomPlay']),
    ...mapMutations({
      setSongInfo: 'SET_SONGINFO'
    })
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let scale = 1
      let blur = 0
      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 下拉图片放大
      const precent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + precent
      } else {
        blur = Math.min(20 * precent, 20)
      }
      // backdrop 针对ios设置模糊渐变效果
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      // 向上滚动,固定header
      if (newY < this.minTranslateY) {
        this.$refs.playBtn.style.display = 'none'
        this.$refs.title.innerHTML = this.title
        this.$refs.header.style.backgroundImage = `url(${this.bgImage})`
      } else {
        this.$refs.title.innerHTML = ''
        this.$refs.playBtn.style.display = ''
        this.$refs.header.style.backgroundImage = ``
      }
      // 设置下拉放大图片的比例
      this.$refs.bgImage.style[transform] = `translate3d(0,-${translateY}px),0`
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .header {
    position: fixed;
    width: 100%;
    height: 40px;
    line-height: 40px;
    z-index: 10;
    transform-origin: top;
    background-size: cover;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      width: 40px;
      height: 40px;
      z-index: 10;
      i {
        display: block;
        text-align: center;
        line-height: 40px;
        font-weight: bold;
        font-size: 30px;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      @include no-wrap();
    }
  }
  .bg-image {
    position: relative;
    padding-top: 70%;
    height: 0px;
    transform-origin: top;
    background-size: cover;
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0 auto;
      width: 80%;
      height: 40px;
      line-height: 40px;
      font-weight: bold;
      text-align: center;
      z-index: 1;
    }
    .play-wrapper {
      position: absolute;
      bottom: 40px;
      z-index: 50;
      width: 100%;
      .play {
        width: 135px;
        padding: 5px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        i {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-large-x;
        }
        .play-text {
          display: inline-block;
          vertical-align: middle;
          font-size: 12px;
        }
      }
    }
    .date-wrapper {
      position: absolute;
      bottom: 40px;
      z-index: 50;
      width: 100%;
      text-align: center;
      .date {
        color: $color-text;
        font-size: $font-size-small-x;
        line-height: 16px;
        height: 16px;
        i {
          color: #fff;
          font-size: $font-size-medium;
          vertical-align: middle;
        }
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    z-index: 1;
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('../../common/image/bg.jpg') no-repeat;
      &.bg-blur {
        float: left;
        filter: brightness(0.8);
        background-size: cover;
        background-position: 0 -50px;
      }
    }
  }
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 2;
    .song-list-wrapper {
      position: relative;
      overflow: hidden;
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 60%;
    transform: translateY(-60%);
    z-index: 999;
  }
}
</style>
