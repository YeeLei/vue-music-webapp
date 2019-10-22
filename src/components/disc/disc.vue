<template>
  <transition appear
              name="slide">
    <div class="disc"
         ref="disc">
      <div class="header"
           ref="header">
        <div class="back"
             @click="back">
          <i class="fa fa-angle-left"></i>
        </div>
        <h1 class="title"
            ref="title">{{title}}</h1>
      </div>
      <div class="detail"
           ref="detail">
        <div class="detail-logo">
          <img :src="detail.logo"
               @load="loadImage"
               width="100"
               height="100">
          <p class="play-count">
            <i class="fa fa-headphones"
               v-show="checkloaded">{{Math.floor(detail.visitnum / 10000)}}万</i>
          </p>
          <div class="detail-hover"></div>
        </div>
        <div class="detail-desc">
          <h2 class="detail-text"
              v-html="detail.dissname"></h2>
          <div class="detail-author">
            <span class="avatar">
              <img :src="detail.headurl"
                   width="25"
                   height="25">
              <i :style="iconStyle"
                 v-show="detail.ifpicurl"></i>
            </span>
            <span class="author-name"
                  v-html="detail.nick">
            </span>
          </div>
          <div class="detail-brief"
               @click="selectBrief">
            <p class="detail-brief-text"
               v-html="detail.desc">
            </p>
            <span class="detail-icon">
              <i class="iconfont icon-arrow-right"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="bg-image"
           ref="bgImage"
           :style="bgStyle">
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
                     @selectSong="selectSong"
                     @handleSeach="handleSeach">
          </song-list>
        </div>
      </scroll>
      <div class="loading-container"
           v-show="!songs.length">
        <loading></loading>
      </div>
      <disc-brief :flag="flag"
                  @back="hideBrief">
      </disc-brief>
      <song-seek :seek="seek"
                 @hide="hide"
                 @selectSong="selectSong"
                 ref="seek">
      </song-seek>
    </div>
  </transition>
</template>

<script>
import { getSongList } from 'api/recommend'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import DiscBrief from 'components/disc/disc-brief/disc-brief'
import SongSeek from 'base/song-seek/song-seek'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { ERR_OK } from 'api/config'
import { getSongInfo } from 'api/song'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import { prefixStyle } from 'common/js/dom'
import { playlistMixin } from 'common/js/mixin'

const OFFSET_TOP = 20
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')

