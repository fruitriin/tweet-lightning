import { mainWindow, openAuthWindow } from "./windows"
import { store } from "./store"
const { ipcMain } = require("electron")

// Vue Ready
ipcMain.on("ready", () => {
  const accounts = store.get("accounts")
  // トークン送信
  mainWindow.webContents.send("tokens", accounts)
})

// ログイン認証
ipcMain.on("authenticate", () => {
  openAuthWindow()
})
