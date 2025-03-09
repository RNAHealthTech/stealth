import React from "react";

const PrescriptionManagement: React.FC = () => {
    return (
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
)
};

export default  PrescriptionManagement 