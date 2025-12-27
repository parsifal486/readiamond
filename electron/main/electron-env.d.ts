/// <reference types="vite-plugin-electron/electron-env" />
import {
  NetResponse,
  NetFetchOps,
  UpdateStatus,
  UpdateStatus,
} from '@sharedTypes/network';
import { AppSettings } from '@sharedTypes/settings';
import { File } from '@sharedTypes/fileOperat';

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
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    settings: {
      getSetting: () => Promise<string>;
      setSetting: (key: string, value: unknown) => Promise<void>;
      getAllSettings: () => Promise<AppSettings>;
      openDialog: (options: { properties: string[] }) => Promise<string[]>;
    };
    fileManager: {
      getFileContentTable: () => Promise<File[]>;
      createFile: (fileName: string) => Promise<File | null>;
      getFileContent: (filePath: string) => Promise<string>;
      saveFile: (filePath: string, content: string) => Promise<boolean>;
      deleteFile: (filePath: string) => Promise<boolean>;
      renameFile: (
        oldPath: string,
        newFileName: string
      ) => Promise<File | null>;
    };
    netClient: {
      netFetch: (url: string, options: NetFetchOps) => Promise<NetResponse>;
    };
    updater: {
      onUpdateStatus: (callback: (status: UpdateStatus) => void) => void;
      removeUpdateStatusListener: () => void;
    };
    windowControl: {
      minimize: () => void;
      maximize: () => void;
      restore: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximize: (callback: () => void) => void;
      onUnmaximize: (callback: () => void) => void;
      removeMaximizeListeners: () => void;
    };
  }
}
