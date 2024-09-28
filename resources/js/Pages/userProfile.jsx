import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function UserProfile({ user }) {
    const [showReportModal, setShowReportModal] = useState(false);
    const [showViolationsDropdown, setShowViolationsDropdown] = useState(false);
    const [selectedViolation, setSelectedViolation] = useState('');
    const [showReportedModal, setShowReportedModal] = useState(false);

    const violations = [
        "Spam or fake profile",
        "Harassment or abuse",
        "Inappropriate content",
        "Other",
    ];

    const handleReportClick = () => {
        setShowReportModal(true); 
    };

    const handleYesClick = () => {
        setShowReportModal(false); 
        setShowViolationsDropdown(true); 
    };

    const handleNoClick = () => {
        setShowReportModal(false); 
    };

    const handleViolationChange = (e) => {
        setSelectedViolation(e.target.value);
    };

    const handleSubmitViolation = () => {
        if (selectedViolation) {
            setShowViolationsDropdown(false); 
            setShowReportedModal(true); 
        }
    };

    const handleCloseReportedModal = () => {
        setShowReportedModal(false); 
    };

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
                {}
                <div className="bg-gray-200 w-full lg:w-1/4 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={user.avatar || "/path-to-avatar.png"}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="rounded-full w-24 h-24 mb-4"
                            loading="lazy" 
                        />
                        <p className="text-xl font-semibold">
                            {user.firstName} {user.lastName}
                        </p>

                        {}
                        {user.rating ? (
                            <div className="flex items-center space-x-1 text-yellow-500 mt-2">
                                <span>⭐</span>
                                <span>{user.rating}</span>
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">No ratings yet</p>
                        )}

                        {}
                        <Link
                            href={route('chat.show', { id: user.id })} 
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Contact
                        </Link>

                        <button
                            onClick={handleReportClick}
                            className="text-red-500 text-sm mt-2"
                        >
                            Report Profile
                        </button>
                    </div>
                </div>

                {}
                <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">About {user.firstName}</h3>
                    <p className="text-gray-600 mb-4">{user.bio || "This user has not added a bio."}</p>
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

            {}
            {showReportModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to report this user?</h2>
                        <div className="flex justify-between">
                            <button
                                onClick={handleYesClick}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Yes
                            </button>
                            <button
                                onClick={handleNoClick}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {}
            {showViolationsDropdown && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Select the reason for reporting:</h2>
                        <select
                            value={selectedViolation}
                            onChange={handleViolationChange}
                            className="block w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            <option value="">Select a violation</option>
                            {violations.map((violation, index) => (
                                <option key={index} value={violation}>
                                    {violation}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleSubmitViolation}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}

            {}
            {showReportedModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">User is Reported</h2>
                        <button
                            onClick={handleCloseReportedModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
