import { postWindow, openPreference } from "./windows"
const { app, Menu, Tray } = require("electron")

let tray = null
// ElectronReady
app.on("ready", () => {
  tray = new Tray("static/256x256.png")
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "投稿",
      click: () => {
        postWindow.show()
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
