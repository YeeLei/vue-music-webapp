<template>
  <transition name="slide"
              appear>
    <div class="disc">
      <div class="header">
        <div class="back"
             @click="back">
          <i class="fa fa-angle-left"></i>
        </div>
        <h1 class="title"
            ref="title">{{title}}</h1>
      </div>
      <div class="bg-image"
           ref="bgImage"
           :style="bgStyle">
        <div class="filter"
             ref="filter">
        </div>
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
            <span class="author-name">音乐情话馆</span>
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
      <div class="bg-layer"
           ref="bgLayer">
      </div>
      <scroll :data="songs"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll"
              class="list"
              ref="list">
        <div class="song-list-wrapper">
          <song-list :songs="songs"
                     :rank="rank">
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
    </div>
  </transition>
</template>

<script>
import { getSongList } from 'api/recommend'
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import DiscBrief from 'components/disc/disc-brief/disc-brief'
import { mapGetters, mapMutations } from 'vuex'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import { prefixStyle } from 'common/js/dom'

const OFFSET_TOP = 20
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default {
  data () {
    return {
      rank: true,
      songs: [],
      detail: {},
      checkloaded: false,
      scrollY: 0,
      flag: false
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
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.detail = res.cdlist[0]
          // console.log(this.detail)
          processSongUrl(this._normalizeSongs(res.cdlist[0].songlist)).then(
            songs => {
              this.songs = songs
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
    ...mapMutations({
      setBrief: 'SET_BRIEF'
    })
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0

      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 下拉图片放大
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 100
      } else {
        blur = Math.min(20 * percent, 20)
      }
      // backdrop 针对ios设置模糊渐变效果
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      // 向上滚动,固定header
      if (newY < this.minTranslateY) {
        zIndex = 100
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImage.style.filter = 'none'
        this.$refs.title.innerHTML = `${this.detail.dissname}`
      } else {
        zIndex = 0
        this.$refs.bgImage.style.height = '70vw'
        this.$refs.bgImage.style.filter = 'blur(17px)'
        this.$refs.title.innerHTML = `${this.title}`
        this.$refs.detail.style.filter = `blur(${blur}px)`
      }
      this.$refs.bgImage.style.zIndex = zIndex
      // 设置下拉放大图片的比例
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading,
    DiscBrief
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
  background: $color-background;
  .header {
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
        color: #fff;
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
    filter: blur(17px);
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.2;
    }
  }
  .detail {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 70vw;
    z-index: 10;
    padding: 25px 15px 0;
    box-sizing: border-box;
    font-size: 0;
    .detail-logo {
      position: relative;
      display: inline-block;
      vertical-align: top;
      top: 50px;
      margin-right: 5px;
      width: 35%;
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
        right: 14px;
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
      }
      .detail-author {
        line-height: 30px;
        color: #fff;
        font-size: 0;
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
        color: #fff;
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
    background: $color-background;
    border-radius: 10px;
  }
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 50;
    .song-list-wrapper {
      position: relative;
      border-radius: 10px;
      background: #f2f3f4;
      overflow: hidden;
    }
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
