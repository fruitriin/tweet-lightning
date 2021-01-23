import { mainWindow, preferenceWindow, openAuthWindow } from "./windows"
import { store } from "./store"
const { ipcMain } = require("electron")

// Vue Ready
ipcMain.on("postWindowReady", () => {
  const accounts = store.get("accounts")
  // トークン送信
  mainWindow.webContents.send("getTokens", accounts)
})
ipcMain.on("preferenceWindowReady", () => {
  const accounts = store.get("accounts")
  preferenceWindow.webContents.send("getTokens", accounts)
})

// ログイン認証
ipcMain.on("authenticate", () => {
  openAuthWindow()
})
ipcMain.on("tokenRefresh", () => {
  if (mainWindow !== null) mainWindow.webContents.send("getTokens")
  if (preferenceWindow !== null)
    preferenceWindow.webContents.send("getTokens")
})