export default {
  mixins: [playlistMixin],
  data () {
    return {
      rank: true,
      songs: [],
      detail: {},
      checkloaded: false,
      scrollY: 0,
      flag: false,
      seek: false
    }
  },
  created () {
    this.title = '歌单'
    this._getSongList()
    this.probeType = 3
    this.listenScroll = true
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.detail.logo})`
    },
    iconStyle () {
      return `background-image: url(${this.detail.ifpicurl})`
    },
    ...mapGetters(['disc', 'brief'])
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 最小滚动距离
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT + OFFSET_TOP

    this.$refs.list.$el.style.top = this.imageHeight - OFFSET_TOP + 'px'
    this.$refs.bgLayer.style.top = `-${OFFSET_TOP + 41}px`
  },
  methods: {
    back () {
      this.$router.back()
    },
    loadImage () {
      if (!this.checkloaded) {
        this.checkloaded = true
      }
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectBrief () {
      this.setBrief(this.detail)
      this.flag = true
    },
    hideBrief () {
      this.flag = false
    },
    handleSeach () {
      this.seek = true
      this.$refs.seek.trigger()
    },
    hide () {
      this.seek = false
    },
    selectSong (song, index) {
      // 保存点击的当前歌曲的信息
      this._getSongInfo(song.type, song.mid, song.id)
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '50px' : ''
      this.$refs.disc.style.bottom = bottom
      this.$refs.list.refresh()
    },
    _getSongList () {
      const id = this.disc.dissid ? this.disc.dissid : this.disc.id
      if (!id) {
        this.$router.push('/recommend')
        return
      }
      getSongList(id).then(res => {
        if (res.code === ERR_OK) {
          this.detail = res.cdlist[0]
          // console.log(this.detail)
          processSongUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            songs => {
              this.songs = songs
              this.setSingerSongList(this.songs)
              // console.log(this.songs)
            }
          )
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _getSongInfo (type, mid, id) {
      getSongInfo(type, mid, id).then(res => {
        if (res.code === ERR_OK) {
          const songinfo = res.songinfo.data
          this.setSongInfo(songinfo)
        }
      })
    },
    ...mapMutations({
      setBrief: 'SET_BRIEF',
      setSongInfo: 'SET_SONGINFO',
      setSingerSongList: 'SET_SINGER_SONG_LIST'
    }),
    ...mapActions(['selectPlay'])
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let scale = 1
      let blur = 0

      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 下拉图片放大
      const percent = Math.abs(newY / this.imageHeight)

      if (newY > 0) {
        scale = 1 + percent
      } else {
        blur = Math.min(20 * percent, 20)
      }

      // 向上滚动,固定header
      if (newY < this.minTranslateY) {
        this.$refs.title.innerHTML = `${this.detail.dissname}`
        this.$refs.header.style.backgroundImage = `url(${this.detail.logo})`
      } else {
        this.$refs.bgImage.style.filter = 'blur(17px)'
        this.$refs.title.innerHTML = `${this.title}`
        this.$refs.detail.style.filter = `blur(${blur}px)`
        this.$refs.header.style.backgroundImage = ``
      }
      // 设置下拉放大图片的比例
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading,
    DiscBrief,
    SongSeek
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.disc {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: #fff;
  .header {
    position: relative;
    width: 100%;
    z-index: 100;
    height: 40px;
    line-height: 40px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 101;
      width: 40px;
      height: 40px;
      i {
        display: block;
        text-align: center;
        line-height: 40px;
        font-size: 30px;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 101;
      width: 80%;
      text-align: center;
      line-height: 40px;
      font-size: $font-size-medium-x;
      color: #fff;
      @include no-wrap();
    }
  }
  .bg-image {
    position: relative;
    top: -40px;
    width: 100%;
    height: 70vw;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(5px);
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .detail {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 70vw;
    z-index: 1;
    padding: 25px 15px 0;
    box-sizing: border-box;
    font-size: 0;
    .detail-logo {
      position: relative;
      display: inline-block;
      vertical-align: top;
      top: 50px;
      margin-right: 5px;
      width: 120px;
      img {
        border-radius: 7px;
        overflow: hidden;
      }
      .play-count {
        position: absolute;
        bottom: 5px;
        right: 25px;
        font-size: $font-size-small;
        color: #fff;
      }
      .detail-hover {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translate(0, -50%);
        width: 80%;
        height: 80%;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        overflow: hidden;
        z-index: -1;
      }
    }
    .detail-desc {
      position: relative;
      top: 50px;
      display: inline-block;
      vertical-align: top;
      width: 60%;
      .detail-text {
        color: #fff;
        font-size: $font-size-medium;
        line-height: 14px;
        margin-bottom: 10px;
        margin-top: 10px;
      }
      .detail-author {
        line-height: 30px;
        color: #fff;
        font-size: 0;
        margin-bottom: 10px;
        @include no-wrap();
        .avatar {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          width: 25px;
          height: 25px;
          overflow: hidden;
          margin-right: 8px;
          img {
            border-radius: 50%;
          }
          i {
            position: absolute;
            bottom: 0;
            right: 1px;
            width: 10px;
            height: 10px;
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
        .author-name {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small-x;
        }
      }
      .detail-brief {
        position: relative;
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: $font-size-small;
        @include no-wrap();
        .detail-brief-text {
          width: 95%;
          @include no-wrap();
        }
        .detail-icon {
          position: absolute;
          right: 0;
          top: 0;
          width: 5%;
        }
      }
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
        filter: brightness(0.7);
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
  .loading-container {
    position: absolute;
    width: 100%;
    top: 60%;
    transform: translateY(-60%);
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
