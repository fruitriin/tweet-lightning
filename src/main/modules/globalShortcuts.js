import { postWindow } from "./windows"
const { app, globalShortcut } = require("electron")

app.whenReady().then(() => {
  // 'CommandOrControl+X' ショートカットのリスナーを登録します。
  globalShortcut.register("CmdOrCtrl+Shift+Alt+N", () => {
    postWindow.webContents.send("show")
    postWindow.show()
  })
})

app.on("will-quit", () => {
  // すべてのショートカットを登録解除します。
  globalShortcut.unregisterAll()
})
