import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import sqlite3 from 'sqlite3';
import axios from 'axios';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Dynamic environment detection
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
      .catch(console.error);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'))
      .catch(console.error);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Basic IPC Handlers
ipcMain.handle('get-patients', async () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('emr_local.db');
    db.all('SELECT * FROM patients', (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('add-patient', async (event, patient) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('emr_local.db');
    db.run(
      'INSERT INTO patients (hospital_id, name, dob, medical_id, synced) VALUES (?, ?, ?, ?, 0)', 
      [patient.hospital_id, patient.name, patient.dob, patient.medical_id],
      function(err) {
        db.close();
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
});

ipcMain.on('set-token', (event, token) => {
  // Token management logic
  console.log('Token set:', token);
});