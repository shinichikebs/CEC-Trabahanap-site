import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react"; // Import Link for navigation

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

            <div className="flex flex-col lg:flex-row justify-between items-start mt-8 px-6 lg:px-20 space-y-6 lg:space-y-0">
                {/* User Info Sidebar */}
                <div className="bg-gray-200 w-full lg:w-1/4 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={user.avatar || "/path-to-avatar.png"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="rounded-full w-24 h-24 mb-4"
                        />
                        <p className="text-xl font-semibold">
                            {user.firstName} {user.lastName}
                        </p>

                        {/* User Rating */}
                        <div className="flex items-center space-x-1 text-yellow-500 mt-2">
                            <span>⭐</span>
                            <span>{user.rating || "No ratings yet"}</span>
                        </div>

                        {/* Contact Button */}
                        <Link
                            href={route('chat.show', { id: user.id })} // Adjust the route to your actual chat page
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Contact
                        </Link>
                        
                        <a href="#" className="text-red-500 text-sm mt-2">
                            Report Profile
                        </a>
                    </div>
                </div>

                {/* Profile Details Section */}
                <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">About {user.firstName}</h3>

                    {/* Bio */}
                    <p className="text-gray-600 mb-4">{user.bio || "This user has not added a bio."}</p>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">Location</h4>
                            <p className="text-gray-600">{user.location || "Location not provided"}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800">Skills</h4>
                            <p className="text-gray-600">{user.skills?.join(', ') || "No skills listed"}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800">Email</h4>
                            <p className="text-gray-600">{user.email || "Email not available"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
