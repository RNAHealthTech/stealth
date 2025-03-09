import React from "react";

const UserManagement: React.FC = () => {
    return (
          <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">User Management</h3>
        <div className="mb-6 flex justify-between">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                Add New User
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                View Audit Logs
            </button>
        </div>
        {/* User table would go here */}
    </div>
    )
}

export default UserManagement;