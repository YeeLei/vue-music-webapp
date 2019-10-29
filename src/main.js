import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'common/scss/index.scss'
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('common/image/loading.gif')
})
fastclick.attach(document.body)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
