import React from 'react';
import { Head, usePage } from '@inertiajs/react'; // Ensure correct imports
import { Inertia } from '@inertiajs/inertia';

const PendingApproval = () => {
    const { props } = usePage();

    const handleBackToDashboard = () => {
        Inertia.get('/'); // Redirect to welcome
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <Head title="Pending Approval" />
                <h1 className="text-3xl font-semibold text-gray-800">Your account is pending approval</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Once your account is approved by an administrator, you will be able to log in.
                </p>
                <button
                    onClick={handleBackToDashboard}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default PendingApproval;
