import React from 'react';

function UserProfileModal({ showProfileModal, closeUserProfileModal, user }) {
    if (!showProfileModal || !user) return null;

    // Check if `user.skills` is an array, otherwise display a fallback
    const skills = Array.isArray(user.skills) ? user.skills.join(', ') : 'No skills listed.';
    const bio = user.bio ? user.bio : 'This user has not added a bio.';

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full flex">
                
                {/* Left Section - Profile Image and Contact/Report Buttons */}
                <div className="w-1/3 bg-gray-200 p-6 rounded-lg flex flex-col items-center">
                    <img
                        src={user.avatar || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="rounded-full w-24 h-24 mb-4"
                    />
                    <p className="text-xl font-semibold mb-4">{user.firstName} {user.lastName}</p>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
                    >
                        Contact
                    </button>
                    <button
                        onClick={() => alert('Report submitted')}
                        className="text-red-500 text-sm"
                    >
                        Report Profile
                    </button>
                </div>

                {/* Right Section - User Info */}
                <div className="w-2/3 pl-8">
                    <h2 className="text-2xl font-semibold mb-4">About {user.firstName} {user.lastName}</h2>
                    <p className="text-gray-600 mb-6">{bio}</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-800">Skills</h4>
                            <p className="text-gray-600">{skills}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Email</h4>
                            <p className="text-gray-600">{user.email || "Email not available"}</p>
                        </div>
                    </div>

                    {/* Back to Proposal List Button */}
                    <div className="mt-6">
                        <button
                            onClick={closeUserProfileModal}
                            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            Back to Proposal List
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default UserProfileModal;
