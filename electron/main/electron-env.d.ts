/// <reference types="vite-plugin-electron/electron-env" />
import { AppSettings } from "@sharedTypes/settings"

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {  
    settings: {
      getSetting: () => Promise<string>
      setSetting: (setting: string) => Promise<void>
      getAllSettings: () => Promise<AppSettings>
    },
    fileManager:{
      getFileContentTable: () => Promise<FileContentTable>
      createFile: (fileName: string) => Promise<FileContentTable>
      getFileContent: (filePath: string) => Promise<string>
      saveFile: (filePath: string, content: string) => Promise<boolean>
    }
  }
}
