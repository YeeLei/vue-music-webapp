import {
  commonParams
} from './config'
import {
  getUid
} from 'common/js/uid'
import axios from 'axios'
import {
  ERR_OK
} from 'api/config'

const debug = process.env.NODE_ENV !== 'production'

// 获取歌曲相关简介
export function getSongInfo (type, mid, id) {
  const url = debug ? '/api/getSongInfo' : 'http://www.yeelei.top/music/api/getSongInfo'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    hostUin: 0,
    needNewCode: 0,
    data: {
      'comm': {
        'ct': 24,
        'cv': 0
      },
      'songinfo': {
        'method': 'get_song_detail_yqq',
        'param': {
          'song_type': type,
          'song_mid': mid,
          'song_id': id
        },
        'module': 'music.pf_song_detail_svr'
      }
    }
  })
  return axios.get(url, {
    data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取歌词
export function getLyric (mid) {
  const url = debug ? '/api/lyric' : 'http://www.yeelei.top/music/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 这个方法可以批量拿到这个歌曲列表的 midUrlInfo
export function getSongsUrl (songs) {
  const url = debug ? '/api/getPurlUrl' : 'http://www.yeelei.top/music/api/getPurlUrl'

  let mids = []
  let types = []

  songs.forEach((song) => {
    mids.push(song.mid)
    types.push(0)
  })

  const urlMid = getUrlMid(mids, types)

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  })

  return new Promise((resolve, reject) => {
    // 默认请求次数为3
    let tryTime = 3

    function request () {
      return axios.post(url, {
        comm: data,
        req_0: urlMid
      }).then((response) => {
        const res = response.data
        if (res.code === ERR_OK) {
          let urlMid = res.req_0
          if (urlMid && urlMid.code === ERR_OK) {
            const purlMap = {}
            urlMid.data.midurlinfo.forEach((item) => {
              if (item.purl) {
                purlMap[item.songmid] = item.purl
              }
            })
            if (Object.keys(purlMap).length > 0) {
              resolve(purlMap)
            } else {
              retry()
            }
          } else {
            retry()
          }
        } else {
          retry()
        }
      })
    }

    function retry () {
      if (--tryTime >= 0) {
        request()
      } else {
        reject(new Error('Can not get the songs url'))
      }
    }

    request()
  })
}

function getUrlMid (mids, types) {
  const guid = getUid()
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}
