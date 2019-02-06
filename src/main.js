import Vue from 'vue'
import './plugins/vuetify'
import router from './router/index'
import { store } from './store/store'
import App from './App.vue'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Composer from './components/composer.vue'
import AppSnackbar from './components/snackbar.vue'
import AppLoading from './components/loading.vue'

Vue.config.productionTip = false
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL;

Vue.component('app-composer', Composer)
Vue.component('app-snackbar', AppSnackbar)
Vue.component('app-loading', AppLoading)

Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
