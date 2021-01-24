import { postWindow, openPreference } from "./windows"
const { app, Menu, Tray } = require("electron")
const path = require("path")

let __static = "static"
if (process.env.NODE_ENV !== "development") {
  __static = path.join(__dirname, "/static").replace(/\\/g, "\\\\")
}
let tray = null
// ElectronReady
app.on("ready", () => {
  tray = new Tray(__static + "/256x256.png")
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
    { label: "終了", click: () => app.exit() },
  ])
  tray.setToolTip("This is my application.")
  tray.setContextMenu(contextMenu)
})
