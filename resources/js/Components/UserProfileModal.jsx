import React from 'react';

function UserProfileModal({ showProfileModal, closeUserProfileModal, user }) {
    if (!showProfileModal || !user) return null;

    // Check if `user.skills` is an array, otherwise display a fallback
    const skills = Array.isArray(user.skills) ? user.skills.join(', ') : 'No skills listed.';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">User Profile</h2>
                <div>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Skills:</strong> {skills}</p>
                </div>
                <button
                    onClick={closeUserProfileModal}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default UserProfileModal;
