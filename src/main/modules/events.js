import { postWindow, preferenceWindow, openAuthWindow } from "./windows"
import { store } from "./store"
const { ipcMain } = require("electron")

ipcMain.on("postWindow-ready", () => {
  postWindow.webContents.send("getTokens", store.get("accounts"))
})
ipcMain.on("postWindow-posted", () => {
  postWindow.hide()
})

ipcMain.on("preferenceWindowReady", () => {
  preferenceWindow.webContents.send("getTokens", store.get("accounts"))
})

// ログイン認証
ipcMain.on("authenticate", () => {
  openAuthWindow()
})
ipcMain.on("tokenRefresh", () => {
  if (postWindow !== null) postWindow.webContents.send("getTokens")
  if (preferenceWindow !== null) preferenceWindow.webContents.send("getTokens")
})
