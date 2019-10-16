<template>
  <div class="rank">
    <scroll class="top-list"
            :data="topList">
      <ul>
        <li v-for="(item,index) in topList"
            :key="index"
            @click="selectItem(item)"
            class="item">
          <ul class="songlist">
            <h2>{{item.topTitle}}</h2>
            <li class="song"
                v-for="(song,index) in item.songList"
                :key="index">
              <span class="song-num">{{index + 1}}.</span>
              <span>{{song.songname}} </span>
              <span class="sub-name"> - {{song.singername}}</span>
            </li>
          </ul>
          <div class="icon">
            <img v-lazy="item.picUrl"
                 width="100"
                 height="100">
          </div>
        </li>
      </ul>
      <div v-show="!topList.length"
           class="loading-wrapper">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
export default {
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
        path: `/rank/${item.listenCount}`
      })
      this.setTopList(item)
    },
    _getTopList () {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
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
    ul {
      padding: 20px 0;
      .item {
        display: flex;
        margin: 0 20px 20px 20px;
        height: 100px;
        border-radius: 5px;
        overflow: hidden;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .songlist {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 10px;
          height: 100px;
          overflow: hidden;
          background: #fff;
          color: $color-text;
          font-size: $font-size-small;
          h2 {
            font-size: $font-size-medium-x;
            color: #000;
            font-weight: 400;
            margin: 7px 0;
            text-indent: 3px;
          }
          .song {
            @include no-wrap();
            line-height: 20px;
            color: #000;
            .song-num {
              color: #000;
              font-weight: 400;
              font-size: $font-size-small-x;
            }
            .sub-name {
              color: $color-text-g;
            }
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
