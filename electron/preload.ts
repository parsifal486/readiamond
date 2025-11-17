import { ipcRenderer, contextBridge } from 'electron';
import { NetFetchOps, NetResponse, UpdateStatus } from '@sharedTypes/network';

const setting = {
  getSetting: async () => {
    return await ipcRenderer.invoke('get-setting');
  },
  setSetting: async (key: string, value: string) => {
    return await ipcRenderer.invoke('set-setting', key, value);
  },
  getAllSettings: async () => {
    return await ipcRenderer.invoke('get-all-settings');
  },
};

const fileManager = {
  getFileContentTable: async () => {
    return await ipcRenderer.invoke('get-file-content-table');
  },
  createFile: async (fileName: string) => {
    return await ipcRenderer.invoke('create-file', fileName);
  },
  getFileContent: async (filePath: string) => {
    return await ipcRenderer.invoke('get-file-content', filePath);
  },
  saveFile: async (filePath: string, content: string) => {
    return await ipcRenderer.invoke('save-file', filePath, content);
  },
  deleteFile: async (filePath: string) => {
    return await ipcRenderer.invoke('delete-file', filePath);
  },
};

const netClient = {
  netFetch: async (url: string, options: NetFetchOps) => {
    return (await ipcRenderer.invoke('net-fetch', url, options)) as NetResponse;
  },
};

const updater = {
  onUpdateStatus: (callback: (status: UpdateStatus) => void) => {
    ipcRenderer.on('update-status', (_event, status) => {
      callback(status);
    });
  },
  removeUpdateStatusListener: () => {
    ipcRenderer.removeAllListeners('update-status');
  },
};

contextBridge.exposeInMainWorld('settings', setting);
contextBridge.exposeInMainWorld('fileManager', fileManager);
contextBridge.exposeInMainWorld('netClient', netClient);
contextBridge.exposeInMainWorld('updater', updater);
