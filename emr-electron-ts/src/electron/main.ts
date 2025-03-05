// import { app, BrowserWindow, ipcMain } from 'electron';
// import * as path from 'path';
// import sqlite3 from 'sqlite3';
// import axios from 'axios';

// const db = new sqlite3.Database('emr_local.db');

// db.serialize(() => {
//   db.run(`
//     CREATE TABLE IF NOT EXISTS patients (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       hospital_id INTEGER,
//       name TEXT,
//       dob TEXT,
//       medical_id TEXT,
//       synced INTEGER DEFAULT 0
//     )
//   `);
// });

// const API_URL = 'https://emr-api.herokuapp.com/api/';
// let token: string | null = null;

// let mainWindow: BrowserWindow | null = null;


// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js')
//     }
//   });

//   // Check if we're in a packaged app or development
//   const isDev = process.argv.includes('--dev') || 
//                 process.mainModule?.filename.includes('app.asar') === false;

//   if (isDev) {
//     console.log('Running in development mode');
//     mainWindow.loadURL('http://localhost:3000');
//     mainWindow.webContents.openDevTools();
//   } else {
//     console.log('Running in production mode');
//     mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
//   }
// }

// // IPC Handlers (unchanged)
// ipcMain.handle('get-patients', async () => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM patients', (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });
// });

// ipcMain.handle('add-patient', async (event, patient: { hospital_id: number; name: string; dob: string; medical_id: string }) => {
//   return new Promise((resolve, reject) => {
//     db.run(
//       'INSERT INTO patients (hospital_id, name, dob, medical_id, synced) VALUES (?, ?, ?, ?, 0)',
//       [patient.hospital_id, patient.name, patient.dob, patient.medical_id],
//       function (err) {
//         if (err) reject(err);
//         else resolve(this.lastID);
//       }
//     );
//   });
// });

// ipcMain.handle('sync-patients', async (event, hospitalId: number) => {
//   const unsynced = await new Promise<any[]>((resolve, reject) => {
//     db.all('SELECT * FROM patients WHERE synced = 0', (err, rows) => {
//       if (err) reject(err);
//       else resolve(rows);
//     });
//   });

//   for (const patient of unsynced) {
//     try {
//       const response = await axios.post(`${API_URL}patients/`, {
//         hospital: patient.hospital_id,
//         name: patient.name,
//         dob: patient.dob,
//         medical_id: patient.medical_id,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       db.run('UPDATE patients SET synced = 1, id = ? WHERE id = ?', [response.data.id, patient.id]);
//     } catch (e) {
//       console.error('Sync failed:', e);
//     }
//   }

//   try {
//     const response = await axios.get(`${API_URL}patients/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     response.data.forEach((patient: any) => {
//       db.run(`
//         INSERT OR REPLACE INTO patients (id, hospital_id, name, dob, medical_id, synced)
//         VALUES (?, ?, ?, ?, ?, 1)
//       `, [patient.id, patient.hospital, patient.name, patient.dob, patient.medical_id]);
//     });
//   } catch (e) {
//     console.error('Pull failed:', e);
//   }
// });

// ipcMain.on('set-token', (event, newToken: string) => {
//   token = newToken;
// });

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

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