import {
  mapGetters
} from 'vuex'

// playlistMixin 用于处理当有playlist 的时候,打开mini播放器,需要重新对组件计算高度以自适应
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist () {
      // 如果在组件中不写handlePlaylist 这个方法,就抛出异常
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
