<template>
  <transition name="hide">
    <div class="seek"
         v-show="seek">
      <div class="bg bg-blur"></div>
      <div class="search">
        <search-box :placeholder="placeholder"
                    @query="onQueryChange"
                    ref="searchBox">
        </search-box>
        <div class="hide"
             @click="hide">取消</div>
      </div>
      <scroll class="list"
              ref="list"
              @listScroll="blurInput"
              :data="songs">
        <ul>
          <li v-for="(song,index) in songs"
              :key="index"
              @click="selectSong(song,index)"
              class="item">
            <div class="content">
              <h2 class="name">{{song.name}}</h2>
              <p class="desc">
                <span class="detail-icon iconfont icon-sq"
                      style="color:#ffcd31">
                </span>
                <span v-show="song.isonly !== 0"
                      class="detail-icon iconfont icon-dujia">
                </span>
                <span class="detail-song-name">{{getDesc(song)}}</span>
              </p>
            </div>
          </li>
        </ul>
        <div class="no-result-wrapper"
             v-show="!this.songs.length && this.query">
          <p class="no-result-text">很抱歉，暂时没有找到与“<span class="text">{{`${this.query}`}}</span>”相关的结果。</p>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Scroll from 'base/scroll/scroll'
import { mapGetters } from 'vuex'
import { playlistMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin],
  props: {
    seek: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '搜索此歌手歌曲'
    }
  },
  computed: {
    ...mapGetters([
      'singerSongList'
    ])
  },
  data () {
    return {
      query: '',
      songs: []
    }
  },
  methods: {
    hide () {
      this.$emit('hide')
    },
    trigger () {
      this.$refs.searchBox.trigger()
    },
    getDesc (song) {
      if (song.albumdesc) {
        return `${song.singer} · ${song.album} · ${song.albumdesc}`
      }
      return `${song.singer} · ${song.album}`
    },
    onQueryChange (query) {
      // 处理带空格的情况
      this.query = query.trim()
      let songs = []
      let keyWord = this.query
      for (let i = 0; i < this.singerSongList.length; i++) {
        if (this.singerSongList[i].album.indexOf(keyWord) >= 0 ||
          this.singerSongList[i].name.indexOf(keyWord) >= 0 ||
          this.singerSongList[i].singer.indexOf(keyWord) >= 0) {
          if (!keyWord) { // 如果为空
            return
          } else {
            songs.push(this.singerSongList[i])
          }
        }
      }
      this.songs = songs
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    selectSong (song, index) {
      // 选择播放的歌曲
      this.$emit('selectSong', song, index)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '40px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    }
  },
  watch: {
    query (newQuery) {
      // 对当前歌手列表所有歌曲进行查找
      if (!newQuery) {
        this.songs = []
        setTimeout(() => {
          this.$refs.list.refresh()
        }, this.refreshDelay)
      }
    }
  },
  components: {
    SearchBox,
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.seek {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 100;
  .bg {
    width: 100%;
    height: 100%;
    background: url('../../common/image/bg.jpg') no-repeat;
    &.bg-blur {
      float: left;
      filter: brightness(0.7);
      background-size: cover;
    }
  }
  .search {
    position: fixed;
    top: 10px;
    left: 10px;
    width: 100%;
    height: 35px;
    line-height: 35px;
    .hide {
      position: absolute;
      right: 20px;
      top: 0;
      line-height: 35px;
      width: 40px;
      color: $color-text-gggg;
      font-size: $font-size-medium-x;
    }
  }
  .list {
    position: absolute;
    top: 45px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    ul {
      padding: 0 15px;
      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 64px;
        font-size: $font-size-medium;
        .content {
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          .name {
            @include no-wrap();
            color: $color-text;
          }
          .desc {
            @include no-wrap();
            margin-top: 4px;
            .detail-song-name {
              font-size: $font-size-small-x;
              color: $color-text-gggg;
              vertical-align: top;
              margin-left: 5px;
            }
            .detail-icon {
              color: $color-theme-g;
              height: 16px;
              display: inline-block;
              vertical-align: top;
              line-height: 16px;
            }
          }
        }
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    transform: translate(-50%, -50%);
    .no-result-text {
      font-size: $font-size-medium;
      line-height: 30px;
      .text {
        color: $color-theme-g;
      }
    }
  }
}
.hide-enter-active,
.hide-leave-active {
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.hide-enter,
.hide-leave-to {
  opacity: 0;
}
</style>
