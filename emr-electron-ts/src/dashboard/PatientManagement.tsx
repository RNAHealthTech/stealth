import React, { useEffect, useState } from 'react';
import { Toast, Modal, Button, Input, Textarea, Select } from '../utilities/UIComponents';


// Interface for patient data
export interface Patient {
    id: number;
    hospital_id: number;
    name: string;
    dob: string;
    medical_id: string;
    synced: number;
}

// Extended interface with additional fields for the form
interface PatientData {
    id?: number;
    hospital_id?: number;
    name?: string;
    medical_id?: string;
    synced?: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    insuranceProvider: string;
    insuranceNumber: string;
    emergencyContact: string;
    emergencyPhone: string;
    medicalHistory: string;
}

const initialPatientData: PatientData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    insuranceProvider: '',
    insuranceNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    hospital_id: undefined,
    medical_id: '',
    synced: 0
};



const PatientManagement: React.FC = () => {

    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [patientData, setPatientData] = useState<PatientData>(initialPatientData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    // Handle modal open/close
    const handlePatientAdd = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentStep(1);
        setPatientData(initialPatientData);
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPatientData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Move between form steps
    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Show toast message
    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3000);
    };

    // Prepare data for API submission
    const preparePatientDataForSubmission = (): Patient => {
        // Combine firstName and lastName to match the Patient interface
        return {
            id: patientData.id || 0, // Will be assigned by backend if creating new
            hospital_id: Number(patientData.hospital_id) || 0, // Convert to number
            name: `${patientData.firstName} ${patientData.lastName}`,
            dob: patientData.dateOfBirth,
            medical_id: patientData.medical_id || '',
            synced: Number(patientData.synced) || 0 // Convert to number
        };
    };

    // Submit patient data to backend
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // Prepare data in the format expected by the API
            const patientForSubmission = preparePatientDataForSubmission();

            // Example API call
            // const response = await fetch('/api/patients', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify(patientForSubmission),
            // });

            // if (!response.ok) throw new Error('Failed to add patient');

            // Mock successful API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast(`${patientData.firstName} ${patientData.lastName} was added successfully.`, 'success');
            closeModal();
        } catch (error) {
            console.error('Error adding patient:', error);
            showToast('Failed to add patient. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render form based on current step
    const renderFormStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                id="firstName"
                                name="firstName"
                                value={patientData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Last Name"
                                id="lastName"
                                name="lastName"
                                value={patientData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Date of Birth"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={patientData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                            />
                            <Select
                                label="Gender"
                                id="gender"
                                name="gender"
                                value={patientData.gender}
                                onChange={handleInputChange}
                                options={[
                                    { value: '', label: 'Select Gender' },
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                                ]}
                                required
                            />
                        </div>
                        <Input
                            label="Medical ID"
                            id="medical_id"
                            name="medical_id"
                            value={patientData.medical_id || ''}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Hospital ID"
                            id="hospital_id"
                            name="hospital_id"
                            type="number"
                            value={patientData.hospital_id || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            id="email"
                            name="email"
                            type="email"
                            value={patientData.email}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Phone Number"
                            id="phone"
                            name="phone"
                            value={patientData.phone}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Address"
                            id="address"
                            name="address"
                            value={patientData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Insurance Provider"
                                id="insuranceProvider"
                                name="insuranceProvider"
                                value={patientData.insuranceProvider}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Insurance Number"
                                id="insuranceNumber"
                                name="insuranceNumber"
                                value={patientData.insuranceNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Input
                            label="Emergency Contact"
                            id="emergencyContact"
                            name="emergencyContact"
                            value={patientData.emergencyContact}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Emergency Contact Phone"
                            id="emergencyPhone"
                            name="emergencyPhone"
                            value={patientData.emergencyPhone}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            label="Medical History Notes"
                            id="medicalHistory"
                            name="medicalHistory"
                            value={patientData.medicalHistory}
                            onChange={handleInputChange}
                        />
                        <Select
                            label="Sync Status"
                            id="synced"
                            name="synced"
                            value={patientData.synced || 0}
                            onChange={handleInputChange}
                            options={[
                                { value: 0, label: 'Not Synced' },
                                { value: 1, label: 'Synced' }
                            ]}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const mockPatients: Patient[] = [
                { id: 1, hospital_id: 101, name: 'John Smith', dob: '1985-04-12', medical_id: 'MID12345', synced: 1 },
                { id: 2, hospital_id: 102, name: 'Sarah Johnson', dob: '1990-08-23', medical_id: 'MID23456', synced: 1 },
                { id: 3, hospital_id: 103, name: 'Michael Davis', dob: '1978-11-05', medical_id: 'MID34567', synced: 0 },
                { id: 4, hospital_id: 104, name: 'Emily Wilson', dob: '1995-02-18', medical_id: 'MID45678', synced: 1 },
                { id: 5, hospital_id: 105, name: 'Robert Brown', dob: '1965-07-30', medical_id: 'MID56789', synced: 0 },
            ];

            await new Promise(resolve => setTimeout(resolve, 800));

            setPatients(mockPatients);
            setFilteredPatients(mockPatients);
        } catch (error) {
            console.error('Error fetching patients : ', error);
            showToast('Failed to load patients', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        applyFilters(value, dateFilter);
    };


    const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newDateFilter = { ...dateFilter, [name]: value };
        setDateFilter(newDateFilter);
        applyFilters(searchTerm, newDateFilter);
    };

    const applyFilters = (search: string, dates: { from: string, to: string }) => {
        let filtered = [...patients];

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(patient =>
                patient.name.toLowerCase().includes(searchLower) ||
                patient.medical_id.toLowerCase().includes(searchLower)
            );
        }

        //apply date filters
        if (dates.from) {
            filtered = filtered.filter(patient => patient.dob >= dates.from);
        }

        if (dates.to) {
            filtered = filtered.filter(patient => patient.dob <= dates.to);
        }

        setFilteredPatients(filtered);
    };

    useEffect(() => {
        fetchPatients();
    }, []);



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
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>


                {/*  patients code */}
                <div className='flex gap-2'>
                    <div>
                        <label
                            className='block text-sm font-medium text-gray-700 mb-1'
                        >Date From</label>
                        <input
                            type='date'
                            name='from'
                            value={dateFilter.from}
                            onChange={handleDateFilterChange}
                            className='w-full md:w-auto px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                        <input
                            type="date"
                            name="to"
                            value={dateFilter.to}
                            onChange={handleDateFilterChange}
                            className="w-full sm:w-auto px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <button
                    onClick={handlePatientAdd}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                >
                    Add New Patient
                </button>
            </div>

            {/* Patient table would go here */}
            <div className="mt-4 overflow-hidden rounded-lg border">
                {isLoading ? (
                    <div className='flex justify-center items-center py-10'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600'></div>
                    </div>
                ) : filteredPatients.length > 0 ? (
                    <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sync Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className='hover:bg-gray-50'>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{patient.hospital_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(patient.dob).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.medical_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {patient.synced ? 'Synced' : 'Not Synced'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                onClick={() => {/* handle view/edit */ }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => {/* handle delete */ }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className='text-center py-10 text-gray-500'>
                        {searchTerm || dateFilter.from || dateFilter.to ? 'No patients match your search chriteria.' : 'No patients found. Add your first patient using the  button above.'}
                    </div> )}
            </div>

            {/* Patient Add Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={`Add New Patient - Step ${currentStep} of 3`}
                footer={
                    <div className="flex justify-between">
                        <div>
                            {currentStep > 1 && (
                                <Button variant="secondary" onClick={prevStep} disabled={isSubmitting}>
                                    Previous
                                </Button>
                            )}
                        </div>
                        <div>
                            {currentStep < 3 ? (
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Patient'}
                                </Button>
                            )}
                        </div>
                    </div>
                }
            >
                {renderFormStep()}
            </Modal>

            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    )
};

export default PatientManagement;