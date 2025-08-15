import { app, BrowserWindow, session } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { registerSettingIPC } from './settingManager';
import fileManager from './fileManager';
import { networkManger } from './networkManger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC as string, 'readiamond.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 12, y: 10 },
    width: 1000,
    height: 700,
  });

  win.webContents.openDevTools();
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function registerIpcHandlers() {
  registerSettingIPC();
  networkManger.registerIPC();
  fileManager.registerIPC();
}

app.whenReady().then(() => {
  await configureProxy();

  registerIpcHandlers();
  createWindow();
});

async function configureProxy() {
  try {
    // 为 Clash 用户配置代理

    // 检查是否需要代理
    const useProxy = true; // 设置为 false 禁用代理
    const proxyUrl = 'http://127.0.0.1:7890'; // Clash 默认端口

    if (useProxy) {
      console.log(`🔗 Configuring proxy: ${proxyUrl}`);

      await session.defaultSession.setProxy({
        proxyRules: `http=${proxyUrl};https=${proxyUrl}`,
        proxyBypassRules: 'localhost,127.0.0.1,<local>',
      });

      console.log('✅ Proxy configured successfully');
    } else {
      console.log('🚫 Direct connection (no proxy)');
    }
  } catch (error) {
    console.error('❌ Failed to configure proxy:', error);
  }
}