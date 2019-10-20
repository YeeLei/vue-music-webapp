<template>
  <div class="rank"
       ref="rank">
    <scroll class="top-list"
            :data="topList"
            ref="scroll">
      <div>
        <!-- 巅峰榜 -->
        <h2 class="title"
            v-if="this.topList[0]">{{this.topList[0].groupName}}</h2>
        <ul class="top-wrapper"
            v-if="this.topList[0]">
          <li v-for="(item,index) in this.topList[0].toplist"
              :key="index"
              @click="selectItem(item)"
              class="item">
            <ul class="songlist">
              <h2>{{item.title}}</h2>
              <li class="song"
                  v-for="(song,index) in item.song"
                  :key="index">
                <span class="song-num">{{index + 1}}.</span>
                <span>{{song.title}} </span>
                <span class="sub-name"> - {{song.singerName}}</span>
              </li>
            </ul>
            <div class="icon">
              <p class="update-tip">{{item.updateTips}}</p>
              <img v-lazy="item.mbFrontPicUrl"
                   width="100"
                   height="100">
              <p class="play-count">
                <i class="fa fa-headphones">{{Math.floor(item.listenNum / 10000)}}万</i>
              </p>
              <i class="iconfont icon-play"></i>
            </div>
          </li>
        </ul>
        <!-- 地区榜 -->
        <h2 class="title are-title"
            v-if="this.topList[1]">{{this.topList[1].groupName}}</h2>
        <ul class="area-wrapper"
            v-if="this.topList[1]">
          <li v-for="(area,index) in this.topList[1].toplist"
              :key="index"
              @click="selectItem(area)"
              class="area">
            <div class="icon">
              <div class="gradients"></div>
              <p class="play-count">
                <i class="fa fa-headphones"> {{Math.floor(area.listenNum / 10000)}}万</i>
              </p>
              <i class="iconfont icon-play"></i>
              <img v-lazy="area.frontPicUrl">
            </div>
          </li>
        </ul>
        <!-- 特色榜 -->
        <h2 class="title"
            v-if="this.topList[2]">{{this.topList[2].groupName}}</h2>
        <ul class="area-wrapper"
            v-if="this.topList[2]">
          <li v-for="(area,index) in this.topList[2].toplist.slice(0,9)"
              :key="index"
              @click="selectItem(area)"
              class="area">
            <div class="icon">
              <div class="gradients"></div>
              <p class="play-count">
                <i class="fa fa-headphones"> {{Math.floor(area.listenNum / 10000)}}万</i>
              </p>
              <i class="iconfont icon-play"></i>
              <img v-lazy="area.frontPicUrl">
            </div>
          </li>
        </ul>
        <!-- 全球榜 -->
        <h2 class="title"
            v-if="this.topList[3]">{{this.topList[3].groupName}}</h2>
        <ul class="area-wrapper"
            v-if="this.topList[3]">
          <li v-for="(area,index) in this.topList[3].toplist"
              :key="index"
              @click="selectItem(area)"
              class="area">
            <div class="icon">
              <p class="play-count">
                <i class="fa fa-headphones"> {{Math.floor(area.listenNum / 10000)}}万</i>
              </p>
              <i class="iconfont icon-play"></i>
              <img v-lazy="area.frontPicUrl">
            </div>
          </li>
        </ul>
        <div v-show="!topList.length"
             class="loading-wrapper">
          <loading></loading>
        </div>
      </div>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.listenNum}`
      })
      this.setTopList(item)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '45px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.req_0.data.group
          // console.log(this.topList)
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
@import 'common/scss/mixin.scss';
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list {
    height: 100%;
    overflow: hidden;
    .title {
      color: $color-text;
      font-size: $font-size-large;
      font-weight: 400;
      padding: 20px 18px 0;
      box-sizing: border-box;
      &.are-title {
        padding-top: 0;
      }
    }
    .top-wrapper {
      padding: 10px 0;
      .item {
        display: flex;
        margin: 0 15px 20px 15px;
        height: 100px;
        border-radius: 5px;
        overflow: hidden;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          padding-bottom: 0;
        }
        .icon {
          position: relative;
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
          .update-tip {
            position: absolute;
            top: 10px;
            right: 5px;
            color: $color-text-llll;
            font-size: $font-size-small-s;
          }
          .play-count {
            position: absolute;
            bottom: 8px;
            left: 8px;
            font-size: $font-size-small-s;
            color: $color-text;
            .fa:before {
              margin-right: 3px;
            }
          }
          .icon-play {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: $color-text-llll;
          }
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 10px;
          height: 100px;
          overflow: hidden;
          background: $color-background-ddd;
          color: $color-text;
          font-size: $font-size-small;
          h2 {
            font-size: $font-size-medium-x;
            margin: 7px 0;
            text-indent: 3px;
          }
          .song {
            @include no-wrap();
            line-height: 20px;
            .song-num {
              font-weight: 400;
              font-size: $font-size-small-x;
            }
            .sub-name {
              color: $color-text-ggg;
            }
          }
        }
      }
    }
    .area-wrapper {
      margin-top: 10px;
      text-align: center;
      .area {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 31%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
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
            color: $color-text-llll;
          }
        }
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
</style>
