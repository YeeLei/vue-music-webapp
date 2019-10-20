import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
// playlistMixin 用于处理当有playlist 的时候,打开mini播放器,需要重新对组件计算高度以自适应
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
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

// playerMixin 用于共享playMode

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop
          ? 'icon-loop'
          : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playing',
      'playlist',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 展示提示框显示当前播放状态
      // this.$refs.topTip.show()
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      // 如果当前是收藏的歌曲,则取消收藏
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      // refreshDelay 用于延迟scrll refresh()的时长,确保组件全部渲染完毕之后进行重新计算高度
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    blurInput () {
      this.$refs.searchBox.blur()
    },
    // 保存搜索历史
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    onQueryChange (query) {
      // 处理带空格的情况
      this.query = query.trim()
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}
