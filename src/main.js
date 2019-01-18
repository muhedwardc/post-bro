import Vue from 'vue'
import './plugins/vuetify'
import router from './router/index'
import { store } from './store/store'
import App from './App.vue'
import './registerServiceWorker'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.baseURL = process.env.VUE_APP_BASE_API_URL;

Vue.use(VueAxios, axios)

var OneSignal = window.OneSignal || [];
OneSignal.push(function() {
	OneSignal.init({
		appId: process.env.VUE_APP_ONE_SIGNAL_APP_ID,
    autoRegister: false,
    notifyButton: {
      enable: true,
    },
	});
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
