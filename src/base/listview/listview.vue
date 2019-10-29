<template>
  <scroll class="listview"
          :data="singers"
          ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li v-for="(group,index) in singers"
          :key="index"
          class="list-group"
          ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item,index) in group.items"
              :key="index"
              @click="selectItem(item)"
              class="list-group-item">
            <img v-lazy="item.avatar"
                 class="avatar"
                 width="50"
                 height="50">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
         ref="listShortcut"
         v-show="shortcutList.length">
      <ul @touchstart="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove">
        <li v-for="(item,index) in shortcutList"
            :key="index"
            :data-index="index"
            class="item"
            :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- <div class="list-fixed"
         ref="fixed"
         v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div> -->
    <div class="loading-container"
         v-show="!singers.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'

const ANCHOR_HEIGHT = 18
// const TITLE_HEIGHT = 25

export default {
  mixins: [playlistMixin],
  created () {
    // 保存touch对象
    this.touch = {}
    // 开启scroll监听滚动
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    singers: {
      type: Array,
      default: null
    }
  },
  computed: {
    shortcutList () {
      return this.singers.map(group => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return ''
      }
      return this.singers[this.currentIndex]
        ? this.singers[this.currentIndex].title
        : ''
    }
  },
  methods: {
    selectItem (item) {
      // 派发selectItem事件给父组件用于获取歌手信息
      this.$emit('selectItem', item)
    },
    onShortcutTouchStart (e) {
      // 获取当前触摸元素的data-index值
      let anchorIndex = getData(e.target, 'index')
      // 获取第一次触摸的元素
      let firstTouch = e.touches[0]
      // 第一次触摸的元素的Y轴方向距离
      this.touch.y1 = firstTouch.pageY
      // 保存当前元素的data-index值到touch对象
      this.touch.anchorIndex = anchorIndex
      // 滚动到相应的位置
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // y轴上的偏移多少个锚点
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      // 因为this.touch.anchorIndex获取到的是一个String,所以需要parseInt
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      // 获取Y轴方向上的滚动距离
      this.scrollY = pos.y
    },
    handlePlaylist (playlist) {
      this.$refs.listview.refresh()
    },
    _scrollTo (index) {
      if (index === null) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2 // 22
      }
      this.scrollY = -this.listHeight[index]
      // console.log(this.scrollY)
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 计算每一层列表的高度.并保存到this.listHeight
    _calculateHight () {
      // this.listHeight = []
      // 获取所有的列表层
      const list = this.$refs.listGroup
      let height = 0
      // 默认第一层高度为0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    singers () {
      setTimeout(() => {
        this._calculateHight()
      }, 20)
    },
    // 监听Y轴方向上滚动的距离
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动,因为获取到的listHight多加了一层为0的列表,所以中间层为 listHeight.length - 1
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    }
    // diff (newVal) {
    //   let fixedTop =
    //     newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
    //   this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    // }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import 'common/scss/variable.scss';
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .list-group {
    padding-bottom: 30px;
    &:last-child {
      padding-bottom: 0;
    }
    .list-group-title {
      height: 25px;
      line-height: 25px;
      padding-left: 20px;
      font-size: $font-size-small-x;
      color: #fff;
      font-weight: bold;
      background: rgba(0, 0, 0, 0.1);
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      img {
        border-radius: 50%;
      }
      span {
        margin-left: 20px;
        color: $color-text;
        font-size: $font-size-medium;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-list-title;
    .item {
      padding: 3px;
      color: rgba(255, 255, 255, 0.8);
      font-size: $font-size-small-x;
      &.current {
        color: $color-theme;
      }
    }
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 25px;
      line-height: 25px;
      padding-left: 20px;
      font-size: $font-size-small-x;
      color: #fff;
      font-weight: bold;
      background: $color-background-list-title;
    }
  }
  .loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
