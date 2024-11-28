import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserProfile = ({ user, onClose }) => {
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [doneJobs, setDoneJobs] = useState([]);
    const [isJobDoneVisible, setIsJobDoneVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [actionToConfirm, setActionToConfirm] = useState(null);

    if (!user) return null;

    useEffect(() => {
        const fetchApprovedPosts = async (userId) => {
            try {
                const response = await axios.get(`/admin/user/${userId}/approved-posts`);
                if (response.data && response.data.approvedPosts) {
                    setApprovedPosts(response.data.approvedPosts);
                } else {
                    setApprovedPosts([]);
                }
            } catch (error) {
                console.error("Error fetching approved posts:", error);
            }
        };

        const fetchDoneJobs = async (userId) => {
            try {
                const response = await axios.get(`/admin/user/${userId}/done-jobs`);
                if (response.data && response.data.doneJobs) {
                    console.log("Done Jobs Data:", response.data.doneJobs);
                    setDoneJobs(response.data.doneJobs);
                } else {
                    setDoneJobs([]);
                }
            } catch (error) {
                console.error("Error fetching done jobs:", error);
            }
        };

        if (user && user.id) {
            fetchApprovedPosts(user.id);
            fetchDoneJobs(user.id);
        }
    }, [user]);

    const handleConfirmAction = async () => {
        try {
            const response = await axios.post(`/admin/confirm-password`, { password: adminPassword });
    
            if (response.data.success) {
                if (actionToConfirm === "delete") {
                    await handleDeleteUser();
                } else if (actionToConfirm === "restrict") {
                    await handleRestrictUser();
                }
            } else {
                Swal.fire("Error", response.data.message || "Invalid password", "error");
            }
        } catch (error) {
            console.error("Password confirmation failed:", error.response || error);
            Swal.fire("Error", "Failed to confirm password", "error");
        } finally {
            setIsPasswordModalOpen(false);
            setAdminPassword("");
        }
    };
    

    const handleDelete = () => {
        setActionToConfirm("delete");
        setIsPasswordModalOpen(true);
    };

    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete(`/admin/delete-user/${user.id}`);
            if (response.status === 200) {
                Swal.fire("Deleted", "User has been moved to Deleted Users", "success");
                onClose();
            }
        } catch (error) {
            Swal.fire("Error", "Failed to delete user", "error");
            console.error("Error deleting user:", error);
        }
    };

    const handleRestrict = () => {
        setActionToConfirm("restrict");
        setIsPasswordModalOpen(true);
    };

    const handleRestrictUser = async () => {
        try {
            await axios.post(`/admin/restrict-user/${user.id}`);
            Swal.fire("Success", "User restricted successfully!", "success");
            onClose();
        } catch (error) {
            Swal.fire("Error", "Failed to restrict user", "error");
            console.error("Error restricting user:", error);
        }
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    const toggleJobDoneVisibility = () => {
        setIsJobDoneVisible(!isJobDoneVisible);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg max-h-[80vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
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
                            onClick={handleRestrict}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                            Restrict
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                            onClick={handleDelete}
                        >
                            <span className="mr-2">🗑️</span> Remove
                        </button>
                    </div>

                    <div className="mt-6 w-full border-t">
                        <div className="flex justify-center space-x-6 mt-4">
                            <button
                                className={`text-lg ${!isJobDoneVisible ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setIsJobDoneVisible(false)}
                            >
                                POST
                            </button>
                            <button
                                className={`text-lg ${isJobDoneVisible ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                                onClick={() => setIsJobDoneVisible(true)}
                            >
                                JOB DONE
                            </button>
                        </div>

                        {/* Make this section scrollable */}
                        <div className="mt-4 max-h-[60vh] overflow-y-auto">
                            {!isJobDoneVisible ? (
                                <div className="approved-posts">
                                    {approvedPosts.length > 0 ? (
                                        approvedPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="post-item mb-4 p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer"
                                                onClick={() => handlePostClick(post)}
                                            >
                                                <p className="text-lg font-semibold">{post.job_title}</p>
                                                <p>{post.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No approved posts</p>
                                    )}
                                </div>
                            ) : (
                                <div className="done-jobs">
                                    {doneJobs.length > 0 ? (
                                        doneJobs.map((job) => (
                                            <div
                                                key={job.id}
                                                className="job-item mb-4 p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer"
                                            >
                                                <p className="text-lg font-semibold">{job.job_title}</p>
                                                <p>{job.job_description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No jobs done</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <button onClick={handleCloseModal} className="top-2 right-2 text-gray-600 hover:text-gray-900">
                            ✖
                        </button>

                        <h3 className="text-2xl font-semibold mb-4">{selectedPost.job_title}</h3>
                        <p><strong>Job Description:</strong> {selectedPost.job_description}</p>
                        <p><strong>Category:</strong> {selectedPost.category}</p>
                        <p><strong>Budget:</strong> {selectedPost.budget ? `₱ ${selectedPost.budget}` : "N/A"}</p>
                        <p><strong>Sub Category:</strong> {selectedPost.sub_category}</p>
                        <p><strong>Work Type:</strong> {selectedPost.work_type === 0 ? "Full-time" : "Part-time"}</p>
                        <p><strong>Project Duration:</strong> {selectedPost.days_post_end} days</p>
                        <p><strong>Post Created At:</strong> {new Date(selectedPost.created_at).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {/* Password confirmation modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Enter Admin Password</h3>
                        <input
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="border px-4 py-2 mb-4 w-full"
                            placeholder="Admin Password"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={handleConfirmAction}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
