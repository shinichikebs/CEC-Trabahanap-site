import React, { useState, useEffect } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia"; // Import Inertia to handle navigation

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard"); // State to track the active content
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    // Log props to check if data is being passed correctly
    console.log("Props received:", { totalUsers, totalPosts });
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios
            .get("/admin-dashboard-data")
            .then((response) => {
                setTotalUsers(response.data.totalUsers);
                setTotalPosts(response.data.totalPosts);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    useEffect(() => {
        console.log("Total Users:", totalUsers);
        console.log("Total Job Offers:", totalPosts);
    }, [totalUsers, totalPosts]);

    const handleLogout = () => {
        // Make an Inertia POST request to the logout route
        Inertia.post("/admin/logout", {}, {
            onSuccess: () => {
                // Redirect to the login page after a successful logout
                Inertia.visit("/admin/login");
            }
        });
    };
    // Content to display based on the selected tab
    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                                <p className="text-4xl font-bold">{totalUsers}</p>
                                
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">Total Job Offers</h3>
                                <p className="text-4xl font-bold">{totalPosts}</p>  {/* Update to totalJobOffers if changed */}
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">New Messages</h3>
                                <p className="text-4xl font-bold">5</p>
                            </div>
                        </div>
                    </div>
                );
            case "users":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">User Management</h2>
                        <p>Here you can manage all users. Add, edit, delete, or view details of users.</p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">List of Users</h3>
                            {/* You can add user management content here */}
                        </div>
                    </div>
                );
            case "projects":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Project Management</h2>
                        <p>Manage ongoing and completed projects here. Assign users to projects, update statuses, etc.</p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">Current Projects</h3>
                            {/* You can add project management content here */}
                        </div>
                    </div>
                );
            case "messages":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <p>View and respond to messages. You can manage all incoming and outgoing communications.</p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">Inbox</h3>
                            {/* You can add message management content here */}
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Settings</h2>
                        <p>Configure system settings. Update your preferences, change passwords, and customize the admin panel here.</p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">System Preferences</h3>
                            {/* You can add settings management content here */}
                        </div>
                    </div>
                );
            default:
                return <h2 className="text-xl font-bold mb-4">Welcome to the Admin Dashboard</h2>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-500 text-white py-4 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-600 py-2 px-4 rounded-lg"
                            onClick={handleLogout} // Call the logout handler
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main layout with sidebar and content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-800 text-gray-100">
                    <nav className="p-6">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${activeTab === "dashboard" ? "bg-gray-700" : ""}`}
                                    onClick={() => setActiveTab("dashboard")}
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${activeTab === "users" ? "bg-gray-700" : ""}`}
                                    onClick={() => setActiveTab("users")}
                                >
                                    Users
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${activeTab === "projects" ? "bg-gray-700" : ""}`}
                                    onClick={() => setActiveTab("projects")}
                                >
                                    Projects
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${activeTab === "messages" ? "bg-gray-700" : ""}`}
                                    onClick={() => setActiveTab("messages")}
                                >
                                    Messages
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${activeTab === "settings" ? "bg-gray-700" : ""}`}
                                    onClick={() => setActiveTab("settings")}
                                >
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 bg-gray-100">
                    {renderContent()} {/* This will display the content based on the selected tab */}
                </main>
            </div>
        </div>
    );
}
