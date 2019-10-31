<template>
  <transition appear
              name="slide">
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
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      songs: []
    }
  },
  created () {
    this._getSingerDetail()
  },
  updated () {
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
            this.setSingerSongList(this.songs)
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
    },
    ...mapMutations({
      setSingerSongList: 'SET_SINGER_SONG_LIST'
    })
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
