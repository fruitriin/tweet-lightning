import { store } from "./store"
import Twitter from "twitter-lite"
const { BrowserWindow } = require("electron")
const path = require("path")
const auth = require("oauth-electron-twitter")

const windows = []
let postWindow
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : path.resolve("file://", __dirname, "/index.html")

function createPostWindow() {
  postWindow = new BrowserWindow({
    useContentSize: true,
    width: 300,
    height: 200,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  windows.push(postWindow)

  postWindow.loadURL(winURL + "#post")

  // 閉じるボタンでウィンドウを非表示
  postWindow.on("close", (e) => {
    e.preventDefault()
    postWindow.hide()
  })

  postWindow.on("closed", () => {
    postWindow = null
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
  windows.push(preferenceWindow)
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
      const client = new Twitter({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token_key: res.token,
        access_token_secret: res.tokenSecret,
      })
      client.get("account/verify_credentials").then((user) => {
        res.user = user.screen_name
        // TODO: マルチアカウント対応
        // TODO: スクリーンネームで重複チェックがいる
        accounts[0] = res
        store.set("accounts", accounts)
        for (const win of windows) {
          win.webContents.send("getTokens", accounts)
        }
      })

      authWindow.close()
    })
    .catch((err) => {
      console.log("err" + JSON.stringify(err))
    })
}

export {
  postWindow,
  preferenceWindow,
  createPostWindow,
  openPreference,
  openAuthWindow,
}
