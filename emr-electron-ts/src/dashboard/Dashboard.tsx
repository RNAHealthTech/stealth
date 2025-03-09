import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ChevronDown, Menu, Users, FileText, Settings, BarChart2, Lock, LogOut } from 'lucide-react';
import { Patient } from 'types/patient';
import PatientManagement from './PatientManagement';
import UserManagement from './UserManagement';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    sidebarOpen: boolean;
    badge?: number;
}

interface DashboardCardProps {
    title: string;
    value: number | string;
    color: 'blue' | 'green' | 'amber' | 'purple';
}

interface PatientListItemProps {
    name: string;
    id: string;
    lastVisit: string;
    status: 'Active' | 'Inactive';
}

interface DashboardContentProps {
    patientCount: number;
    pendingPrescriptions: number;
}

interface ElectronAPI {
    getPatients: () => Promise<Patient[]>;
}
 

// Mock authentication state
const EMRDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [patientCount, setPatientCount] = useState<number>(0);
    const [pendingPrescriptions, setPendingPrescriptions] = useState(0);

    useEffect(() => {
        // Fetch dashboard data
        const fetchDashboardData = async () => {
            if (window.electronAPI) {
                try {
                    const patients = await window.electronAPI.getPatients();
                    setPatientCount(patients.length);
                    // Count pending prescriptions (would be implemented in a real system)
                    setPendingPrescriptions(5);
                } catch (error) {
                    console.error('Failed to fetch dashboard data:', error);
                }
            }
        };

        fetchDashboardData();
    }, []);

    // Mock logout function
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-black to-purple-800 text-white transition-all duration-300 flex flex-col`}>
                <div className="p-4 flex items-center justify-between border-b border-white">
                    <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>RnaEMR</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 rounded-md hover:bg-indigo-700"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 mt-6">
                    <NavItem
                        icon={<BarChart2 size={20} />}
                        label="Dashboard"
                        isActive={activePage === 'dashboard'}
                        onClick={() => setActivePage('dashboard')}
                        sidebarOpen={sidebarOpen}
                        badge={0}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Patients"
                        isActive={activePage === 'patients'}
                        onClick={() => setActivePage('patients')}
                        sidebarOpen={sidebarOpen}
                        badge={0}
                    />
                    <NavItem
                        icon={<FileText size={20} />}
                        label="Prescriptions"
                        isActive={activePage === 'prescriptions'}
                        onClick={() => setActivePage('prescriptions')}
                        sidebarOpen={sidebarOpen}
                        badge={pendingPrescriptions}
                    />
                    <NavItem
                        icon={<Lock size={20} />}
                        label="User Management"
                        isActive={activePage === 'users'}
                        onClick={() => setActivePage('users')}
                        sidebarOpen={sidebarOpen}
                        badge={0}
                    />
                    <NavItem
                        icon={<Settings size={20} />}
                        label="Settings"
                        isActive={activePage === 'settings'}
                        onClick={() => setActivePage('settings')}
                        sidebarOpen={sidebarOpen}
                        badge={1}
                    />
                </nav>

                <div className="p-4 border-t border-indigo-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-indigo-200 hover:text-white w-full"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {activePage === 'dashboard' && 'Dashboard'}
                            {activePage === 'patients' && 'Patient Management'}
                            {activePage === 'prescriptions' && 'Prescription Management'}
                            {activePage === 'users' && 'User Management'}
                            {activePage === 'settings' && 'EMRSettings'}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600">
                                    <span>Dr. Setu Gupta</span>
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-auto p-6">
                    {activePage === 'dashboard' && <DashboardContent patientCount={patientCount} pendingPrescriptions={pendingPrescriptions} />}
                    {activePage === 'patients' && <PatientManagement />}
                    {activePage === 'prescriptions' && <PrescriptionManagement />}
                    {activePage === 'users' && <UserManagement />}
                    {activePage === 'settings' && <EMRSettings />}
                </main>
            </div>
        </div>
    );
};

// Navigation Item Component
const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, sidebarOpen, badge }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full p-3 ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'} transition-colors`}
    >
        <div className="flex items-center justify-center">
            {icon}
        </div>
        {sidebarOpen && (
            <div className="ml-3 flex items-center justify-between w-full">
                <span>{label}</span>
                {badge && badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {badge}
                    </span>
                )}
            </div>
        )}
    </button>
);

