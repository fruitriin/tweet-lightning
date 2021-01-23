import { store } from "./store"
const { BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const auth = require("oauth-electron-twitter")

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

  mainWindow.loadURL(winURL + "#post")

  // 閉じるボタンでウィンドウを非表示
  mainWindow.on("close", (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

let preferenceWindow = null
// 設定画面を開く
function openPreference() {
  preferenceWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  })
  preferenceWindow.loadURL(winURL + "#preference")
}

function openAuthWindow() {
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
      accounts[0] = res
      store.set("accounts", accounts)
      ipcMain.send("tokenRefresh")
      authWindow.close()
    })
    .catch((err) => {
      console.log("err" + JSON.stringify(err))
    })
}

export {
  mainWindow,
  preferenceWindow,
  createWindow,
  openPreference,
  openAuthWindow,
}
