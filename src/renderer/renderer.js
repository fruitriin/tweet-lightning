import Vue from "vue"

import App from "./App"
import Router from "vue-router"
import routes from "vue-auto-routing"
const renderer = require("electron").ipcRenderer
Vue.use(Router)
const router = new Router({
  routes: routes,
})

if (!process.env.IS_WEB) {
  Vue.use(require("vue-electron"))
  Vue.use(require("./plugins/electronRenderer"))
}
Vue.config.productionTip = false

const Nucleus = require("nucleus-nodejs")
Nucleus.init("60258c87bcf16266e1db001d")
Vue.config.errorHandler = (err, vm, info) => {
  console.error(`Captured in Vue.config.errorHandler: ${info}`, err)
  renderer.send(
    "errorLogger",
    `Captured in Vue.config.errorHandler: ${info} \n ${err}`
  )
  Nucleus.trackError("Render errorHandler", err)
}
window.addEventListener("error", (event) => {
  console.error("Captured in error EventListener", event.error)
  renderer.send(
    "errorLogger",
    `Captured in error EventListener \n ${event.error}`
  )
  Nucleus.trackError("Render eventHandler", event.error)
})
window.addEventListener("unhandledrejection", (event) => {
  console.error("Captured in unhandledrejection EventListener", event.reason)
  renderer.send(
    "errorLogger",
    `Captured in unhandledrejection EventListener \n ${event.reason}`
  )
  Nucleus.trackError("Render unhandledrejection EventListener", event.reason)
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: "<App/>",
}).$mount("#app")
