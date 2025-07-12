import { ipcMain} from "electron";
import Store from "electron-store";


const schema = {
  theme: {
    type: "string",
    enum: ["light", "dark", "grey"],
    default: 'light'
  },
  appLanguage: { 
    type: "string",
    default: 'en'
  },
  workingDirectory: {
    type: "string",
    default: ""
  },
  platform: {
    type: "string",
    enum: ["darwin", "win32"],
    default: process.platform
  },
  window: {
    type: "object",
    properties: {
      width: { 
        type: "number",
        default: 800
      },
      height: { 
        type: "number",
        default: 600
      },
      isMaximized: { 
        type: "boolean",
        default: false
      },
      leftPanelWidth: { 
        type: "number",
        default: 200
      },
      rightPanelWidth: { 
        type: "number",
        default: 200
      }
    }
  },
  openai: {
    type: "object",
    properties: {
      apiKey: { 
        type: "string",
        default: ''
      },
      apiModel: { 
        type: "string",
        default: ''
      },
      apiUrl: { 
        type: "string",
        default: ''
      },
      apiUrlPath: { 
        type: "string",
        default: ''
      },
      targetLanguage: { 
        type: "string",
        default: ''
      }
    }
  }
};

const store = new Store({ schema });

function getSetting(key: string){
  return store.get(key);
}

function registerSettingIPC(){
  ipcMain.handle('get-setting', async () => {
    return store.get('setting');
  })
  ipcMain.handle('set-setting', async (event, setting) => {
    store.set('setting', setting);
  })  
  ipcMain.handle('get-all-settings', async () => {
    return store.store;
  })
}

export { getSetting, registerSettingIPC };