import { ipcRenderer, contextBridge } from 'electron'
import { RequestOptions } from '@sharedTypes/network'


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
  },
  createFile: async (fileName: string) => {
    return await ipcRenderer.invoke('create-file', fileName)
  },
  getFileContent: async (filePath: string) => {
    return await ipcRenderer.invoke('get-file-content', filePath)
  },
  saveFile: async (filePath: string, content: string) => {
    return await ipcRenderer.invoke('save-file', filePath, content)
  }
}

const networkManager = {
  request: async (url: string, options: RequestOptions) => {
    return await ipcRenderer.invoke('network-request', url, options)
  }
}

contextBridge.exposeInMainWorld('settings', setting)
contextBridge.exposeInMainWorld('fileManager', fileManager)
contextBridge.exposeInMainWorld('networkManager', networkManager)
