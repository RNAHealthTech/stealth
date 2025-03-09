import React from "react";

const EMRSettings: React.FC = () => {
    return (
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
    )
};

export default EMRSettings;