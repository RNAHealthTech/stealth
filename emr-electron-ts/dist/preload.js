"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getPatients: () => electron_1.ipcRenderer.invoke('get-patients'),
    addPatient: (patient) => electron_1.ipcRenderer.invoke('add-patient', patient),
    syncPatients: (hospitalId) => electron_1.ipcRenderer.invoke('sync-patients', hospitalId),
    setToken: (token) => electron_1.ipcRenderer.send('set-token', token),
});
