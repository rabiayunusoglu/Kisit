import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
//import ApiService from './serviceOrnek/ApiService';
import CONFIG from './config.json';
import ServiceToken from "../src/service/TokenService";
import Axios from 'axios';
Axios.defaults.baseURL = 'http://localhost:63786/api/';
Axios.defaults.headers['Authorization'] = `Basic ${ServiceToken.getToken()}`;
Vue.config.performance = true
Vue.config.productionTip = false
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)
//ApiService.init(CONFIG.api.invokeUrl)

new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
