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

export default store;


