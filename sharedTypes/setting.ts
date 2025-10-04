

type AppSettings = {
  theme: 'light' | 'dark'   // Theme can be either 'light' or 'dark'
  appLanguage: string // Application language (e.g., 'en', 'zh')
  platform: string // Platform can be either 'darwin' or 'win32'
  window: {
    width: number
    height: number
    isMaximized: boolean
    leftPanelWidth: number
    rightPanelWidth: number
  }
  openai: {
    apiKey: string
    apiModel: string
    apiUrl: string
    apiUrlPath: string
    targetLanguage: string
  }
}




export type {   AppSettings }

