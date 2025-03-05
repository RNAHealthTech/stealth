"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database('emr_local.db');
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY, 
        hospital_id INTEGER, 
        name TEXT, 
        dob TEXT,
        medical_id TEXT, 
        synced INTEGER DEFAULT 0 
        )`);
});
exports.default = db;
