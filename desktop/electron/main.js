// Application Windows (Electron) — fenêtre dédiée vers la plateforme en ligne.
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

// URL de la plateforme hébergée. Modifiez ici OU définissez la variable d'env APP_URL.
const APP_URL = process.env.APP_URL || 'https://academie-compta-fr.mg';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    autoHideMenuBar: true,
    title: 'Académie Compta FR — MG CONSULTING IT&ACT',
    icon: path.join(__dirname, 'app.ico'),
    webPreferences: { contextIsolation: true, nodeIntegration: false }
  });
  win.loadURL(APP_URL);
  // Les liens externes (WhatsApp, sources...) s'ouvrent dans le navigateur
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
