import Vue from "vue"
import axios from "axios"

import App from "./App"
import Router from "vue-router"
import routes from "vue-auto-routing"

Vue.use(Router)
const router = new Router({
  routes: routes,
})

if (!process.env.IS_WEB) Vue.use(require("vue-electron"))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: "<App/>",
}).$mount("#app")
