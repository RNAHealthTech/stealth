import React, { useState, useEffect } from 'react';
import { Patient } from './types/patient';
import EMRDashboard from './dashboard/Dashboard';
import { BrowserRouter as  Router } from 'react-router-dom';

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

    useEffect(() => {
        console.log('Window.electronAPI:', window.electronAPI); // Debug
        if (!window.electronAPI) {
            console.error('Electron API not available');
            return;
        }

        // Set authentication token
        window.electronAPI.setToken('your-jwt-token');

        // Initial sync with backend
        window.electronAPI.syncPatients(1).catch(console.error);
    }, []);

    if (!window.electronAPI) {
        return <div className="p-6 text-red-600 font-medium">
            Error: Electron API not loaded. Please ensure the app is running in Electron.
        </div>;
    }

    return (
        <Router>
            <EMRDashboard />
        </Router>

    );
};

export default App;