import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '@sharedTypes/setting';

const initialState = {
  theme: 'light' as 'light' | 'dark',
  appLanguage: 'en' as string,
  foreignLanguage: 'zh' as string,
  workingDirectory: '' as string,
  platform: 'darwin' as 'darwin' | 'win32',
  dictionary: {
    youdaoEnabled: true as boolean,
    cambridgeEnabled: true as boolean,
  },
  translationEngine: 'youdao' as 'youdao' | 'none',
  network: {
    enableProxy: false as boolean,
    serverPort: 3000 as number,
  },
  display: {
    dashboardPageSize: 10 as number,
    readingPageSize: 10 as number,
  },
  window: {
    width: 800 as number,
    height: 600 as number,
    isMaximized: false as boolean,
    leftPanelWidth: 200 as number,
    rightPanelWidth: 200 as number,
  },
  openai: {
    apiKey: '' as string,
    apiModel: '' as string,
    apiUrl: '' as string,
    apiUrlPath: '' as string,
    targetLanguage: 'zh' as string,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    //load settings from electron-store
    loadSettings: (state: AppSettings, action: PayloadAction<AppSettings>) => {
      Object.assign(state, action.payload);
    },

    //update specific setting value by path like "network.serverPort"
    updateSetting: (
      state,
      action: PayloadAction<{ path: string; value: unknown }>
    ) => {
      const { path, value } = action.payload;
      const keys = path.split('.');

      if (keys.length === 1) {
        (state as any)[keys[0]] = value;
      } else if (keys.length === 2) {
        (state as any)[keys[0]] = {
          ...(state as any)[keys[0]],
          [keys[1]]: value,
        };
      }
    },
  },
});

export const { loadSettings, updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
