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
const fileManager = {
  getFileContentTable: async () => {
    return await electron.ipcRenderer.invoke("get-file-content-table");
  }
};
electron.contextBridge.exposeInMainWorld("settings", setting);
electron.contextBridge.exposeInMainWorld("fileManager", fileManager);
