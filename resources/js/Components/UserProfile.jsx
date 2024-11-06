import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UserProfile = ({ user, onClose }) => {
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [doneJobs, setDoneJobs] = useState([]); // New state for "done" jobs
    const [isJobDoneVisible, setIsJobDoneVisible] = useState(false); // State to track visibility of "Job Done"
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!user) return null;

    useEffect(() => {
        let isMounted = true;

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


            // In your frontend `fetchDoneJobs` function
            const fetchDoneJobs = async (userId) => {
                try {
                    const response = await axios.get(`/admin/user/${userId}/done-jobs`);
                    if (response.data && response.data.doneJobs) {
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
            fetchDoneJobs(user.id); // Fetch done jobs
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    const handleDelete = async () => {
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

    const handleRestrictUser = (userId) => {
        axios
            .post(`/admin/restrict-user/${userId}`)
            .then(() => {
                Swal.fire({
                    title: "Success!",
                    text: "User restricted successfully!",
                    icon: "success",
                    confirmButtonText: "Okay",
                });
                onClose();
            })
            .catch((error) => {
                Swal.fire("Error", "Failed to restrict user", "error");
                console.error("Error restricting user:", error);
            });
    };

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    // Toggle visibility between posts and job done sections
    const toggleJobDoneVisibility = () => {
        setIsJobDoneVisible(!isJobDoneVisible);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-lg">
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
                            onClick={() => handleRestrictUser(user.id)}
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

                        {/* Conditional Rendering for Approved Posts or Job Done */}
                        <div className="mt-4">
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

            {/* Modal for full post details */}
            {isModalOpen && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <button onClick={handleCloseModal} className="top-2 right-2 text-gray-600 hover:text-gray-900">
                            ✖
                        </button>

                        <h3 className="text-2xl font-semibold mb-4">{selectedPost.job_title}</h3>
                        <p><strong>Job Description:</strong> {selectedPost.job_description}</p>
                        <p><strong>Category:</strong> {selectedPost.category}</p>
                        <p><strong>Budget:</strong> {selectedPost.budget ? `$${selectedPost.budget}` : "N/A"}</p>
                        <p><strong>Sub Category:</strong> {selectedPost.sub_category}</p>
                        <p><strong>Work Type:</strong> {selectedPost.work_type === 0 ? "Full-time" : "Part-time"}</p>
                        <p><strong>Days Until End:</strong> {selectedPost.days_post_end} days</p>
                        <p><strong>Post Created At:</strong> {new Date(selectedPost.created_at).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
