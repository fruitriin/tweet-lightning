import { constants } from "./constants"
const Store = require("electron-store")
const store = new Store()
export { store }

const accounts = {
  get() {
    const accounts = store.get("accounts") || []
    return accounts.map((a) => {
      if (!a.shortcut) {
        a.shortcut = constants.shortcutDefault
      }
      return a
    })
  },
  set(newValue) {
    store.set("accounts", newValue)
  },
}

const preference = {
  get() {
    // 設定の初期化
    const preference = store.get("preference") || {}
    const defaultPreference = {
      alwaysOnTop: true,
      hideAfterPost: true,
      postShortcut: "ctrl",
    }
    return Object.assign({}, defaultPreference, preference)
  },
  set(newValue) {
    store.set("preference", newValue)
  },
}

export { accounts, preference }
