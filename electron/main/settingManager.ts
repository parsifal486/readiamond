import { dialog, ipcMain, OpenDialogOptions } from 'electron';
import Store from 'electron-store';

const schema = {
  theme: {
    type: 'string',
    enum: ['light', 'dark'],
    default: 'light',
  },
  appLanguage: {
    type: 'string',
    default: 'en',
  },
  workingDirectory: {
    type: 'string',
    default: '',
  },
  foreignLanguage: {
    type: 'string',
    default: 'zh',
  },
  platform: {
    type: 'string',
    enum: ['darwin', 'win32'],
    default: process.platform,
  },
  dictionary: {
    type: 'object',
    properties: {
      youdaoEnabled: {
        type: 'boolean',
        default: true,
      },
      cambridgeEnabled: {
        type: 'boolean',
        default: true,
      },
    },
  },
  translationEngine: {
    type: 'string',
    enum: ['youdao', 'none'],
    default: 'youdao',
  },
  network: {
    type: 'object',
    properties: {
      enableProxy: {
        type: 'boolean',
        default: false,
      },
      serverPort: {
        type: 'number',
        default: 3000,
      },
    },
  },
  display: {
    type: 'object',
    properties: {
      dashboardPageSize: {
        type: 'number',
        default: 10,
      },
      readingPageSize: {
        type: 'number',
        default: 10,
      },
    },
  },
  window: {
    type: 'object',
    properties: {
      width: {
        type: 'number',
        default: 800,
      },
      height: {
        type: 'number',
        default: 600,
      },
      isMaximized: {
        type: 'boolean',
        default: false,
      },
      leftPanelWidth: {
        type: 'number',
        default: 200,
      },
      rightPanelWidth: {
        type: 'number',
        default: 200,
      },
    },
  },
  openai: {
    type: 'object',
    properties: {
      apiKey: {
        type: 'string',
        default: '',
      },
      apiModel: {
        type: 'string',
        default: '',
      },
      apiUrl: {
        type: 'string',
        default: '',
      },
      apiUrlPath: {
        type: 'string',
        default: '',
      },
      targetLanguage: {
        type: 'string',
        default: '',
      },
    },
  },
};

const store = new Store({ schema });

function getSetting(key: string) {
  return store.get(key);
}

function setSetting(key: string, value: unknown) {
  store.set(key, value);
}

async function openDialog(options: { properties: string[] }) {
  const result = await dialog.showOpenDialog({
    properties: options.properties as OpenDialogOptions['properties'],
  });
  return result.filePaths;
}

function registerSettingIPC() {
  ipcMain.handle('get-setting', async (_, key: string) => {
    return getSetting(key);
  });
  ipcMain.handle('set-setting', async (_, key: string, value: unknown) => {
    setSetting(key, value);
  });
  ipcMain.handle('get-all-settings', async () => {
    return store.store;
  });
  ipcMain.handle(
    'open-dialog',
    async (_, options: { properties: string[] }) => {
      return openDialog(options);
    }
  );
}

export { getSetting, setSetting, registerSettingIPC, openDialog };
