import React from 'react';
import { Head, Link } from "@inertiajs/react";

function UserProfileModal({ showProfileModal, closeUserProfileModal, user }) {
    if (!showProfileModal || !user) return null;

    // Check if `user.skills` is an array, otherwise display a fallback
    const skills = Array.isArray(user.skills) ? user.skills.join(', ') : 'No skills listed.';
    const bio = user.bio ? user.bio : 'This user has not added a bio.';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl lg:flex">
        {/* Left Section - Profile Image and Contact/Report Buttons */}
        <div className="bg-gray-200 p-6 rounded-lg flex flex-col items-center lg:w-1/3">
            <img
                src={
                    user.avatar ||
                    "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                }
                alt={`${user.firstName} ${user.lastName}`}
                className="rounded-full w-20 h-20 sm:w-24 sm:h-24 mb-4"
            />
            <p className="text-lg font-semibold mb-4 sm:text-xl">
                {user.firstName} {user.lastName}
            </p>
            <Link
                href={route("chat.show", { id: user.id })}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base"
            >
                Contact
            </Link>
        </div>

        {/* Right Section - User Info */}
        <div className="mt-6 lg:mt-0 lg:pl-8 lg:w-2/3">
            <h2 className="text-xl font-semibold mb-4 sm:text-2xl">
                About {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 mb-6">{bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-gray-800">Skills</h4>
                    <p className="text-gray-600">{skills}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Email</h4>
                    <p className="text-gray-600">
                        {user.email || "Email not available"}
                    </p>
                </div>
            </div>

            {/* Back to Proposal List Button */}
            <div className="mt-6">
                <button
                    onClick={closeUserProfileModal}
                    className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 w-full sm:w-auto"
                >
                    Return
                </button>
            </div>
        </div>
    </div>
</div>

    );
}

export default UserProfileModal;
