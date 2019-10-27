<template>
  <div class="user-center">
    <div class="bg bg-blur"></div>
    <div class="back"
         @click="back">
      <i class="fa fa-angle-left"></i>
    </div>
    <div class="switches-wrapper">
      <switches :switches="switches"
                :currentIndex="currentIndex"
                @switch="switchItem">
      </switches>
    </div>
    <div ref="playBtn"
         class="play-btn"
         @click="random">
      <i class="iconfont icon-random-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper"
         ref="listWrapper">
      <!-- 我喜欢的 -->
      <scroll v-if="currentIndex === 0"
              :data="favoriteList"
              class="list-scroll"
              ref="favoriteList">
        <div class="list-inner">
          <song-list :songs="favoriteList"
                     @selectSong="selectSong"
                     :seekFlag="false">
          </song-list>
        </div>
      </scroll>
      <!-- 最近播放 -->
      <scroll v-if="currentIndex === 1"
              :data="playHistory"
              class="list-scroll"
              ref="playList">
        <div class="list-inner">
          <song-list :songs="playHistory"
                     @selectSong="selectSong"
                     :seekFlag="false">
          </song-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
// import NoResult from 'base/no-result/no-result'
import Song from 'common/js/song'
import { mapGetters, mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [{
        name: '我喜欢的'
      }, {
        name: '最近听的'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    back () {
      this.$router.back()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    // 随机播放
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      // 因为list不是song的实例
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '40px' : ''
      this.$refs.listWrapper.style.bottom = bottom
      // 不能直接对favoriteList进行refresh,因为它绑定了v-if，可能不存在
      this.$refs.favoriteList && this.$refs.favoriteList.refresh()
      this.$refs.playList && this.$refs.playList.refresh()
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('../../common/image/bg.jpg') no-repeat;
    z-index: -1;
    &.bg-blur {
      float: left;
      filter: brightness(0.8);
      background-size: cover;
    }
  }
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    width: 40px;
    height: 40px;
    z-index: 10;
    i {
      display: block;
      text-align: center;
      line-height: 40px;
      font-weight: bold;
      font-size: 30px;
    }
  }
  .switches-wrapper {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 60px auto 10px;
    text-align: center;
    border: 1px solid $color-theme;
    color: $color-text;
    border-radius: 100px;
    font-size: 0;
    .icon-random-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      color: $color-theme;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      color: $color-theme;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
    }
    .list-inner {
      padding: 20px 10px;
      .iconfont {
        margin-top: 5px;
      }
    }
  }
}
</style>
