// src/components/UserProfile.js

import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserProfile = ({ user, onClose }) => {
    if (!user) return null;

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `/admin/delete-user/${user.id}`
            );
            if (response.status === 200) {
                Swal.fire(
                    "Deleted",
                    "User has been moved to Deleted Users",
                    "success"
                );
                onClose(); // Close the modal after deletion
            }
        } catch (error) {
            Swal.fire("Error", "Failed to delete user", "error");
            console.error("Error deleting user:", error);
        }
    };

    const handleRestrictUser = (userId) => {
        axios
            .post(`/admin/restrict-user/${userId}`)
            .then((response) => {
                Swal.fire({
                    title: "Success!",
                    text: "Post approved successfully!",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
                setPendingUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId)
                ); // Remove the approved user from the list
            })
            .catch((error) => {
                console.error("Error approving user:", error);
            });
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    ✖
                </button>

                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-purple-300 rounded-full flex items-center justify-center mb-4">
                        <span className="text-5xl text-purple-600 font-bold">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                        </span>
                    </div>

                    <h2 className="text-2xl font-semibold mb-2">
                        {user.firstName} {user.lastName}
                    </h2>

                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() =>
                                handleRestrictUser(user.id)
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Restrict
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                            onClick={handleDelete}
                        >
                            <span className="mr-2">🗑️</span> Delete
                        </button>
                    </div>

                    <div className="mt-6 w-full border-t">
                        <div className="flex justify-center space-x-6 mt-4">
                            <button className="text-blue-600 border-b-2 border-blue-600 pb-1">
                                POST
                            </button>
                            <button className="text-gray-500 hover:text-black pb-1">
                                PROJECT DONE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
