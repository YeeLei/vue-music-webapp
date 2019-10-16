import {
  getLyric,
  getSongsUrl
} from 'api/song'
import {
  ERR_OK
} from 'api/config'
import {
  Base64
} from 'js-base64'
export default class Song {
  constructor ({
    id,
    mid,
    singer,
    name,
    album,
    albumdesc,
    duration,
    type,
    isonly,
    image,
    url
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.albumdesc = albumdesc
    this.duration = duration
    this.type = type
    this.isonly = isonly
    this.image = image
    this.url = url
  }
  getLyric () {
    // 如果存在歌词
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    albumdesc: musicData.albumdesc,
    duration: musicData.interval,
    type: musicData.songtype,
    isonly: musicData.isonly,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

// 过滤出歌手名字
function filterSinger (singer) {
  let ret = []
  // 如果musicData对象中没有singer
  if (!singer) {
    return ''
  }
  // singer:[{id: 5062,mid: "002J4UUk29y8BY",name: "薛之谦"}]
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 判断歌曲是否有效
export function isValidMusic (musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}

// 对歌曲列表做处理
export function processSongUrl (songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then(purlMap => {
    songs = songs.filter(song => {
      const purl = purlMap[song.mid]
      if (purl) {
        song.url = purl.indexOf('http') === -1 ? `http://dl.stream.qqmusic.qq.com/${purl}` : purl
        return true
      }
      return false
    })
    return songs
  })
}
