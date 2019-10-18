<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"
          ref="suggest">
    <div class="suggest-wrapper">
      <ul class="suggest-list">
        <h2 class="title"
            v-show="!result.length">搜索“{{query}}”</h2>
        <li class="suggest-item"
            v-for="(item,index) in result"
            :key="index"
            @click="selectItem(item)">
          <span class="avatar"
                v-if="item.type === 'singer' && index < 1">
            <img :src="item.image">
          </span>
          <i :class="getIconCls(item)"
             class="icon iconfont"
             v-if="item.type !== 'singer' && index >= 0">
          </i>
          <h6 class="main-tit"
              v-html="item.name"
              v-if="item.type !== 'singer' && index >= 0">
          </h6>
          <h6 class="main-tit"
              v-html="item.singername"
              v-if="item.type === 'singer' && index < 1">
          </h6>
          <p class="sub-tit"
             v-html="item.singer">
          </p>
          <p class="sub-tit"
             v-if="item.type === 'singer' && index < 1">
            <span>单曲：{{item.songnum}}</span>
            <span>专辑：{{item.albumnum}}</span>
          </p>
        </li>
        <loading v-show="hasMore"
                 title="">
        </loading>
      </ul>
      <div class="no-result-wrapper"
           v-show="!this.hasMore && !result.length">
        <no-result :title="title"></no-result>
      </div>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/no-result'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic, processSongUrl } from 'common/js/song'
import Singer from 'common/js/singer'
import { mapMutations, mapActions } from 'vuex'

const TYPE_SINGER = 'singer'
// 默认一页展示20条数据
const perpage = 20
export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  computed: {
    title () {
      return `很抱歉，暂时没有找到与“${this.query}”相关的结果。`
    }
  },
  methods: {
    search () {
      // 默认第一页,且还有很多数据
      this.hasMore = true
      this.page = 1
      // 将搜索结果重新滚动到顶部
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result
          })
          // 检测是否还有更多搜索结果
          this._checkMore(res.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      // 页数+1
      this.page++
      // 再次调用search()搜索数据
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            // 将搜索到的结果值追加到当前的this.result中
            this.result = this.result.concat(result)
          })
          // 检测是否还有更多搜索结果
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      return 'icon-music'
    },
    selectItem (item) {
      // 如果点击的是歌手
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        // 直接跳转到歌手详情页
        this.$router.push({
          path: `/search/${singer.id}`
        })
        // 设置当前歌手
        this.setSinger(singer)
      } else {
        // 插入当前歌曲到播放列表中
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    // 对查询到的数据进行处理
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        // 如果获取到了data.zhida.singerid,则需要保存 type:singer 这个属性,
        // 并且加上该歌手id对应的图片，就可以点击之后进入到歌手详情页
        const image = `https://y.gtimg.cn/music/photo_new/T001R68x68M000${data.zhida.singermid}.jpg?max_age=2592000`
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER }, ...{ image } })
        // console.log(ret) // albumnum: 16, singerid: 5062,singermid: "002J4UUk29y8BY",singername: "薛之谦",songnum: 284,type: "singer"
      }
      return processSongUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    // 监听query变化
    query () {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.suggest {
  position: fixed;
  top: 45px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .suggest-wrapper {
    padding: 20px 10px;
    .title {
      color: #31c27c;
      font-size: $font-size-medium;
      margin-bottom: 15px;
      margin-left: 10px;
      @include no-wrap();
    }
    .suggest-item {
      position: relative;
      height: 55px;
      padding-left: 56px;
      overflow: hidden;
      .icon {
        position: absolute;
        top: 18px;
        left: 15px;
        width: 22px;
        height: 20px;
        font-size: $font-size-large-x;
      }
      .avatar {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
      .main-tit {
        margin: 10px 0 2px;
        line-height: 18px;
        font-size: $font-size-medium;
        font-weight: 400;
        color: #000;
        @include no-wrap();
      }
      .sub-tit {
        font-size: $font-size-small-x;
        color: grey;
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
