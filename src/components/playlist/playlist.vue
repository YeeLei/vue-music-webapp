<template>
  <transition name="list-fade">
    <div class="playlist"
         v-show="showFlag"
         @click="hide">
      <div class="list-wrapper"
           @click.stop>
        <div class="list-header border-bottom-1px">
          <h1 class="title">
            <i class="icon iconfont"
               :class="iconMode"
               @click="changeMode"></i>
            <span class="text">{{playListMode}}<span v-show="this.mode!== 1">({{playlist.length}}首)</span></span>
            <span class="clear"
                  @click="showConfirm">
              <i class="iconfont icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content"
                :data="sequenceList"
                ref="listContent">
          <div>
            <transition-group name="list"
                              ref="list"
                              tag="ul">
              <li class="item border-bottom-1px"
                  v-for="(item,index) in sequenceList"
                  :key="item.id"
                  @click="selectItem(item,index)">
                <span class="text"
                      :class="textActive(item)">
                  {{item.name}}
                  <i class="iconfont icon-sq"></i>
                  <i class="iconfont icon-dujia"
                     v-if="item.isonly"></i>
                  <span class="singer"> - {{item.singer}}</span>
                  <div :class="getCurrentIcon(item)">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </span>
                <!-- <span class="like"
                      @click.stop="">
                  <i class="iconfont"
                     :class="getFavoriteIcon(item)"></i>
                </span> -->
                <span class="delete"
                      @click.stop="deleteOne(item)">
                  <i class="iconfont icon-delete-list"></i>
                </span>
              </li>
            </transition-group>
            <div class="list-operate">
              <div class="add"
                   @click="addSong">
                <i class="iconfont icon-add"></i>
                <span class="text">添加歌曲到队列</span>
              </div>
            </div>
          </div>

        </scroll>
        <div class="list-close border-top-1px"
             @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               text="是否清空播放列表"
               confirmBtnText="清空"
               @confirm="confirmClear">
      </confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'

export default {
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    ...mapGetters([
      'playing'
    ])
  },
  methods: {
    show () {
      this.showFlag = true
      // 重新计算高度
      setTimeout(() => {
        this.$refs.listContent.refresh()
        // 组件显示之后,滚动到当前歌曲
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    getCurrentIcon (item) {
      // 如果当前是播放的,则加上动画play
      if (this.currentSong.id === item.id && this.playing) {
        return 'music play'
      } else if (this.currentSong.id === item.id) { // 如果是当前播放的歌曲,但是没有播放,则只显示音乐条
        return 'music '
      } else {
        return ''
      }
    },
    textActive (item) {
      // 如果当前是播放的,则加上active样式
      if (this.currentSong.id === item.id) {
        return 'active'
      }
    },
    selectItem (song, index) {
      // 提交mutations,设置当前播放的索引
      if (this.mode === playMode.random) {
        // 如果是随机播放
        index = this.playlist.findIndex((item) => {
          return item.id === song.id
        })
      }
      // console.log(index)
      this.setCurrentIndex(index)
      if (this.playing) {
        // 设置播放状态
        this.setPlayingState(false)
      } else {
        this.setPlayingState(true)
      }
    },
    scrollToCurrent (current) {
      // 根据索引滚动到当前再list列表中的位置
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      // 组件显示之后,滚动到当前歌曲
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    deleteOne (item) {
      // 从播放列表删除一条歌曲
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    confirmClear () {
      // 清空播放列表
      this.deleteSongList()
      this.hide()
    },
    addSong () {
      this.$refs.addSong.show()
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      // 如果组件没有显示或newSong与oldSong的id值相等
      if (!this.showFlag || newSong.id === oldSong.id) {
        return
      }
      this.scrollToCurrent(newSong)
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 10px;
    background-color: $color-background-play-list;
    .list-header {
      position: relative;
      padding: 20px 20px 10px 20px;
      @include border-bottom-1px($color-border);
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 25px;
          color: $color-text-ggg;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium-x;
          color: $color-text;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium-x;
            color: $color-text-ggg;
          }
        }
      }
    }
    .list-content {
      max-height: 350px;
      overflow: hidden;
      ul {
        .item {
          display: flex;
          align-items: center;
          height: 50px;
          margin-left: 20px;
          @include border-bottom-1px($color-border);
          overflow: hidden;
          &.list-enter-active,
          &.list-leave-active {
            transition: all 0.1s;
          }
          &.list-enter,
          &.list-leave-to {
            height: 0;
          }
          .text {
            position: relative;
            flex: 1;
            line-height: 40px;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text;
            vertical-align: middle;
            &.active {
              color: rgb(49, 194, 124);
              .singer {
                color: rgb(49, 194, 124);
              }
            }
            .iconfont {
              vertical-align: middle;
              font-size: $font-size-large-x;
            }
            .icon-sq {
              color: rgb(255, 205, 49);
              margin-right: 2px;
            }
            .icon-dujia {
              color: $color-theme;
              margin-top: 1px;
            }
            .singer {
              color: $color-text-ggg;
              font-size: $font-size-small-x;
            }
            .music {
              position: relative;
              width: 30px;
              height: 30px;
              text-align: center;
              margin-left: 10px;
              display: inline-block;
              i {
                position: absolute;
                bottom: 0;
                background-color: $color-theme;
                width: 2px;
                &:nth-of-type(1) {
                  height: 10px;
                  left: 5px;
                }
                &:nth-of-type(2) {
                  height: 20px;
                  left: 9px;
                }
                &:nth-of-type(3) {
                  height: 15px;
                  left: 13px;
                }
                &:nth-of-type(4) {
                  height: 5px;
                  left: 17px;
                }
              }
              &.play {
                i:nth-of-type(1) {
                  animation: wave 0.66s linear infinite;
                }
                i:nth-of-type(2) {
                  animation: wave1 0.7s linear infinite;
                }
                i:nth-of-type(3) {
                  animation: wave2 0.88s linear infinite;
                }
                i:nth-of-type(4) {
                  animation: wave2 1s linear infinite;
                }
              }
              @keyframes wave {
                0% {
                  height: 5px;
                }
                50% {
                  height: 8px;
                }
                100% {
                  height: 5px;
                }
              }
              @keyframes wave1 {
                0% {
                  height: 8px;
                }
                50% {
                  height: 20px;
                }
                100% {
                  height: 8px;
                }
              }
              @keyframes wave2 {
                0% {
                  height: 5px;
                }
                50% {
                  height: 15px;
                }
                100% {
                  height: 5px;
                }
              }
            }
          }
          .like {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            .icon-favorite {
              color: $color-theme;
            }
          }
          .delete {
            margin-right: 21px;
            @include extend-click();
            i {
              font-size: $font-size-medium;
              color: $color-text-ggg;
            }
          }
        }
      }
      .list-operate {
        width: 140px;
        height: 40px;
        margin: 3px auto 5px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 10px 10px 0 10px;
          color: $color-text;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-medium-x;
            margin-top: -1px;
          }
          .text {
            font-size: $font-size-medium;
          }
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      font-size: $font-size-medium-x;
      color: $color-text;
      @include border-top-1px($color-border);
      background: rgba(53, 49, 49, 0.9);
    }
  }
}
</style>
