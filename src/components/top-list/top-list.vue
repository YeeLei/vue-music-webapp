<template>
  <transition appear
              name="slide">
    <div class="top-list-wrapper">
      <music-list :songs="songs"
                  :title="title"
                  :bg-image="bgImage"
                  :rank="rank"
                  :play-btn="false"
                  :date-time="dateTime"
                  @detailList="detailList">
      </music-list>
      <detail :flag="flag"
              @back="back">
      </detail>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import Detail from './detail/detail'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapGetters, mapMutations } from 'vuex'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
export default {
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    dateTime () {
      return this.songList.update_time
    },
    ...mapGetters([
      'topList'
    ])
  },
  data () {
    return {
      songs: [],
      songList: {},
      rank: true,
      flag: false
    }
  },
  created () {
    this._getMusicList()
  },
  methods: {
    detailList () {
      this.setDetail(this.songList)
      this.flag = true
    },
    back () {
      this.flag = false
    },
    _getMusicList () {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songList = res
          processSongUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs
          })
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setDetail: 'SET_DETAIL'
    })
  },
  components: {
    MusicList,
    Detail
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
