import 'normalize.css/normalize.css'
import 'vue-material-design-icons/styles.css'

import Vue from 'vue'

/* vue-highlightjs */
import 'highlight.js/styles/github-gist.css'
import VueHighlightJS from 'vue-highlightjs'
Vue.use(VueHighlightJS);

/* v-img */
import VueImg from 'v-img';
Vue.use(VueImg);

/* vue-infinite-scroll */
import VueInfiniteScroll from 'vue-infinite-scroll'
Vue.use(VueInfiniteScroll);

/* vue-event-calendar */
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, {locale: 'fr'});

/* vue-youtube */
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube);

/* vue-croppa */
import 'vue-croppa/dist/vue-croppa.css'
import Croppa from 'vue-croppa'
Vue.use(Croppa);

/* element-ui */
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/_themes.scss'
import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/fr'
import locale from 'element-ui/lib/locale'

locale.use(lang);
Vue.use(ElementUI);

/* vue-data-tables */
import DataTables from 'vue-data-tables'
import { DataTablesServer } from 'vue-data-tables'
Vue.use(DataTables);
Vue.use(DataTablesServer);

import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper, /* { default global options } */)

/* vue-extend-layout */
import { VueExtendLayout } from 'vue-extend-layout'
Vue.use(VueExtendLayout);

import './assets/scss/index.scss'
