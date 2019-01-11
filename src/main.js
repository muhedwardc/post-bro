import Vue from 'vue'
import './plugins/vuetify'
import router from './router/index'
import { store } from './store/store'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
