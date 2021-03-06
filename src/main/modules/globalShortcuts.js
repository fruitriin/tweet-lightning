import { accounts } from "~/modules/store"
import { postWindow } from "~/modules/windows"
const { app, globalShortcut } = require("electron")

app.whenReady().then(() => {
  setPostShortcut()
})

export function setPostShortcut() {
  globalShortcut.unregisterAll()
  // accounts[n]shortcut のオブジェクトからキーコンビネーションを生成
  accounts.get().forEach((acc, index) => {
    if (acc.shortcut.key !== "") {
      const keys = []
      Object.keys(acc.shortcut).forEach((key) => {
        if (acc.shortcut[key] === true) keys.push(key)
      })

      const keyCombination = keys.join("+") + "+" + acc.shortcut.key
      globalShortcut.register(keyCombination, () => {
        postWindow.webContents.send("show", index)
        postWindow.show()
      })
    }
  })
}

app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})
