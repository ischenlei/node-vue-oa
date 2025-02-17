import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import '@/assets/iconfont/iconfont.css'
import '@/assets/scss/style.scss'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

Vue.use(VueAwesomeSwiper)

import http from "./http";
Vue.prototype.$http = http

import store from './store'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
