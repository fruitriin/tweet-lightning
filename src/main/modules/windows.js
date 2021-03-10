import { store, preference } from "~/modules/store"
import { constants } from "~/modules/constants"
import Twitter from "twitter-lite"
const { app, dialog, BrowserWindow } = require("electron")
const path = require("path")
const auth = require("oauth-electron-twitter")

const windows = []
let postWindow = null
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : path.join("file://", __dirname, "/index.html")
let __static = "static"
if (process.env.NODE_ENV !== "development") {
  __static = path.join(__dirname, "/static").replace(/\\/g, "\\\\")
}
function createPostWindow() {
  postWindow = new BrowserWindow({
    useContentSize: true,
    width: constants.POST_WINDOW_INIT_WIDTH,
    height: constants.POST_WINDOW_INIT_HEIGHT,
    skipTaskbar: true,
    alwaysOnTop: preference.get().alwaysOnTop,
    show: false,
    icon: __static + "/tray@2x.png",
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
    icon: __static + "/tray@2x.png",
    webPreferences: {
      nodeIntegration: true,
    },
  })
  preferenceWindow.loadURL(winURL + "#preference")
  windows.push(preferenceWindow)

  // アカウント認証されずにウィンドウを閉じられたらダイアログを出す
  preferenceWindow.on("close", (e) => {
    const accounts = store.get("accounts") || []
    if (accounts.length === 0) {
      const selected = dialog.showMessageBoxSync(preferenceWindow, {
        type: "question",
        buttons: ["Yes", "No"],
        message: "アカウントが一つも認証されていません。終了しますか？",
      })
      if (selected === 1) {
        e.preventDefault()
      } else {
        app.exit()
      }
    } else {
      preferenceWindow = null
    }
  })
}

function openAuthWindow() {
  const info = {
    key: process.env.consumer_key,
    secret: process.env.consumer_secret,
  }
  const authWindow = new BrowserWindow({ icon: __static + "/tray@2x.png" })
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

        let needPush = true
        for (const account of accounts) {
          if (account.user === res.user) {
            account.user = res.user
            needPush = false
          }
        }
        if (needPush) {
          res.shortcut = constants.shortcutDefault
          console.log(res)
          accounts.push(res)
        }

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
