"use strict"

import { app, ipcMain, BrowserWindow, Tray, Menu } from "electron"
require("dotenv").config()
const Store = require("electron-store")
const store = new Store()
const auth = require("oauth-electron-twitter")
const path = require("path")
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = path.join(__dirname, "/static").replace(/\\/g, "\\\\")
}

let mainWindow
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : path.resolve("file://", __dirname, "/index.html")

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 300,
    height: 200,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(winURL)

  // 閉じるボタンでウィンドウを非表示
  mainWindow.on("close", (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// 設定画面を開く
function openPreference() {
  const winPreference = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })
  winPreference.loadURL(winURL + "#preference")
}
// ElectronReady
app.on("ready", () => {
  createWindow()
  const tray = new Tray("static/hoge.png")
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "投稿",
      click: () => {
        mainWindow.show()
      },
    },
    {
      label: "設定",
      click: () => {
        openPreference()
      },
    },
    { label: "終了", click: () => app.quite() },
  ])
  tray.setToolTip("This is my application.")
  tray.setContextMenu(contextMenu)
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Vueがスタンバイできたら
ipcMain.on("ready", () => {
  const accounts = store.get("accounts")
  // トークン更新
  mainWindow.webContents.send("tokens", accounts)
})

// ログイン認証
ipcMain.on("perform-action", () => {
  const info = {
    key: process.env.consumer_key,
    secret: process.env.consumer_secret,
  }

  const authWindow = new BrowserWindow()
  authWindow.webContents.session.clearCache()
  authWindow.webContents.session.clearStorageData()
  auth
    .login(info, authWindow)
    .then((res) => {
      const accounts = store.get("accounts") || []
      // スクリーンネームで重複チェックがいるかも
      accounts.push(res)
      store.set("accounts", accounts)
      authWindow.close()
    })
    .catch((err) => {
      console.log("err" + JSON.stringify(err))
    })
})

// メニューバー無効化
// Menu.setApplicationMenu(null)

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
