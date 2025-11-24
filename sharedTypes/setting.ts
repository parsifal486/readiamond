type AppSettings = {
  theme: 'light' | 'dark'; // Theme can be either 'light' or 'dark'
  appLanguage: string; // Application language (e.g., 'en', 'zh')
  foreignLanguage: string; // Foreign language (e.g., 'en', 'zh')
  platform: 'darwin' | 'win32'; // Platform can be either 'darwin' or 'win32'

  dictionary: {
    youdaoEnabled: boolean;
    cambridgeEnabled: boolean;
  };
  translationEngine: 'youdao' | 'none';
  network: {
    serverPort: number;
  };
  display: {
    dashboardPageSize: number;
    readingPageSize: number;
  };
  window: {
    width: number;
    height: number;
    isMaximized: boolean;
    leftPanelWidth: number;
    rightPanelWidth: number;
  };
  openai: {
    apiKey: string;
    apiModel: string;
    apiUrl: string;
    apiUrlPath: string;
    targetLanguage: string;
  };
};

export type { AppSettings };
