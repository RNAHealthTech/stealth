"use strict";
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
exports.syncPatients = syncPatients;
exports.setToken = setToken;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("./db"));
const API_URL = '';
let token = null;
function syncPatients(hospitalId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            db_1.default.all('SELECT * FROM patients WHERE synced = 0', (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                for (const patient of rows) {
                    try {
                        yield axios_1.default.post(`${API_URL}patients/`, {
                            hospital: patient.hospital_id,
                            name: patient.name,
                            dob: patient.dob,
                            medical_id: patient.medical_id,
                        }, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        db_1.default.run('UPDATE patients SET synced = 1 WHERE id = ?', patient.id);
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
                        db_1.default.run(`
            INSERT OR REPLACE INTO patients (id, hospital_id, name, dob, medical_id, synced)
            VALUES (?, ?, ?, ?, ?, 1)
          `, [patient.id, patient.hospital_id, patient.name, patient.dob, patient.medical_id]);
                    });
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            }));
        });
    });
}
function setToken(newToken) {
    token = newToken;
}
