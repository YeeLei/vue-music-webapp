import { playMode } from 'common/js/config'

import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 是否开启全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式,默认顺序播放
  currentIndex: -1, // 播放列表当前播放歌曲的索引
  disc: {}, // 推荐歌单
  brief: {}, // 推荐歌单详情简介
  topList: {}, // 排行榜歌单
  detail: {}, // 排行榜歌单详情简介
  songinfo: {}, // 歌曲详情信息
  favoriteList: loadFavorite(), // 我喜欢的
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay(), // 播放历史
  singerSongList: [] // 歌手列表所有歌曲
}

export default state
