module.exports = {
  install: function (Vue) {
    Vue.prototype.$renderer = require("electron").ipcRenderer
  },
}
