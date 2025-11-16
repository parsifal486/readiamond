import { autoUpdater } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';

// Configure auto-updater
export function initAutoUpdater(mainWindow: BrowserWindow) {
  // configure logger
  autoUpdater.logger = require('electron-log');
  (autoUpdater.logger as unknown as { transports: { file: { level: string } } }).transports.file.level = 'info';

  // disable auto-update in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('🚧 Development mode: Auto-update disabled');
    return;
  }

  // disable auto-download
  autoUpdater.autoDownload = false;

  // disable downgrade
  autoUpdater.allowDowngrade = false;

  // check for updates
  autoUpdater.on('checking-for-update', () => {
    console.log('🔍 Checking for updates...');
    mainWindow.webContents.send('update-status', {
      status: 'checking',
      message: 'Checking for updates...',
    });
  });

  // update available
  autoUpdater.on('update-available', info => {
    console.log('✅ Update available:', info.version);

    // send update information to renderer process
    mainWindow.webContents.send('update-status', {
      status: 'available',
      version: info.version,
      message: `New version ${info.version} is available`,
    });

    // show dialog to ask user if they want to download the update
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Available',
        message: `A new version (${info.version}) is available. Do you want to download it now?`,
        buttons: ['Download', 'Later'],
        defaultId: 0,
        cancelId: 1,
      })
      .then(result => {
        if (result.response === 0) {
          // user wants to download the update
          autoUpdater.downloadUpdate();
        }
      });
  });

  // no update available
  autoUpdater.on('update-not-available', () => {
    console.log('ℹ️ No updates available');
    mainWindow.webContents.send('update-status', {
      status: 'not-available',
      message: 'You are using the latest version',
    });
  });

  // download progress
  autoUpdater.on('download-progress', progressObj => {
    const logMessage = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
    console.log(logMessage);

    // send download progress to renderer process
    mainWindow.webContents.send('update-status', {
      status: 'downloading',
      progress: progressObj.percent.toFixed(2),
      message: `Downloading update... ${progressObj.percent.toFixed(2)}%`,
    });
  });

  // download completed
  autoUpdater.on('update-downloaded', info => {
    console.log('✅ Update downloaded');

    mainWindow.webContents.send('update-status', {
      status: 'downloaded',
      version: info.version,
      message: 'Update downloaded',
    });

    // show dialog to ask user if they want to install the update immediately
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Update Ready',
        message:
          'Update downloaded. The application will restart to install the update.',
        buttons: ['Restart Now', 'Later'],
        defaultId: 0,
        cancelId: 1,
      })
      .then(result => {
        if (result.response === 0) {
          // quit and install the update
          setImmediate(() => autoUpdater.quitAndInstall());
        }
      });
  });

  // update error
  autoUpdater.on('error', err => {
    console.error('❌ Update error:', err);
    mainWindow.webContents.send('update-status', {
      status: 'error',
      message: `Update error: ${err.message}`,
    });
  });

  // check for updates when application starts (delay 3 seconds to avoid affecting startup speed)
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 3000);
}

// manually check for updates (can be bound to menu items)
export function checkForUpdatesManually() {
  autoUpdater.checkForUpdates();
}
