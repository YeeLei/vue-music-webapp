<template>
  <transition name="list-fade">
    <div class="play-singer-list"
         v-show="showFlag"
         @click="hide">
      <div class="singer-list-wrapper"
           @click.stop>
        <div class="singer-list-header border-bottom-1px">
          <h1 class="singer-title">查看歌手</h1>
        </div>
        <scroll class="singer-content"
                :data="singerList"
                ref="singerList">
          <div>
            <ul>
              <li class="singer-item"
                  v-for="(item,index) in singerList"
                  :key="index"
                  @click.stop="selectSinger(item)">
                <img :src="avatar(item.mid)"
                     width="40"
                     height="40"
                     class="avatar">
                <span class="singer-name border-bottom-1px">
                  {{item.name}}
                  <i class="fa fa-angle-right"></i>
                </span>
              </li>
            </ul>
            <div class="singer-list-close border-top-1px"
                 @click="hide">
              <span>关闭</span>
            </div>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Singer from 'common/js/singer'
import Scroll from 'base/scroll/scroll'
export default {
  props: {
    singerList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this.$refs.singerList.refresh()
      }, 20)
    },
    hide () {
      this.showFlag = false
    },
    avatar (id) {
      // 获取当前歌手的头像
      return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
    },
    selectSinger (item) {
      let singer = new Singer({
        id: item.mid,
        name: item.name
      })
      // 操作mutaion,设置singer保存到state上
      this.$emit('selectSinger', singer)
    }
  },
  components: {
    Scroll
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable';
@import 'common/scss/mixin';
.play-singer-list {
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
    .singer-list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .singer-list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .singer-list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgb(53, 49, 49);
    .singer-list-header {
      position: relative;
      padding: 20px;
      text-align: center;
      @include border-bottom-1px($color-border);
    }
    .singer-content {
      max-height: 350px;
      overflow: hidden;
      ul {
        margin-top: 5px;
        .singer-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          &:last-child {
            .singer-name {
              @include border-none();
            }
          }
          .avatar {
            flex: 0 0 40;
            border-radius: 50%;
            margin-left: 10px;
          }
          .singer-name {
            flex: 1;
            position: relative;
            line-height: 40px;
            text-align: left;
            margin-left: 10px;
            font-size: $font-size-small-x;
            @include border-bottom-1px($color-border);
            i {
              position: absolute;
              right: 20px;
              margin-top: 10px;
              font-size: $font-size-large;
              color: $color-text-gggg;
            }
          }
        }
      }
      .singer-list-close {
        text-align: center;
        line-height: 50px;
        font-size: $font-size-medium-x;
        color: $color-text;
        @include border-top-1px($color-border);
        background: rgba(53, 49, 49, 0.9);
      }
    }
  }
}
</style>
