// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'normalize.css/normalize.css'

import 'element-ui/lib/theme-chalk/index.css'

import "vue-material-design-icons/styles.css"
import "highlight.js/styles/github-gist.css"
import 'vue-croppa/dist/vue-croppa.css'

import './assets/scss/index.scss'

import Vue from 'vue'
import axios from 'axios'
import {Storage} from './helpers/localstorage'



import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001',
});

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'multipart/form-data',
  'Authorization': 'Bearer ' + (new Storage).get('access-token'),
  'Access-Control-Allow-Origin': '*',
};

import VueInfiniteScroll from 'vue-infinite-scroll'

Vue.use(VueInfiniteScroll);

import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
// can change background to by setting color: '#66b1ff'
Vue.use(vueEventCalendar, {locale: 'fr'});

import { VueExtendLayout, layout } from 'vue-extend-layout'

Vue.use(VueExtendLayout);

import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube);

import Croppa from 'vue-croppa'

Vue.use(Croppa);

import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/fr'
import locale from 'element-ui/lib/locale'
import DataTables from 'vue-data-tables'

Vue.config.productionTip = false;

locale.use(lang);
Vue.use(ElementUI);
Vue.use(DataTables);

import VueHighlightJS from 'vue-highlightjs'

Vue.use(VueHighlightJS);

import VueImg from 'v-img';

Vue.use(VueImg);

import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  ...layout
});

