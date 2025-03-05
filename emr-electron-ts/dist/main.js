"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const axios_1 = __importDefault(require("axios"));
const db = new sqlite3_1.default.Database('emr_local.db');
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospital_id INTEGER,
      name TEXT,
      dob TEXT,
      medical_id TEXT,
      synced INTEGER DEFAULT 0
    )
  `);
});
const API_URL = 'https://emr-api.herokuapp.com/api/';
let token = null;
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // Ensure this matches compiled output
        },
    });
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools(); // Open DevTools to debug
    }
    else {
        win.loadFile(path.join(__dirname, '../../public/index.html'));
    }
}
// IPC Handlers (unchanged)
electron_1.ipcMain.handle('get-patients', () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients', (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}));
electron_1.ipcMain.handle('add-patient', (event, patient) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO patients (hospital_id, name, dob, medical_id, synced) VALUES (?, ?, ?, ?, 0)', [patient.hospital_id, patient.name, patient.dob, patient.medical_id], function (err) {
            if (err)
                reject(err);
            else
                resolve(this.lastID);
        });
    });
}));
electron_1.ipcMain.handle('sync-patients', (event, hospitalId) => __awaiter(void 0, void 0, void 0, function* () {
    const unsynced = yield new Promise((resolve, reject) => {
        db.all('SELECT * FROM patients WHERE synced = 0', (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
    for (const patient of unsynced) {
        try {
            const response = yield axios_1.default.post(`${API_URL}patients/`, {
                hospital: patient.hospital_id,
                name: patient.name,
                dob: patient.dob,
                medical_id: patient.medical_id,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            db.run('UPDATE patients SET synced = 1, id = ? WHERE id = ?', [response.data.id, patient.id]);
        }
        catch (e) {
            console.error('Sync failed:', e);
        }
    }
    try {
        const response = yield axios_1.default.get(`${API_URL}patients/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        response.data.forEach((patient) => {
            db.run(`
        INSERT OR REPLACE INTO patients (id, hospital_id, name, dob, medical_id, synced)
        VALUES (?, ?, ?, ?, ?, 1)
      `, [patient.id, patient.hospital, patient.name, patient.dob, patient.medical_id]);
        });
    }
    catch (e) {
        console.error('Pull failed:', e);
    }
}));
electron_1.ipcMain.on('set-token', (event, newToken) => {
    token = newToken;
});
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
