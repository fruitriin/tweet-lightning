import { postWindow, preferenceWindow, openAuthWindow } from "./windows"
import { store, accounts, preference } from "./store"
import { setPostShortcut } from "./globalShortcuts"
import { constants } from "./constants"
const { ipcMain } = require("electron")

ipcMain.on("postWindow-ready", () => {
  postWindow.webContents.send("getTokens", accounts.get())
  postWindow.webContents.send("getPreference", preference.get())
})
ipcMain.on("postWindow-posted", () => {
  if (preference.get().hideAfterPost) postWindow.hide()
  const bounds = postWindow.getContentBounds()
  bounds.height = constants.POST_WINDOW_INIT_HEIGHT
  postWindow.setContentBounds(bounds)
})
ipcMain.on("postWindow-close", () => {
  postWindow.hide()
})
ipcMain.on("postWindow-expand", () => {
  const size = postWindow.getSize()
  postWindow.setSize(size[0], size[1] + constants.POST_WINDOW_EXPAND_HEIGHT)
})
ipcMain.on("postWindow-contract", () => {
  const size = postWindow.getSize()
  postWindow.setSize(size[0], size[1] - constants.POST_WINDOW_EXPAND_HEIGHT)
})

ipcMain.on("preferenceWindowReady", () => {
  preferenceWindow.webContents.send("getTokens", accounts.get())
  preferenceWindow.webContents.send("getPreference", preference.get())
})
// 設定変更
ipcMain.on("changePreference", (_, { preference: pref, accounts: acc }) => {
  preference.set(pref)
  accounts.set(acc)

  // 設定の反映
  postWindow.setAlwaysOnTop(preference.get().alwaysOnTop)
  setPostShortcut()
  postWindow.webContents.send("getPreference", preference.get())
  preferenceWindow.webContents.send("getPreference", preference.get())
})

// アカウント削除
ipcMain.on("deleteAccount", (_, index) => {
  const accounts = store.get("accounts") || []
  accounts.splice(index, 1)
  preferenceWindow.webContents.send("getTokens", accounts)
  store.set("accounts", accounts)
})

// ログイン認証
ipcMain.on("authenticate", () => {
  openAuthWindow()
})
ipcMain.on("tokenRefresh", () => {
  if (postWindow !== null) postWindow.webContents.send("getTokens")
  if (preferenceWindow !== null) preferenceWindow.webContents.send("getTokens")
})

ipcMain.on("errorLogger", (_, mes) => {
  console.error(mes)
})
