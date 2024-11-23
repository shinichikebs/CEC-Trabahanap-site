import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";

export default function UserProfile({ user }) {
    const [approvedPosts, setApprovedPosts] = useState([]);
    const [doneJobs, setDoneJobs] = useState([]);
    const [isJobDoneVisible, setIsJobDoneVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(0);

    const violations = [
        "Spam or fake profile",
        "Harassment or abuse",
        "Inappropriate content",
        "Other",
    ];

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

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
        setIsModalOpen(false);
    };
    const handleReportClick = () => {
        Swal.fire({
            title: `Are you sure you want to report ${user.firstName} ${user.lastName}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        }).then((result) => {
            if (result.isConfirmed) {
                handleViolationSelection();
            }
        });
    };

    const handleViolationSelection = () => {
        Swal.fire({
            title: "Select the reason for reporting:",
            input: "select",
            inputOptions: violations.reduce((options, violation) => {
                options[violation] = violation;
                return options;
            }, {}),
            inputPlaceholder: "Select a violation",
            showCancelButton: true,
            confirmButtonText: "Submit",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            preConfirm: (selectedViolation) => {
                setSelectedViolation(selectedViolation);
                return selectedViolation || Swal.showValidationMessage("Please select a violation");
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleSubmitViolation(result.value);
            }
        });
    };

    const handleSubmitViolation = async (violation) => {
        try {
            await axios.post(route("reportted.user", { id: user.id }), {
                violation: violation,
            });
            Swal.fire({
                title: "User Reported",
                text: "Thank you for reporting this user.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
        } catch (error) {
            console.error("Error reporting user:", error);
            Swal.fire({
                title: "Error",
                text: "There was an error processing your report.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleRateClick = () => {
        let selectedRating = 0; // Local variable to track the selected rating
    
        Swal.fire({
            title: `Rate ${user.firstName} ${user.lastName}`,
            html: `
                <div style="font-size: 24px; display: flex; justify-content: center; gap: 5px;">
                    ${[1, 2, 3, 4, 5]
                        .map(
                            (star) =>
                                `<span data-star="${star}" style="cursor: pointer; color: gray;">★</span>`
                        )
                        .join("")}
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Submit Rating",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                if (selectedRating > 0) {
                    return selectedRating; // Return the selected rating to the handler
                }
                Swal.showValidationMessage("Please select a rating");
            },
            didOpen: () => {
                const stars = Swal.getHtmlContainer().querySelectorAll("[data-star]");
                stars.forEach((star) => {
                    star.addEventListener("click", () => {
                        const starValue = parseInt(star.getAttribute("data-star"));
                        selectedRating = starValue; // Update the selected rating
    
                        // Update star colors dynamically
                        stars.forEach((s) => {
                            s.style.color = parseInt(s.getAttribute("data-star")) <= starValue ? "gold" : "gray";
                        });
                    });
                });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                submitRating(result.value); // Pass the selected rating to the submission function
            }
        });
    };
    
    const submitRating = async (rate) => {
        try {
            await axios.post(route("rate.user", { id: user.id }), {
                rating: rate,
            });
            Swal.fire({
                title: "Rating Submitted",
                text: `You rated this user ${rate} star(s).`,
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
        } catch (error) {
            console.error("Error submitting rating:", error);
            Swal.fire({
                title: "Error",
                text: "There was an error submitting your rating.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };

    const handleBackClick = () => {
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={`${user.firstName} ${user.lastName} Profile`} />

            {/* Header */}
            <header className="bg-[#231955] py-4 px-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/cecLogo.png" alt="CeC Logo" className="w-10 h-10" />
                    <h1 className="text-[#E8AA42] text-lg font-semibold uppercase">
                        CEC-TRABAHANAP
                    </h1>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="text-[#E8AA42] bg-transparent border border-[#E8AA42] rounded-lg py-2 px-4 hover:bg-[#D18C33] hover:text-white transition duration-200"
                >
                    <IoMdArrowBack />
                </button>
            </header>

            {/* Profile Content */}
            <div className="flex flex-col lg:flex-row justify-between items-start mt-8 px-6 lg:px-20 space-y-6 lg:space-y-0">
                {/* User Info Section */}
                <div className="bg-gray-200 w-full lg:w-1/4 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={
                                user.avatar ||
                                "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            className="rounded-full w-24 h-24 mb-4"
                            loading="lazy"
                        />
                        <p className="text-xl font-semibold">
                            {user.firstName} {user.lastName}
                        </p>
                        <Link
                            href={route("chat.show", { id: user.id })}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Contact
                        </Link>

                        <button
                            onClick={handleRateClick}
                            className="mt-2 text-yellow-500 hover:underline"
                        >
                            ★★★★☆/Rate
                        </button>

                        <button
                            onClick={handleReportClick}
                            className="text-red-500 text-sm mt-2"
                        >
                            Report Profile
                        </button>
                    </div>
                </div>

                {/* Posts and Jobs Section */}
                <div className="w-full lg:w-3/4 bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        About {user.firstName}
                    </h3>
                    <p className="text-gray-600 mb-4">{user.bio || "This user has not added a bio."}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-800">Skills</h4>
                            <p className="text-gray-600">
                                {Array.isArray(user.skills)
                                    ? user.skills.join(", ")
                                    : user.skills || "No skills listed"}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Email</h4>
                            <p className="text-gray-600">{user.email || "Email not available"}</p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-60 mt-10">
                        <button
                            className={`text-lg ${
                                !isJobDoneVisible ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                            }`}
                            onClick={() => setIsJobDoneVisible(false)}
                        >
                            Posts
                        </button>
                        <button
                            className={`text-lg ${
                                isJobDoneVisible ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
                            }`}
                            onClick={() => setIsJobDoneVisible(true)}
                        >
                            Jobs Done
                        </button>
                    </div>

                    {/* Posts and Jobs Content */}
                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                        {!isJobDoneVisible ? (
                            <div className="approved-posts">
                                {approvedPosts.length > 0 ? (
                                    approvedPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="post-item mb-4 p-4 border border-gray-200 rounded-lg shadow-sm"
                                            onClick={() => handlePostClick(post)}
                                        >
                                            <p className="text-lg font-semibold">{post.job_title}</p>
                                            <p>{post.job_description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-600">No approved posts found.</p>
                                )}
                            </div>
                        ) : (
                            <div className="done-jobs">
                                {doneJobs.length > 0 ? (
                                    doneJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="job-item mb-4 p-4 border border-gray-200 rounded-lg shadow-sm"
                                        >
                                            <p className="text-lg font-semibold">{job.job_title}</p>
                                            <p>{job.job_description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-600">No jobs done found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Selected Post */}
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
                        <p><strong>Days Until End:</strong> {selectedPost.days_post_end} days</p>
                        <p><strong>Post Created At:</strong> {new Date(selectedPost.created_at).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
