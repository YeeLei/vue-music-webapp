<template>
  <transition name="fade">
    <div class="disc-brief"
         v-show="flag"
         ref="disc">
      <div class="bg-image"
           :style="bgStyle">
      </div>
      <scroll class="disc-brief-wrapper"
              ref="scroll">
        <div>
          <div class="header">
            <div class="back"
                 @click="back">
              <i class="fa fa-angle-left"></i>
            </div>
          </div>
          <div class="content">
            <div class="image">
              <img :src="brief.logo">
            </div>
            <h2 class="title">{{brief.dissname}}</h2>
            <div class="author">
              <span class="avatar">
                <img :src="brief.headurl"
                     width="25"
                     height="25">
                <i :style="iconStyle"
                   v-show="brief.ifpicurl"></i>
              </span>
              <span class="author-name">{{brief.nick}}</span>
            </div>
            <ul class="tags">
              <li v-for="(tag,index) in brief.tags"
                  :key="index"
                  class="item">
                <span class="">{{tag.name}}</span>
              </li>
            </ul>
            <p class="desc"
               v-html="brief.desc">
            </p>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import scroll from 'base/scroll/scroll'
import { playlistMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin],
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.brief.logo})`
    },
    iconStyle () {
      return `background-image: url(${this.brief.ifpicurl})`
    },
    ...mapGetters(['brief'])
  },
  mounted () {
    // 初始化BScroll
    // this.$nextTick(() => {
    //   if (!this.scroll) {
    //     this.scroll = new BScroll(this.$refs.discBrief)
    //   } else {
    //     this.scroll.refresh()
    //   }
    // })
  },
  methods: {
    back () {
      this.$emit('back')
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length ? '50px' : ''
      this.$refs.disc.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  components: {
    scroll
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.disc-brief {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 999;
  background: $color-background;
  .bg-image {
    position: relative;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    filter: blur(17px);
  }
  .disc-brief-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    .header {
      height: 40px;
      line-height: 40px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 101;
        width: 40px;
        height: 40px;
        i {
          display: block;
          text-align: center;
          line-height: 40px;
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .content {
      .image {
        width: 40%;
        height: 40%;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        line-height: 30px;
        font-size: $font-size-medium-x;
        color: #fff;
        text-align: center;
      }
      .author {
        line-height: 30px;
        color: #fff;
        font-size: 0;
        text-align: center;
        .avatar {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          width: 25px;
          height: 25px;
          overflow: hidden;
          margin-right: 8px;
          img {
            border-radius: 50%;
          }
          i {
            position: absolute;
            bottom: 0;
            right: 1px;
            width: 10px;
            height: 10px;
            background-repeat: no-repeat;
            background-size: cover;
          }
        }
        .author-name {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-medium;
        }
      }
      .tags {
        overflow: hidden;
        display: table;
        margin: 20px auto;
        .item {
          float: left;
          padding: 0 10px;
          margin: 0 5px;
          box-sizing: border-box;
          line-height: 25px;
          text-align: center;
          color: #fff;
          border: 1px solid #fff;
          border-radius: 15px;
          font-size: $font-size-small-x;
        }
      }
      .desc {
        padding: 0 5%;
        box-sizing: border-box;
        line-height: 30px;
        font-size: $font-size-small-x;
        color: $color-text;
        text-align: center;
      }
    }
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
</style>
