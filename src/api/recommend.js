import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from 'api/config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

// 轮播图
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 推荐歌单列表
export function getDiscList () {
  // 线上环境地址,根据自己的需要配置修改
  const url = debug ? '/api/getDiscList' : 'http://www.yeelei.top/music/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 推荐歌单歌曲列表
export function getSongList (disstid) {
  const url = debug ? '/api/getCdInfo' : 'http://www.yeelei.top/music/api/getCdInfo'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
