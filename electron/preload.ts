import { ipcRenderer, contextBridge } from 'electron'


const setting = {
  getSetting: async () => {
    return await ipcRenderer.invoke('get-setting')
  },
  setSetting: async (setting: string) => {
    return await ipcRenderer.invoke('set-setting', setting)
  },
  getAllSettings: async () => {
    return await ipcRenderer.invoke('get-all-settings')
  }
}

const fileManager = {
  getFileContentTable: async () => {
    return await ipcRenderer.invoke('get-file-content-table')
  }
}

contextBridge.exposeInMainWorld('settings', setting)
contextBridge.exposeInMainWorld('fileManager', fileManager)

