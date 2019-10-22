import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 使用webapck code-Spliting加载按需加载路由,提高网页加载速率
const Recommend = () => import('components/recommend/recommend.vue')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const Search = () => import('components/search/search')
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      meta: {
        index: 0
      },
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      meta: {
        index: 1
      },
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      meta: {
        index: 3
      },
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      meta: {
        index: 4
      },
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})
