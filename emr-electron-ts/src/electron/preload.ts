import { contextBridge, ipcRenderer } from 'electron';
import { Patient } from '../types/patient';

contextBridge.exposeInMainWorld('electronAPI', {
  getPatients: () => ipcRenderer.invoke('get-patients'),
  addPatient: (patient: { hospital_id: number; name: string; dob: string; medical_id: string }) => 
    ipcRenderer.invoke('add-patient', patient),
  syncPatients: (hospitalId: number) => ipcRenderer.invoke('sync-patients', hospitalId),
  setToken: (token: string) => ipcRenderer.send('set-token', token)
});