<template>
  <div class="player"
       v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <!-- 全屏播放器 -->
      <div class="normal-player"
           v-show="fullScreen"
           ref="normalPlayer">
        <!-- 播放器背景 -->
        <div class="background">
          <img :src="currentSong.image"
               width="100%"
               height="100%">
        </div>
        <!-- top -->
        <div class="top"
             @touchstart="normalTouchStart"
             @touchmove="normalTouchMove"
             @touchend="normalTouchEnd">
          <div class="back"
               @click.stop="back">
            <i class="iconfont icon-arrow-down"></i>
          </div>
          <h1 class="title"
              v-html="currentSong.name"></h1>
          <h2 class="subtitle">
            <span class="subtitle-m"
                  @click="selectSinger"
                  v-html="currentSong.singer">
            </span>
          </h2>
        </div>
        <!-- middle -->
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l"
               ref="middleL"
               @touchstart="normalTouchStart"
               @touchmove="normalTouchMove"
               @touchend="normalTouchEnd">
            <div class="cd-wrapper"
                 ref="cdWrapper">
              <div class="cd"
                   :class="cdCls">
                <img :src="currentSong.image">
              </div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="middle-r"
                  ref="lyricList"
                  :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index">{{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
          <!-- 歌词 -->
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric"
                 v-show="currentShow === 'cd'">{{playingLyric}}</div>
          </div>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"
                  :class="{'active': currentShow === 'cd'}">
            </span>
            <span class="dot"
                  :class="{'active': currentShow === 'lyric'}">
            </span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @percentChange="onProgressBarChange"
                            @percentChanging="onProgressBarChanging"
                            ref="progressBar">
              </progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-m"
                 @click.stop="changeMode">
              <i class="iconfont"
                 :class="iconMode">
              </i>
            </div>
            <div class="icon i-left"
                 :class="disableCls">
              <i class="iconfont icon-prev"
                 @click.stop="prev"></i>
            </div>
            <div class="icon i-center"
                 :class="disableCls">
              <i :class="playIcon"
                 @click.stop="togglePlaying"
                 class="iconfont">
              </i>
            </div>
            <div class="icon i-right"
                 :class="disableCls">
              <i class="iconfont icon-next"
                 @click.stop="next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont"
                 :class="getFavoriteIcon(currentSong)"
                 @click.stop="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <transition name="mini">
      <!-- mini播放器 -->
      <div class="mini-player"
           v-show="!fullScreen"
           @click="open">
        <div class="icon">
          <div class="imgWrapper"
               ref="miniWrapper">
            <img width="45"
                 height="45"
                 :src="currentSong.image"
                 :class="cdCls">
          </div>
        </div>
        <div class="text">
          <h2 class="name">{{songName}}</h2>
          <!-- <p class="desc">{{playingLyric}}</p> -->
        </div>
        <div class="control">
          <progress-circle :radius="radius"
                           :percent="percent">
            <i @click.stop="togglePlaying"
               class="iconfont"
               :class="miniIcon">
            </i>
          </progress-circle>
        </div>
        <div class="control"
             @click.stop="showPlayList">
          <i class="iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <play-singer-list ref="singerlist"
                      :singerList="this.currentSong.singermid"
                      @selectSinger="selectSingerDetail">
    </play-singer-list>
    <!-- 提示框 -->
    <top-tip ref="topTip">
      <div class="tip-icon">
        <i class="iconfont icon-add-list"></i>
      </div>
      <div class="tip-title">
        <span class="text">{{modeText}}</span>
      </div>
    </top-tip>
    <!-- confirm -->
    <confirm ref="confirm"
             @confirm="handleConfirm"
             text="确定从我喜欢中删除这首歌?"
             :confirmBtnText="confirmBtnText"></confirm>
    <audio :src="currentSong.url"
           @playing="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
           @pause="paused"
           ref="audio">
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { playMode } from 'common/js/config'
import ProgressBar from './progress-bar/progress-bar'
import ProgressCircle from './progress-circle/progress-circle'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import PlayList from 'components/playlist/playlist'
import TopTip from 'base/top-tip/top-tip'
import Confirm from 'base/confirm/confirm'
import PlaySingerList from 'components/play-singer-list/play-singer-list'
import { prefixStyle } from 'common/js/dom'
import { playerMixin } from 'common/js/mixin'
import Singer from 'common/js/singer'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  mixins: [playerMixin],
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 28,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      confirmBtnText: '确定删除'
    }
  },
  created () {
    this.normalTouch = {}
    this.touch = {}
  },
  computed: {
    playIcon () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon () {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    songName () {
      return `${this.currentSong.name} - ${this.currentSong.singer}`
    },
    ...mapGetters([
      'fullScreen',
      'currentIndex',
      'playing',
      'singer'
    ])
  },
  methods: {
    back () {
      this.setFullScreen(false)
    },
    open () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      let animation = {
        0: {
          transform: `translate3d(0,100%,0)`
        },
        25: {
          transform: `translate3d(0,75%,0)`
        },
        50: {
          transform: `translate3d(0,50%,0)`
        },
        75: {
          transform: `translate3d(0,25%,0)`
        },
        100: {
          transform: `translate3d(0,0,0)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 300,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.normalPlayer, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.normalPlayer.style.animation = ''
    },
    leave (el, done) {
      this.$refs.normalPlayer.style.transition = 'all 0.4s'
      // eslint-disable-next-line standard/computed-property-even-spacing
      this.$refs.normalPlayer.style[
        transform
      ] = `translate3d(0px,100%,0)`
      this.$refs.normalPlayer.addEventListener('transitionend', () => {
        done()
      })
    },
    afterLeave () {
      this.$refs.normalPlayer.style.transition = ''
      this.$refs.normalPlayer.style[transform] = ''
    },
    normalTouchStart (e) {
      this.normalTouch.initiated = true
      // 用来判断是否是一次移动
      this.normalTouch.moved = false
      const normalTouch = e.touches[0]
      this.normalTouch.startX = normalTouch.pageX
      this.normalTouch.startY = normalTouch.pageY
    },
    normalTouchMove (e) {
      if (!this.normalTouch.initiated) {
        return
      }
      e.preventDefault()
      const touch = e.changedTouches[0]
      const deltaY = touch.pageY - this.normalTouch.startY

      if (!this.normalTouch.moved) {
        this.normalTouch.moved = true
      }
      const top = this.fullScreen ? 0 : window.innerHeight
      const offsetHeight = Math.max(0, Math.min(window.innerHeight, top + deltaY))

      if (!this.normalTouch.moved && offsetHeight < 50) {
        return
      }
      this.normalTouch.percent = Math.abs(offsetHeight / window.innerHeight)
      this.$refs.normalPlayer.style[transform] = `translate3d(0,${offsetHeight}px,0)`
      this.$refs.normalPlayer.style[transitionDuration] = 0
    },
    normalTouchEnd () {
      if (!this.normalTouch.moved) {
        return
      }
      let offsetHeight
      if (this.normalTouch.percent > 0.3) {
        offsetHeight = window.innerWidth
        this.setFullScreen(false)
      } else {
        offsetHeight = 0
      }
      const time = 300
      this.$refs.normalPlayer.style[transform] = `translate3d(0,${offsetHeight}px,0)`
      this.$refs.normalPlayer.style[transitionDuration] = `${time}ms`
      this.normalTouch.initiated = false
      this.normalTouch.percent = 0
    },
    togglePlaying () {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    ready () {
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
      // 保存当前播放歌曲到播放历史中
      this.savePlayHistory(this.currentSong)
    },
    next () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        // 如果歌曲列表长度为1,则循环播放
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      if (this.playlist.length === 1) {
        // 如果歌曲列表长度为1,则循环播放
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.setPlayingState(true)
      if (this.currentLyric) {
        // 如果已加载歌词,则歌词返回到顶部
        this.currentLyric.seek(0)
      }
    },
    error () {
      this.songReady = true
    },
    end () {
      // 如果为循环播放
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    paused () {
      this.setPlayingState(false)
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      interval = interval | 0
      const minute = (interval / 60) | 0
      const second = this.pad(interval % 60)
      return `${minute}:${second}`
    },
    pad (num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    onProgressBarChange (percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlaying()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentSong.duration * percent * 1000)
      }
    },
    onProgressBarChanging (percent) {
      this.currentTime = this.currentSong.duration * percent
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    getLyric () {
      this.currentSong
        .getLyric()
        .then(lyric => {
          // 如果这首歌的歌词不等于获取到的歌词
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    handleLyric ({ lineNum, txt }) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      e.preventDefault()
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.changedTouches[0]
      e.preventDefault()
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd () {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    showPlayList () {
      this.$refs.playlist.show()
    },
    handleConfirm () {
      this.deleteFavoriteList(this.currentSong)
    },
    selectSinger () {
      if (this.currentSong.singermid.length === 1) {
        // 如果只有一个歌手,说明返回到歌手列表
        this.setFullScreen(false)
        let singer = new Singer({
          id: this.currentSong.singermid[0].mid,
          name: this.currentSong.singermid[0].name
        })
        this.setSinger(singer)
        if (this.singer.id === this.$route.params.id) { // 如果当前歌手id等于之前获取到的歌手的id
          this.setFullScreen(false)
          this.$refs.singerlist.hide()
        } else {
          this.$router.push({
            path: `/singer/${this.singer.id}`
          })
        }
      } else {
        // 如果有多个歌手,则弹出歌手列表浮层
        this.$refs.singerlist.show()
      }
    },
    selectSingerDetail (singer) {
      if (!singer.id) { // 如果不是当前id，则返回到singer页面
        this.$router.push({
          path: '/singer'
        })
        return
      }
      if (singer.id === this.$route.params.id) { // 如果当前歌手id等于之前获取到的歌手的id
        this.setFullScreen(false)
        this.$refs.singerlist.hide()
        return
      }
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
      this.setFullScreen(false)
      this.$refs.singerlist.hide()
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['savePlayHistory'])
  },
  watch: {
    // 所以需要判断newSong和oldSong 的歌曲id是否一致 或者 newSong为undefined
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id || !newSong.id || !newSong.url) {
        return
      }
      // 如果歌词已经加载
      if (this.currentLyric) {
        this.currentLyric.stop()
        // 重置为null
        this.currentLyric = null
        this.currentTime = 0
        this.playingLyric = ''
        this.currentLineNum = 0
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.audio.play()
      }, 1000)
      // 获取歌词
      this.getLyric()
    },
    playing (newPlaying) {
      // console.log(newPlaying)
      // 监听playing状态,控制audio播放状态
      if (!this.songReady) {
        return
      }
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList,
    TopTip,
    Confirm,
    PlaySingerList
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #333;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: -5px;
        left: 6px;
        z-index: 50;
        i {
          display: block;
          padding: 9px;
          font-size: 35px;
          color: $color-text-lll;
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        font-size: $font-size-large;
        color: #fff;
        @include no-wrap();
      }
      .subtitle {
        position: relative;
        width: 95%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        font-size: $font-size-small-x;
        color: #fff;
        @include no-wrap();
        .subtitle-m {
          width: 90%;
          display: inline-block;
          vertical-align: middle;
          padding: 0 7px;
          box-sizing: border-box;
          @include no-wrap();
          &:before,
          &:after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 15px;
            height: 1px;
            margin: 0 5px;
            background: $color-text-lll;
          }
        }
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 25%;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          box-sizing: border-box;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-lll;
            font-size: $font-size-medium;
            &.current {
              color: #fff;
            }
          }
        }
      }
      .playing-lyric-wrapper {
        position: relative;
        bottom: 10%;
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text-lll;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 30px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: #fff;
          &.disable {
            color: rgba(255, 255, 255, 0.4);
          }
          i {
            font-size: 27px;
          }
        }
        .i-m {
          text-align: right;
        }
        .i-left {
          text-align: right;
          margin-top: -3px;
          i {
            font-size: 35px;
          }
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 50px;
          }
        }
        .i-right {
          text-align: left;
          i {
            font-size: 35px;
          }
          .icon-favorite,
          .icon-not-favorite {
            font-size: 25px;
          }
          .icon-favorite {
            color: $color-theme;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text-lll;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-lll;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: #fff;
          }
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.5s;
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 40px;
    background: rgba(42, 40, 40, 0.9);
    .icon {
      width: 50px;
      height: 50px;
      text-align: center;
      margin-right: 10px;
      .imgWrapper {
        height: 100%;
        width: 100%;
        img {
          border-radius: 50%;
          &.play {
            animation: rotate 10s linear infinite;
          }
          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        margin-top: 4px;
        font-size: $font-size-medium;
        color: $color-text;
        @include no-wrap;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      margin: 0 5px;
      .icon-play-mini,
      .icon-pause-mini {
        font-size: 15px;
        color: $color-theme;
      }
      .icon-pause-mini {
        position: absolute;
        left: 7px;
        top: 7px;
      }
      .icon-play-mini {
        position: absolute;
        left: 8px;
        top: 7px;
      }
      .icon-playlist {
        display: block;
        margin-top: 5px;
        font-size: 20px;
        color: $color-theme;
      }
    }
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
  }
  .top-tip {
    height: 120px;
    text-align: center;
    .top-tip-wrapper {
      background: rgba(30, 28, 28, 0.7);
      .tip-title {
        width: 120px;
        margin: 0 auto;
      }
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
        line-height: 25px;
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
