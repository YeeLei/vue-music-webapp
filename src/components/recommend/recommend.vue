<template>
  <div class="recommend"
       ref="recommend">
    <scroll :data="list"
            class="recommend-content"
            ref="scroll">
      <div>
        <!-- 轮播图 -->
        <div v-if="banners.length"
             class="slider-wrapper">
          <div class="slider-content">
            <slider ref="slider">
              <div v-for="(item,index) in banners"
                   :key="index">
                <a :href="item.linkUrl">
                  <img @load="loadImage"
                       :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <!-- 推荐歌单 -->
        <div class="recommend-list">
          <h1 class="title">推荐歌单</h1>
          <ul>
            <li v-for="(item,index) in discList"
                :key="index"
                @click="selectDiscList(item)"
                class="item">
              <div class="icon">
                <div class="gradients"></div>
                <p class="play-count">
                  <i class="fa fa-headphones"> {{Math.floor(item.listennum / 10000)}}万</i>
                </p>
                <i class="iconfont icon-play"></i>
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <p class="name">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 热门歌单 -->
        <div class="recommend-list">
          <h1 class="title">热门歌单</h1>
          <ul>
            <li v-for="(item,index) in hotList"
                :key="index"
                @click="selectHotList(item)"
                class="item">
              <div class="icon">
                <div class="gradients"></div>
                <p class="play-count">
                  <i class="fa fa-headphones"> {{Math.floor(item.accessnum / 10000)}}万</i>
                </p>
                <i class="iconfont icon-play"></i>
                <img v-lazy="item.picUrl">
              </div>
              <div class="text">
                <p class="name">{{item.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-show="!list.length"
           class="loading-wrapper">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      banners: [],
      discList: [],
      hotList: []
    }
  },
  computed: {
    list () {
      return this.discList.concat(this.hotList)
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  },
  activated () {
    setTimeout(() => {
      this.$refs.slider && this.$refs.slider.refresh()
    }, 20)
  },
  methods: {
    loadImage () {
      if (!this.checkloaded) {
        this.checkloaded = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    selectDiscList (list) {
      this.$router.push({
        path: `/recommend/${list.dissid}`
      })
      this.setDisc(list)
    },
    selectHotList (list) {
      this.$router.push({
        path: `/recommend/${list.id}`
      })
      this.setDisc(list)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '40px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend () {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.banners = res.data.slider
          this.hotList = res.data.songList
        }
      })
    },
    _getDiscList () {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.recommend {
  position: fixed;
  width: 100%;
  top: 100px;
  bottom: 0;
  z-index: 100;
  .recommend-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 96%;
      height: 0;
      padding-top: 40%;
      left: 50%;
      transform: translateX(-50%);
      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
          .play-count {
            position: absolute;
            bottom: 10px;
            left: 8px;
            font-size: $font-size-small-s;
            color: $color-text;
          }
          .iconfont {
            position: absolute;
            bottom: 7px;
            right: 5px;
            color: $color-text;
          }
        }
        .text {
          float: left;
          text-align: left;
          height: 40px;
          line-height: 16px;
          overflow: hidden;
          margin-bottom: 10px;
          font-size: $font-size-small;
        }
      }
    }
    .loading-wrapper {
      position: absolute;
      width: 100%;
      top: 60%;
      transform: translateY(-60%);
    }
  }
}
</style>
