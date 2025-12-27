import { BrowserWindow, ipcMain } from 'electron';

class WindowsManager {
  private window: BrowserWindow | null;

  constructor() {
    this.window = null;
  }

  setWindow(window: BrowserWindow | null) {
    this.window = window;
    this.registerWindowEventListeners();
  }

  registerWindowEventListeners() {
    if (!this.window) return;

    // Register window event listeners after window is created
    this.window.on('maximize', () => {
      this.window?.webContents.send('window-maximized');
    });

    this.window.on('unmaximize', () => {
      this.window?.webContents.send('window-unmaximized');
    });
  }

  registerIPC() {
    ipcMain.handle('window-minimize', () => {
      if (this.window) {
        this.window.minimize();
      }
    });

    ipcMain.handle('window-maximize', () => {
      if (this.window) {
        this.window.maximize();
      }
    });

    ipcMain.handle('window-restore', () => {
      if (this.window) {
        this.window.restore();
      }
    });

    ipcMain.handle('window-close', () => {
      if (this.window) {
        this.window.close();
      }
    });

    ipcMain.handle('window-is-maximized', () => {
      return this.window ? this.window.isMaximized() : false;
    });
  }
}

const windowsManager = new WindowsManager();
export default windowsManager;
