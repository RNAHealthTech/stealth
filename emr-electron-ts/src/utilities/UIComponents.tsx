import React, { Fragment } from 'react';
import {
    Transition
} from '@headlessui/react';



export const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    return (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            <div className='flex item-center justify-between'>
                <p>{message}</p>
                <button onClick={onClose} className='ml-4 text-white'>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export const Modal = ({ isOpen, onClose, title, children, footer }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; footer: React.ReactNode; }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <div className='fixed inset-0 z-50 overflow-y-auto'>
                <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 ' onClick={onClose} />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className='inline-block w-full  px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>              <div className="pb-3 border-b border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                        </div>
                            <div className="mt-4">{children}</div>
                            <div className="mt-5 sm:mt-6">{footer}</div>
                        </div>


                    </Transition.Child>
                </div>
            </div >
        </Transition >
    )
}

export const Input = ({ label, id, name, type = "text", value, onChange, required = false }: { label: string; id: string; name: string; type?: string; value: any; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }) => {
    return (
        <div>
            <label htmlFor={id} className='block mb-1 text-sm front-medium text-gray-700'>
                {label} {required && <span className='text-red-500'>*</span>}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
        </div>
    )
}


export const Select = ({ label, id, name, value, onChange, options, required = false }: { label: string; id: string; name: string; value: any; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string | number; label: string }[]; required?: boolean }) => {
    return (
        <div>
            <label htmlFor={id} className='block mb-1 text-sm font-medium text-gray-700'>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus: ring-indigo-500 focus:border-indigo-500 md:text-md'
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}


export const Textarea = ({ label, id, name, value, onChange, required = false }: { label: string; id: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean }) => {
    return (
        <div>
            <label htmlFor={id} className="block mb-1 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
    );
};

export const Button = ({ children, onClick, variant = 'primary', disabled = false, type = 'button' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean; type?: 'button' | 'submit' | 'reset' }) => {
    const baseStyles = "inline-flex justify-center px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantStyles = {
        primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
        secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )
}