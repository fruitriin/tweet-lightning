"use strict"

import { app, Menu } from "electron"
import { createPostWindow, postWindow, openPreference } from "./modules/windows"
import { store } from "~/modules/store"
import { machineIdSync } from "node-machine-id"
require("./modules/events")
require("./modules/tray")
require("./modules/globalShortcuts")
require("dotenv").config()

const Nucleus = require("nucleus-nodejs")
Nucleus.init("60258c87bcf16266e1db001d", { disableInDev: true })
Nucleus.setUserId(machineIdSync())

app.on("ready", () => {
  Nucleus.setProps({
    version: process.env.npm_package_version || app.getVersion(),
  })
  Nucleus.appStarted()

  const accounts = store.get("accounts") || []
  if (accounts.length > 0) {
    createPostWindow()
  } else {
    createPostWindow()
    openPreference()
  }
})

app.on("activate", () => {
  if (postWindow === null) {
    createPostWindow()
  }
})

const isMac = process.platform === "darwin"

const template = [
  {
    label: app.name,
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { role: "selectAll" },
    ],
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(isMac ? menu : null)
