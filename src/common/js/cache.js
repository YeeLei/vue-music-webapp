// 操作localstorage存储数据
import storage from 'good-storage'

// 定义搜索历史key值及最大长度
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 定义播放历史key值及最大长度
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

// 定义收藏歌曲key值及最大长度
const FAVORITE_KEY = '__favorite__'
const FAVORITE_LENGTH = 200

function insertArray (arr, val, compare, maxLen) {
  // 通过比较方法找到当前索引
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    // 存在当前搜索内容,删除
    arr.splice(index, 1)
  }
  // 从数组的头部开始插入
  arr.unshift(val)
  // 如果数组的长度大于规定的长度限度,则从尾部开始删除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存搜索历史
export function saveSearch (query) {
  // 先获取localstorage中的SEARCH_KEY的数据
  let searches = storage.get(SEARCH_KEY, [])
  // 插入数据到searches数组中
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 将searches数组保存到SEARCH_KEY
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从localstorage中获取SEARCH_KEY搜索历史数据
export function loadSearch () {
  return storage.get(SEARCH_KEY, [])
}

// 删除选中的搜索历史数据
export function deleteSearch (query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空所有历史数据
export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

// 保存当前播放歌曲信息到localstorage
export function savePlay (song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay () {
  return storage.get(PLAY_KEY, [])
}

// 收藏歌曲
export function saveFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_LENGTH)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

// 删除收藏歌曲
export function deleteFavorite (song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite () {
  return storage.get(FAVORITE_KEY, [])
}
