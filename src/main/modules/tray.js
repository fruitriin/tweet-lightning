import { mainWindow, openPreference } from "./windows"
const { app, Menu, Tray } = require("electron")

function createTray() {
  const tray = new Tray("static/256x256.png")
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
  return tray
}

export { createTray }
