"use strict";
const electron = require("electron");
const setting = {
  getSetting: async () => {
    return await electron.ipcRenderer.invoke("get-setting");
  },
  setSetting: async (setting2) => {
    return await electron.ipcRenderer.invoke("set-setting", setting2);
  },
  getAllSettings: async () => {
    return await electron.ipcRenderer.invoke("get-all-settings");
  }
};
electron.contextBridge.exposeInMainWorld("settings", setting);
