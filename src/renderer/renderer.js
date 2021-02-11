import Vue from "vue"

import App from "./App"
import Router from "vue-router"
import routes from "vue-auto-routing"
import { visitor } from "./plugins/analytics"

Vue.use(Router)
const router = new Router({
  routes: routes,
})

router.afterEach((to, from) => {
  visitor.pageview(to.path, "http://localhost", to.name).send()
})

if (!process.env.IS_WEB) {
  Vue.use(require("vue-electron"))
  Vue.use(require("./plugins/electronRenderer"))
}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: "<App/>",
}).$mount("#app")
