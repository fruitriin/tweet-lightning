import { mainWindow, preferenceWindow, openAuthWindow } from "./windows"
import { store } from "./store"
const { ipcMain } = require("electron")

ipcMain.on("postWindow-ready", () => {
  mainWindow.webContents.send("getTokens", store.get("accounts"))
})
ipcMain.on("postWindow-posted", () => {
  mainWindow.hide()
})

ipcMain.on("preferenceWindowReady", () => {
  preferenceWindow.webContents.send("getTokens", store.get("accounts"))
})

// ログイン認証
ipcMain.on("authenticate", () => {
  openAuthWindow()
})
ipcMain.on("tokenRefresh", () => {
  if (mainWindow !== null) mainWindow.webContents.send("getTokens")
  if (preferenceWindow !== null) preferenceWindow.webContents.send("getTokens")
})
