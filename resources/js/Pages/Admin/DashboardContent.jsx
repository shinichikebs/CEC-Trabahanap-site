// DashboardContent.jsx
import React from "react";

export default function DashboardContent({ totalUsers, totalPosts, newMessages }) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                    <p className="text-4xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Total Job Offers</h3>
                    <p className="text-4xl font-bold">{totalPosts}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">New Messages</h3>
                    <p className="text-4xl font-bold">{newMessages}</p>
                </div>
            </div>
        </div>
    );
}
