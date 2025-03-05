import React, { useState, useEffect } from 'react';
import { Patient } from './types/patient';

declare global {
  interface Window {
    electronAPI?: {
      getPatients: () => Promise<Patient[]>;
      addPatient: (patient: { hospital_id: number; name: string; dob: string; medical_id: string }) => Promise<number>;
      syncPatients: (hospitalId: number) => Promise<void>;
      setToken: (token: string) => void;
    };
  }
}

const App: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [medicalId, setMedicalId] = useState<string>('');

  useEffect(() => {
    console.log('Window.electronAPI:', window.electronAPI); // Debug
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return;
    }
    fetchLocalPatients();
    window.electronAPI.setToken('your-jwt-token');
    window.electronAPI.syncPatients(1).catch(console.error);
  }, []);

  const fetchLocalPatients = async (): Promise<void> => {
    if (!window.electronAPI) return;
    try {
      const patients = await window.electronAPI.getPatients();
      setPatients(patients);
    } catch (e) {
      console.error('Failed to fetch patients:', e);
    }
  };

  const addPatient = async (): Promise<void> => {
    if (!window.electronAPI) return;
    try {
      await window.electronAPI.addPatient({
        hospital_id: 1, // Replace with dynamic hospital_id
        name,
        dob,
        medical_id: medicalId,
      });
      fetchLocalPatients();
      window.electronAPI.syncPatients(1).catch(console.error);
      setName('');
      setDob('');
      setMedicalId('');
    } catch (e) {
      console.error('Failed to add patient:', e);
    }
  };

  if (!window.electronAPI) {
    return <div>Error: Electron API not loaded. Please ensure the app is running in Electron.</div>;
  }

  return (
    <div>
      <h1>EMR Desktop</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={dob} onChange={e => setDob(e.target.value)} placeholder="DOB (YYYY-MM-DD)" />
      <input value={medicalId} onChange={e => setMedicalId(e.target.value)} placeholder="Medical ID" />
      <button onClick={addPatient}>Add Patient</button>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>{patient.name} - {patient.medical_id} ({patient.synced ? 'Synced' : 'Pending'})</li>
        ))}
      </ul>
    </div>
  );
};

export default App;