import React from 'react';


const PatientManagement: React.FC = () => {
    
    const handlePatientAdd = () => {
        console.log('patient add button clicked!');
    }
    return (
    <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Search Patient</h3>
        <div className="flex justify-between mb-6">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <button onClick={handlePatientAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                Add New Patient
            </button>
        </div>
        {/* Patient table would go here */}
    </div>
    )
};

export default PatientManagement;