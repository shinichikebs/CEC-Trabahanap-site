import React from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Assuming this is the correct import path

export default function PostProject({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    My Project
                </h2>
            }
        >
            {/* You don't need a separate header here since AuthenticatedLayout already provides the header */}
        </AuthenticatedLayout>
    );
}
