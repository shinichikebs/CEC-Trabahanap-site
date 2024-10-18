import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function UsersContent() {
    const [pendingUsers, setPendingUsers] = useState([]);

    useEffect(() => {
        // Fetch pending users (is_approved = 0)
        const fetchPendingUsers = async () => {
            try {
                const response = await fetch('/admin/pending-approval-users');
                const data = await response.json();
                setPendingUsers(data.pendingUsers);
            } catch (error) {
                console.error('Failed to fetch pending users:', error);
            }
        };

        fetchPendingUsers();
    }, []);

    const handleApproveUser = (userId) => {
        Inertia.post(`/admin/approve-user/${userId}`, {}, {
            onSuccess: () => {
                alert("User approved successfully!");
                setPendingUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Remove approved user from list
            },
            onError: () => {
                alert("Failed to approve the user.");
            }
        });
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="bg-white p-4 rounded-lg shadow mt-4">
                <h3 className="text-lg font-semibold mb-2">List of Users Pending Approval</h3>
                {pendingUsers.length > 0 ? (
                    <div className="space-y-4">
                        {pendingUsers.map((user) => (
                            <div key={user.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow">
                                <div>
                                    <p className="font-semibold">{user.first_name} {user.last_name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={() => handleApproveUser(user.id)}
                                    className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No users pending approval.</p>
                )}
            </div>
        </div>
    );
}
