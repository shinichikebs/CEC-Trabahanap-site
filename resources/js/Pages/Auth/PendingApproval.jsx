import React from 'react';
import { Head } from '@inertiajs/inertia-react';

const PendingApproval = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <Head title="Pending Approval" />
                <h1 className="text-3xl font-semibold text-gray-800">Your account is pending approval</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Once your account is approved by an administrator, you will be able to log in.
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
