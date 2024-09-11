import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function UserProfile({ user }) {
    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {user.firstName} {user.lastName}'s Profile
                </h2>
            }
        >
            <Head title={`${user.firstName} ${user.lastName} Profile`} />

            <div className="flex justify-between items-start mt-8 px-20">
                <div className="bg-gray-200 w-1/4 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={user.avatar || "/path-to-avatar.png"} // Dynamically load avatar or default image
                            alt={`${user.firstName} ${user.lastName}`}
                            className="rounded-full w-24 h-24 mb-4"
                        />
                        <p className="text-xl font-semibold">
                            {user.firstName} {user.lastName}
                        </p>
                        <div className="flex items-center space-x-1 text-yellow-500 mt-2">
                            <span>⭐</span>
                            <span>4.8</span> {/* Adjust rating as needed */}
                        </div>
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                            Contact
                        </button>
                        <a href="#" className="text-red-500 text-sm mt-2">Report Profile</a>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
