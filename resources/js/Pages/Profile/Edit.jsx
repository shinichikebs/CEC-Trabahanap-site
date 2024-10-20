import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia'; // Import Inertia for form submission

export default function Edit({ auth, mustVerifyEmail, status, hasPassword }) {
    // State for managing skills and bio input
    const [skills, setSkills] = useState(auth.user.skills || ''); // Initialize with current user data
    const [bio, setBio] = useState(auth.user.bio || ''); // Initialize with current user bio

    // Handle form submission
    const handleSave = (e) => {
        e.preventDefault();

        // Send the updated skills and bio to the server
        Inertia.post('/profile/update', { skills, bio }, {
            onSuccess: () => {
                alert('Profile updated successfully!');
            },
            onError: (errors) => {
                console.log(errors);
                alert('There was an error updating your profile.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Update Profile Information Section */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gradient-to-r from-[#231955] to-[#3720ac] shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Update Password Section */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gradient-to-r from-[#231955] to-[#3720ac] shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" hasPassword={hasPassword} />
                    </div>

                    {/* Personal Description Section (Skills and Bio) */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gradient-to-r from-[#231955] to-[#3720ac] shadow sm:rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Personal Description</h3>
                        <form onSubmit={handleSave} className="mt-4 space-y-4">
                            {/* Skills Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="Add Skills"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>

                            {/* Bio Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                                <textarea
                                    name="bio"
                                    placeholder="Add your Bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows="4"
                                />
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Delete User Section */}
                    <div className="p-4 sm:p-8 bg-white dark:bg-gradient-to-r from-[#231955] to-[#3720ac] shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
