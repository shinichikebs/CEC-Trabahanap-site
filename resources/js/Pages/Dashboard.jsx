import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { IoMdArrowBack } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ auth }) {
    const [data, setData] = useState([]);
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
                setProfileData(response.data.profileData);
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
                            <div className="mt-4">
                                <p className="text-gray-500 text-xs">
                                    Posted{" "}
                                    {item.elapsedTime ||
                                        calculateElapsedTime(
                                            item.created_at
                                        )}{" "}
                                    by {item.user.firstName}{" "}
                                    {item.user.lastName}
                                </p>
                                <h1 className="text-2xl font-medium mt-1">
                                    {item.job_title}
                                </h1>
                            </div>
                            <div>
                                <article>{item.job_description}</article>
                                <button className="rounded-full p-2 bg-gray-200 text-gray-500 mt-4 mb-4 text-sm font-medium">
                                    {item.category}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col bg-gray-200 w-1/4 rounded-lg p-4 space-y-4 sticky top-[10px]">
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
                            {/* <p className="text-xs font-medium leading-none text-center">
                                {profileData.role}
                            </p> */}
                        </div>
                    </div>
                    <a className="underline text-sm text-blue-600">
                        Complete your profile
                    </a>
                    <div className="flex items-center bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500"
                            style={{
                                width:
                                    `${profileData.id_number}` == "05173923"
                                        ? "50%"
                                        : "100%",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="flex">
                <div
                    onClick={() => setClick(false)}
                    className={`fixed top-0 w-full h-screen bg-black opacity-50 ease-in-out duration-500 cursor-pointer ${
                        click ? "left-0" : "left-[-100%]"
                    }`}
                ></div>
                <div
                    className={`fixed top-0 w-8/12 h-full shadow-md bg-white text-black ${
                        click ? "right-0" : "right-[-100%]"
                    } ease-in-out duration-500 p-4 space-y-4 overflow-auto scroll-hidden`}
                >
                    <div className="flex items-center justify-between">
                        <IoMdArrowBack
                            size={25}
                            onClick={() => setClick(false)}
                            className="cursor-pointer"
                        />
                        <ImNewTab size={25} />
                    </div>
                    <div className="flex mx-8">
                        <div className="flex flex-col w-full space-y-8">
                            <h1 className="font-bold text-3xl italic underline text-gray-800">
                                {click ? details.job_title : ""}
                            </h1>
                            <article className="leading-6">
                                {click ? details.job_description : ""}
                            </article>
                        </div>
                        <div className="flex flex-col items-center w-1/2">
                            Open Job
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
