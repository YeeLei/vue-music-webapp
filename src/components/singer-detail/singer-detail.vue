<template>
  <transition name="slide"
              appear>
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage">
    </music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSingerDetail()
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
    ...mapGetters(['singer'])
  },
  methods: {
    _getSingerDetail () {
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list)

          //  processSongUrl 对歌曲列表做处理
          processSongUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs
            // console.log(this.songs)
          })
        }
      })
    },
    _normalizeSongs (list) {
      // _normalizeSongs 对付费歌曲做处理
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background: #000;
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