// Dashboard Content
const DashboardContent:React.FC<DashboardContentProps> = ({ patientCount, pendingPrescriptions }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Patients" value={patientCount} color="blue" />
            <DashboardCard title="Pending Prescriptions" value={pendingPrescriptions} color="amber" />
            <DashboardCard title="Today's Appointments" value={8} color="green" />
            <DashboardCard title="Sync Status" value="Complete" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Patients</h3>
                <div className="space-y-3">
                    <PatientListItem name="Sarah Johnson" id="MID-3872" lastVisit="Today" status="Active" />
                    <PatientListItem name="Michael Chen" id="MID-3865" lastVisit="Yesterday" status="Active" />
                    <PatientListItem name="Emily Rodriguez" id="MID-3860" lastVisit="Mar 5, 2025" status="Active" />
                    <PatientListItem name="James Wilson" id="MID-3854" lastVisit="Mar 3, 2025" status="Inactive" />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">SmartPen Status</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Device Status</span>
                        <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Battery Level</span>
                        <span className="text-amber-600 font-medium">72%</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Sync</span>
                        <span className="text-gray-800 font-medium">Today, 10:45 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pending Transcriptions</span>
                        <span className="text-gray-800 font-medium">2</span>
                    </div>
                    <button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                        Open SmartPen Dashboard
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Dashboard Card Component
const DashboardCard:React.FC<DashboardCardProps> = ({ title, value, color }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        amber: 'bg-amber-100 text-amber-800',
        purple: 'bg-purple-100 text-purple-800'
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className="mt-2 flex items-center">
                <div className={`${colorClasses[color]} rounded-md px-3 py-1`}>
                    <span className="text-2xl font-bold">{value}</span>
                </div>
            </div>
        </div>
    );
};

// Patient List Item Component
const PatientListItem: React.FC<PatientListItemProps> = ({ name, id, lastVisit, status }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
        <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-gray-500">{id}</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-gray-600">Last visit: {lastVisit}</p>
            <p className={`text-sm ${status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
                {status}
            </p>
        </div>
    </div>
);


const PrescriptionManagement = () => (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Prescription Management</h3>
            <div className="flex justify-between mb-6">
                <div className="flex space-x-2">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                        New Prescription
                    </button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                        Import from SmartPen
                    </button>
                </div>
                <div>
                    <select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>All Prescriptions</option>
                        <option>Pending</option>
                        <option>Completed</option>
                        <option>Rejected</option>
                    </select>
                </div>
            </div>
            {/* Prescription table would go here */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">SmartPen Integration</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-500 mb-4">Drop prescription scans here or connect SmartPen</p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                        Connect SmartPen
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Validation Status</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Drug Database</span>
                        <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Dosage Verification</span>
                        <span className="text-green-600 font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pharmacy Network</span>
                        <span className="text-green-600 font-medium">Online</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const EMRSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Two-Factor Authentication</span>
                    <span className="text-green-600 font-medium">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Session Timeout</span>
                    <span className="text-gray-800 font-medium">30 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Data Encryption</span>
                    <span className="text-green-600 font-medium">AES-256</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Security Audit</span>
                    <span className="text-gray-800 font-medium">Feb 28, 2025</span>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Sync Settings</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto-Sync Enabled</span>
                    <span className="text-green-600 font-medium">Yes</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sync Frequency</span>
                    <span className="text-gray-800 font-medium">Every 15 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Sync</span>
                    <span className="text-gray-800 font-medium">Today, 11:23 AM</span>
                </div>
                <button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                    Sync Now
                </button>
            </div>
        </div>
    </div>
);

export default EMRDashboard;