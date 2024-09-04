import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { IoMdArrowBack } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";


export default function Dashboard({ auth }) {
    const [data, setData] = useState([]);
    const [Attachment, setAttachment] = useState ([]);
    const [click, setClick] = useState(false);
    const [details, setDetails] = useState([]);
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        fetchData();

        const interval = setInterval(() => {
            updateElapsedTime();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (click) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [click]);

    const fetchData = () => {
        axios
            .get("/dashboard-data")
            .then((response) => {
                setData(response.data.jobOffers);
                setAttachment(response.data.Attachment)
                setProfileData(response.data.profileData);
                console.log("Profile Data:", response.data.profileData); // Debugging step
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const updateElapsedTime = () => {
        setData((prevData) =>
            prevData.map((item) => ({
                ...item,
                elapsedTime: calculateElapsedTime(item.created_at),
            }))
        );
    };

    const calculateElapsedTime = (createdAt) => {
        const now = new Date();
        const createdAtDate = new Date(createdAt);
        const diffMs = now - createdAtDate;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
            return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        } else if (diffHours > 0) {
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
        } else {
            return `${diffSeconds} second${diffSeconds !== 1 ? "s" : ""} ago`;
        }
    };

    // Explicitly check for undefined, null, and empty values
    const isProfileIncomplete = !profileData.id_number || profileData.id_number.trim() === "" || !profileData.password || profileData.password.trim() === "";

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            
            <div className="flex justify-between items-start mt-4 space-x-10">
                <div className="flex flex-col border-t border-gray-300 w-full">
                    {data.map((item) => (
                        <div
                            className="flex flex-col space-y-4 border-b border-gray-300 py-2 px-4 hover:bg-gray-100 cursor-pointer ease-in duration-150"
                            key={item.id}
                            onClick={() => {
                                setDetails(item);
                                setClick(true);
                            }}
                        >
                            <div className="mt-1">
                                <p className="text-gray-500 text-xs">
                                    Posted{" "}
                                    {item.elapsedTime ||
                                        calculateElapsedTime(
                                            item.created_at
                                        )}{" "}
                                    by {item.user.firstName}{" "}
                                    {item.user.lastName}
                                </p>
                                <h1 className="text-2xl font-medium ">
                                    {item.job_title}
                                </h1>
                            </div>
                            <div>
                                <button className="rounded-full p-2 bg-gray-200 text-gray-500 text-sm font-medium">
                                    {item.category}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col bg-gray-200 w-1/4 rounded-lg p-4 space-y-4 sticky top-[70px]">
                    <div className="flex items-start space-x-5">
                        <img
                            src={
                                profileData.avatar
                                    ? profileData.avatar
                                    : "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-Pic.png"
                            }
                            width={55}
                        />
                        <div>
                            <p className="text-xl font-semibold">
                                {profileData.firstName} {profileData.lastName}
                            </p>
                        </div>
                    </div>

                    {/* Link to profile.edit */}
                    <Link
                        href={route("profile.edit")}
                        className={`underline text-sm ${
                            isProfileIncomplete ? "text-red-600" : "text-blue-600"
                        }`}
                    >
                        Complete your profile
                    </Link>
                    <div className="flex items-center bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                        <div
                            className={`h-1.5 rounded-full ${
                                isProfileIncomplete
                                    ? "bg-red-600"
                                    : "bg-blue-600"
                            }`}
                            style={{
                                width:
                                    !isProfileIncomplete
                                        ? "100%"
                                        : "50%",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex">
    {/* Background overlay */}
            <div
                onClick={() => setClick(false)}
                className={`fixed top-0 w-full h-screen bg-black opacity-50 ease-in-out duration-500 cursor-pointer ${
                    click ? "left-0" : "left-[-100%]"
                }`}
            ></div>
                        <h1>HEy</h1>

                        <div className={`fixed top-14 w-8/12 h-[92vh] shadow-md bg-white text-black ${click ? "right-100" : "right-[-100%]"} ease-in-out duration-500 p-4 space-y-4 overflow-y-auto`}>
                                <div className="flex items-center justify-between">
                                    <IoMdArrowBack size={25} onClick={() => setClick(false)} className="cursor-pointer" />
                                    <ImNewTab size={25} />
                                </div>

                                <div className="flex mx-8 flex-col space-y-8">
                                    {/* Job Title */}
                                    <h1 className="font-bold text-3xl italic underline text-gray-800">{click ? details.job_title : ""}</h1>

                                    {/* Job Description */}
                                    <article className="leading-6">{click ? details.job_description : ""}</article>

                                    {/* Attachments */}
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-gray-500 text-sm">Attachments:</p>
                                        {click && details.attachments && details.attachments.length > 0 ? (
                                            details.attachments.map((attachment) => (
                                                <a href={attachment.attachment_path} target="_blank" rel="noopener noreferrer" key={attachment.id} className="text-blue-500">
                                                    <FaFileAlt className="text-lg" />
                                                </a>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-xs">No attachments available</p>
                                        )}
                                    </div>

                                    {/* Proposal Details */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">Enter Your Proposal Details</label>
                                        <textarea
                                            className="mt-1 block w-full px-3 py-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Provide general info about your proposal, e.g., what you can deliver and when, why you think you can do the project, etc."
                                        ></textarea>
                                    </div>

                                    {/* Attachments */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">Attachments</label>
                                        <input type="file" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>



                                    {/* Submit Button */}
                                    <div className="mt-4 flex justify-end">
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Submit Proposal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    


        </AuthenticatedLayout>
    );
}
