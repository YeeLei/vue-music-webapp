import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';
const debug = process.env.NODE_ENV !== 'production';

export function getTopList () {
  const url = debug
    ? '/api/getTopList'
    : 'http://www.yeelei.top/music/api/getTopList';
  return axios
    .post(url, {
      req_0: {
        module: 'musicToplist.ToplistInfoServer',
        method: 'GetAll',
        param: {}
      },
      comm: {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        ct: 23,
        cv: 0
      }
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}

export function getMusicList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
