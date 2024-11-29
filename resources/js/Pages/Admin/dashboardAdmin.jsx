import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Inertia } from "@inertiajs/inertia";
import AddUserModal from "@/Components/AddUserModal";
import AddStaffModal from "@/Components/AddStaffModal";
import SearchUserModal from "@/Components/SearchUserModal";
import UserProfile from "@/Components/UserProfile";
import ReportList from "@/Components/ReportList";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalJobsDone, settotalJobsDone] = useState(0);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

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
                    text: "User approved successfully!",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
    
                setPendingUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId)
                );
    
                // Log to the browser console (front-end)
                console.log(`User ${userId} approved and email sent.`);
            })
            .catch((error) => {
                console.error('Error approving user:', error.response || error.message);
            });
    };
    
    
    const handleLogout = () => {
        Inertia.post("/admin/logout"); // Assuming Inertia.js is being used for logout
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

    const renderDescription = (description) => {
        const words = description.split(" ");
        if (words.length > 15) {
            return words.slice(0, 15).join(" ") + "...";
        }
        return description;
    };

    const openModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPost(null);
        setIsModalOpen(false);
    };

    // Search functionality handlers
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query) {
            fetchSearchResults(query);
            setIsSearchModalOpen(true);
        } else {
            setIsSearchModalOpen(false);
        }
    };

    const fetchSearchResults = (query) => {
        axios
            .get(
                `/admin/search-approved-users?query=${encodeURIComponent(
                    query
                )}`
            )
            .then((response) => {
                setSearchResults(response.data.users);
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
            });
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user); // Set the selected user to display their profile
        setIsSearchModalOpen(false);
    };

    const closeUserProfile = () => {
        setSelectedUser(null); // Reset selected user to hide profile
    };

    // To hide dropdown when clicking outside
    const closeSearchModal = () => {
        setIsSearchModalOpen(false);
        setSearchQuery("");
    };


    const getNiceMax = (maxValue) => {
        if (maxValue <= 5) return 5;
        const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
        const niceMax = Math.ceil(maxValue / magnitude) * magnitude;
        return niceMax;
    };

    // Function to render the dynamic bar graph
    const renderBarGraph = () => {
        // Find the maximum count
        const maxCount = Math.max(totalUsers, totalPosts, totalJobsDone, pendingUsers.length, pendingPosts.length);
        const niceMax = getNiceMax(maxCount); // Adjusted max for better display

        // Generate dynamic Y-axis labels
        const yAxisLabels = Array.from({ length: 8 }, (_, i) => Math.round((niceMax / 2) * i)).reverse();

        return (
            <div className="relative flex flex-col items-center left-20 mt-10 w-full max-w-3xl">
                {/* Y-axis Labels */}
                <div className="absolute left-0 transform -translate-x-8 flex flex-col justify-between h-80 text-gray-600 text-sm">
                    {yAxisLabels.map((value) => (
                        <span key={value}>{value.toLocaleString()}</span>
                    ))}
                </div>

                {/* Grid Lines */}
                <div className="relative w-full h-80 border-l border-b border-gray-400">
                    {yAxisLabels.map((_, i) => (
                        <div
                            key={i}
                            className="absolute left-0 right-0 border-t border-gray-300"
                            style={{ bottom: `${(i / (yAxisLabels.length - 1)) * 100}%` }}
                        ></div>
                    ))}

                    {/* Bars */}
                    <div className="flex justify-around items-end h-full space-x-4">
                        <Bar label="Total Users" count={totalUsers} color="bg-blue-300" maxCount={niceMax} />
                        <Bar label="Total Job Offers" count={totalPosts} color="bg-green-300" maxCount={niceMax} />
                        <Bar label="Jobs Done" count={totalJobsDone} color="bg-purple-300" maxCount={niceMax} />
                        <Bar label="Pending Users" count={pendingUsers.length} color="bg-yellow-300" maxCount={niceMax} />
                        <Bar label="Pending Job Offers" count={pendingPosts.length} color="bg-red-300" maxCount={niceMax} />
                    </div>
                </div>
            </div>
        );
    };

    // Bar Component for rendering each bar with dynamic height
    const Bar = ({ label, count, color, maxCount }) => {
        const heightPercentage = (count / maxCount) * 100;
        const height = Math.max((heightPercentage / 100) * 250, 2); // Scale height within 320px with minimum height 20px

        return (
            <div className="flex flex-col items-center">
                <div
                    style={{ height: `${height}px` }}
                    className={`${color} w-12 border border-gray-500 transition-all duration-300 ease-in-out`}
                ></div>
                <span className="mt-2 text-center text-gray-700 font-medium text-sm">{label}</span>
                <span className="text-center font-semibold">{count.toLocaleString()}</span>
            </div>
        );
    };
    

    // Add User modal handlers
    const openAddUserModal = () => setIsAddUserModalOpen(true);
    const closeAddUserModal = () => setIsAddUserModalOpen(false);

    const openAddStaffModal = () => setIsAddStaffModalOpen(true);
    const closeAddStaffModal = () => setIsAddStaffModalOpen(false);

    const renderContent = () => {
        // Check if a user profile is selected
        if (selectedUser) {
            return (
                <UserProfile user={selectedUser} onClose={closeUserProfile} />
            );
        }
        switch (activeTab) {
            case "dashboard":
                return (
                    
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                        {renderBarGraph()}
        
                        {/* Report Links */}
                        <div className="mt-8 flex space-x-4">
                            <a
                                onClick={() => Inertia.visit(route("report.all"))}
                                className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
                            >
                                All Reports
                            </a>
                            <a
                                onClick={() => Inertia.visit(route("report.user"))}
                                className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
                            >
                                User Reports
                            </a>
                            <a
                                onClick={() => Inertia.visit(route("report.post"))}
                                className="py-3 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
                            >
                                Post Reports
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
                            {/* button to add a user */}
                            <button
                                onClick={openAddUserModal}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Add User
                            </button>
                            <button
                                onClick={openAddStaffModal}
                                className="bg-green-500 text-white mb-5 ml-5 px-4 py-2 rounded"
                            >
                                Add Staff
                            </button>
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

            // report case
            case "Report":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Report</h2>
                        <ReportList /> {/* Render the ReportList component */}
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
    //  Main content
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-[#231955] text-white py-4 px-6">
                <div className="flex justify-between items-center">
                    <img src="/cecLogo.png" width="70" />

                    <div className="relative mt-4 max-w-md mx-auto">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search User..."
                                className="block w-full pl-10 pr-24 p-3 text-sm text-white border border-gray-700 rounded-full bg-gray-800 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <button
                        className="bg-blue-600 py-2 px-4 rounded-lg ml-4"
                        onClick={() => Inertia.post("/admin/logout")}
                    >
                        Logout
                    </button>
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

                <main className="flex-1 p-6">
                    {renderContent()}
                    <AddUserModal
                        isOpen={isAddUserModalOpen}
                        onClose={closeAddUserModal}
                    />
                    <AddStaffModal
                        isOpen={isAddStaffModalOpen}
                        onClose={closeAddStaffModal}
                    />
                    <SearchUserModal
                        isOpen={isSearchModalOpen}
                        searchResults={searchResults}
                        onSelect={handleUserSelect}
                        onClose={() => setIsSearchModalOpen(false)} // Closes modal
                    />
                </main>
            </div>
        </div>
    );
}
