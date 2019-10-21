import * as types from './mutation-types'
const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_BRIEF] (state, brief) {
    state.brief = brief
  },
  [types.SET_DETAIL] (state, detail) {
    state.detail = detail
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  [types.SET_PLAYLIST] (state, playlist) {
    state.playlist = playlist
  },
  [types.SET_SEQUENCE_LIST] (state, sequenceList) {
    state.sequenceList = sequenceList
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  },
  [types.SET_SONGINFO] (state, songinfo) {
    state.songinfo = songinfo
  },
  [types.SET_SEARCH_HISTORY] (state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY] (state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = list
  },
  [types.SET_SINGER_SONG_LIST] (state, list) {
    state.singerSongList = list
  }
}
export default mutations
