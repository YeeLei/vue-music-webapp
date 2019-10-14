<template>
  <transition name="slide"
              appear>
    <music-list :songs="songs"
                :title="detail.nick"
                :bg-image="bgStyle">
    </music-list>
  </transition>
</template>

<script>
import { getSongList } from 'api/recommend'
import MusicList from 'components/music-list/music-list'
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
    MusicList
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.disc {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: $color-background;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
</style>
