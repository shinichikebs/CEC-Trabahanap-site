import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";

export default function UserProfile({ user }) {
    const [selectedViolation, setSelectedViolation] = useState("");
    const [rating, setRating] = useState(0);

    const violations = [
        "Spam or fake profile",
        "Harassment or abuse",
        "Inappropriate content",
        "Other",
    ];

    const handleReportClick = () => {
        Swal.fire({
            title: "Are you sure you want to report this user?",
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
        Swal.fire({
            title: "Rate This User",
            input: "range",
            inputAttributes: {
                min: 1,
                max: 5,
                step: 1,
            },
            inputValue: rating,
            confirmButtonText: "Submit",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setRating(result.value);
                submitRating(result.value);
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
                    onClick={handleBackClick}
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

                {/* Profile Details Section */}
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

                    {/* Table Section */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-gray-800 mb-4">Details</h4>
                        <table className="w-full table-auto border-collapse border ">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border  px-4 py-2">POST</th>
                                    <th className="border  px-4 py-2">JOB DONE</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border  px-4 py-2 text-center">
                                        {user.posts || 0}
                                    </td>
                                    <td className="border  px-4 py-2 text-center">
                                        {user.jobsDone || 0}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
