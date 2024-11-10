import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Swal from 'sweetalert2';
import axios from 'axios';
import { IoMdArrowBack } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";

export default function UserProfile({ user }) {
    const [avatar, setAvatar] = useState(user.avatar);

    const handleBackClick = () => {
        window.history.back();
    };

    const handleAvatarClick = () => {
        document.getElementById('avatarInput').click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            try {
                const response = await axios.post(route('user.avatar.upload', { id: user.id }), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setAvatar(response.data.avatar); // Update avatar with the new URL
                Swal.fire({
                    title: 'Success',
                    text: 'Avatar updated successfully!',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });
            } catch (error) {
                console.error('Error uploading avatar:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'There was an error updating your avatar.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`${user.firstName} ${user.lastName} Profile`} />

            {/* Custom Header */}
            <header className="bg-[#231955] py-4 px-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/cecLogo.png" alt="CeC Logo" className="w-10 h-10" />
                    <h1 className="text-[#E8AA42] text-lg font-semibold uppercase">
                        CEC-TRABAHANAP
                    </h1>
                </div>
                <button
                    onClick={handleBackClick}
                    className="text-[#E8AA42] bg-transparent border border-[#E8AA42] rounded-lg py-2 px-4 hover:bg-[#D18C33] hover:text-white transition duration-200"
                >
                    <IoMdArrowBack />
                </button>
            </header>

            {/* Profile Content */}
            <div className="flex flex-col lg:flex-row justify-between items-start mt-8 px-6 lg:px-20 space-y-6 lg:space-y-0">
                {/* User Info Section */}
                <div className="bg-gray-200 w-full lg:w-1/4 rounded-lg p-6 relative">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={avatar || "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="rounded-full w-24 h-24 mb-4 cursor-pointer"
                                onClick={handleAvatarClick} // Trigger file input on avatar click
                                loading="lazy"
                            />
                            <FiPlusCircle
                                className="absolute bottom-3 right-2 text-blue-500 bg-white rounded-full cursor-pointer"
                                size={28}
                                onClick={handleAvatarClick} // Trigger file input on icon click as well
                            />
                        </div>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange} // Handle avatar change
                        />
                        <p className="text-xl font-semibold mt-2">
                            {user.firstName} {user.lastName}
                        </p>
                        <Link
                            href={route('profile.edit')}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            EDIT
                        </Link>
                    </div>
                </div>

                {/* Profile Details Section */}
                <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">About {user.firstName}</h3>
                    <p className="text-gray-600 mb-4">{user.bio || "This user has not added a bio."}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">Skills</h4>
                            <p className="text-gray-600">
                                {Array.isArray(user.skills) 
                                    ? user.skills.join(', ')
                                    : user.skills || "No skills listed"}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Email</h4>
                            <p className="text-gray-600">{user.email || "Email not available"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
