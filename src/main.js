import Vue from 'vue'

import './bootstrap'
import './plugins'

import { layout } from 'vue-extend-layout'
import router from './router'

new Vue({
  el: '#app',
  router,
  ...layout
});
