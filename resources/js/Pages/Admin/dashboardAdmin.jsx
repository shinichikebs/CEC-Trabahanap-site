import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalJobsDone, settotalJobsDone] = useState(0);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === "users") {
            fetchPendingUsers();
        } else if (activeTab === "projects") {
            fetchPendingPosts();
        }
    }, [activeTab]);

    const fetchData = () => {
        axios
            .get("/admin-dashboard-data")
            .then((response) => {
                setTotalUsers(response.data.totalUsers);
                setTotalPosts(response.data.totalPosts);
                settotalJobsDone(response.data.totalJobsDone);
                // Fetch pending counts when data is fetched
                fetchPendingUsers();
                fetchPendingPosts();
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const fetchPendingUsers = () => {
        axios
            .get("/admin/pending-approval-users")
            .then((response) => {
                setPendingUsers(response.data.pendingUsers);
            })
            .catch((error) => {
                console.error("Error fetching pending users:", error);
            });
    };

    const fetchPendingPosts = () => {
        axios
            .get("/admin/pending-approval-posts")
            .then((response) => {
                setPendingPosts(response.data.pendingPosts);
            })
            .catch((error) => {
                console.error("Error fetching pending posts:", error);
            });
    };

    const handleApprovePost = (postId) => {
        axios
            .post(`/admin/approve-post/${postId}`)
            .then((response) => {
                Swal.fire({
                    title: "Success!",
                    text: "Post approved successfully!",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
                setPendingPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== postId)
                ); // Remove approved post from list
            })
            .catch((error) => {
                console.error("Error approving post:", error);
            });
    };

    const handleApproveUser = (userId) => {
        axios
            .post(`/admin/approve-user/${userId}`)
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

    const openModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPost(null);
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        Inertia.post("/admin/logout"); // Assuming Inertia.js is being used for logout
    };

    const renderDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 15) {
            return words.slice(0, 15).join(" ") + "...";
        }
        return description;
    };

    const Modal = ({ post, onClose }) => {
        if (!post) return null; // Don't render if no post is selected

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-xs z-50">
                <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 p-6 relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                    <h2 className="text-2xl font-bold mb-4">
                        {post.job_title}
                    </h2>
                    <p className="text-gray-700 mb-4">{post.job_description}</p>
                    {/* Add other details of the post below */}
                    <p>
                        <strong>Category:</strong> {post.category}
                    </p>
                    <p>
                        <strong>Salary:</strong> {post.budget}
                    </p>
                    <p>
                        <strong>Posted Date:</strong>{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    {/* Add more details as needed */}
                </div>
            </div>
        );
    };


    

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">
                                    Total Users
                                </h3>
                                
                                <p className="text-4xl font-bold">
                                    {totalUsers}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">
                                    Total Job Offers
                                </h3>
                                <p className="text-4xl font-bold">
                                    {totalPosts}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">
                                    Total Job Offers Done
                                </h3>
                                <p className="text-4xl font-bold">
                                    {totalJobsDone}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">
                                    Pending Users
                                </h3>
                                <p className="text-4xl font-bold">
                                    {pendingUsers.length > 0
                                        ? pendingUsers.length
                                        : "0"}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-semibold mb-2">
                                    Pending Job Offers
                                </h3>
                                <p className="text-4xl font-bold">
                                    {pendingPosts.length > 0
                                        ? pendingPosts.length
                                        : "0"}
                                </p>
                            </div>
                        </div>                        
                        

                        <div className="mt-6">
                                <a 
                                    onClick={() => Inertia.visit(route('report.all'))}
                                    className="ml-4 py-2 px-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                    All
                                </a>
                                <a 
                                    onClick={() => Inertia.visit(route('report.user'))}
                                    className="ml-4 py-2 px-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                    Users
                                </a>
                                <a 
                                    onClick={() => Inertia.visit(route('report.post'))}
                                    className="ml-4 py-2 px-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                                    Posts
                                </a>







                        </div>

                    </div>
                );

            case "users":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            User Management
                        </h2>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                List of Users Pending Approval
                            </h3>
                            {pendingUsers.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleApproveUser(user.id)
                                                }
                                                className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No users pending approval.
                                </p>
                            )}
                        </div>
                    </div>
                );
            case "projects":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">
                            Job Offers Pending Approval
                        </h2>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                List of Job Offers Pending Approval
                            </h3>
                            {pendingPosts.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                                            onClick={() => openModal(post)} // Open modal with selected post
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {post.job_title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {renderDescription(
                                                        post.job_description
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent modal from opening on button click
                                                    handleApprovePost(post.id);
                                                }}
                                                className="ml-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No job offers pending approval.
                                </p>
                            )}
                        </div>
                        {/* Render Modal for selected post */}
                        {isModalOpen && (
                            <Modal post={selectedPost} onClose={closeModal} />
                        )}
                    </div>
                );

            case "messages":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <p>
                            View and respond to messages. You can manage all
                            incoming and outgoing communications.
                        </p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Inbox
                            </h3>
                        </div>
                    </div>
                );
            case "Report":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Report</h2>
                        <p>Report</p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                Inbox
                            </h3>
                        </div>
                    </div>
                );
            case "settings":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Settings</h2>
                        <p>
                            Configure system settings. Update your preferences,
                            change passwords, and customize the admin panel
                            here.
                        </p>
                        <div className="bg-white p-4 rounded-lg shadow mt-4">
                            <h3 className="text-lg font-semibold mb-2">
                                System Preferences
                            </h3>
                        </div>
                    </div>
                );
            default:
                return (
                    <h2 className="text-xl font-bold mb-4">
                        Welcome to the Admin Dashboard
                    </h2>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-500 text-white py-4 px-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            className="bg-blue-600 py-2 px-4 rounded-lg"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <aside className="w-64 bg-gray-800 text-gray-100">
                    <nav className="p-6">
                        <ul className="space-y-4">
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "dashboard"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("dashboard")}
                                >
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "users"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("users")}
                                >
                                    Users
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "projects"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("projects")}
                                >
                                    Job Offers
                                </button>
                            </li>

                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "messages"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("messages")}
                                >
                                    Messages
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "Report"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("Report")}
                                >
                                    Report
                                </button>
                            </li>
                            <li>
                                <button
                                    className={`block w-full text-left py-2 px-4 hover:bg-gray-700 rounded-lg ${
                                        activeTab === "settings"
                                            ? "bg-gray-700"
                                            : ""
                                    }`}
                                    onClick={() => setActiveTab("settings")}
                                >
                                    Settings
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>

                <main className="flex-1 p-6">{renderContent()}</main>
            </div>
        </div>
    );
}
