import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { IoMdArrowBack } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import { useEffect, useState, useRef } from "react";  // Added useRef to handle file input reset
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";

// Modal Component for Success Messages
function SuccessModal({ showModal, closeModal }) {
    return (
        showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Proposal Sent Successfully!</h2>
                    <p className="text-gray-700 mb-4">Your proposal has been sent successfully.</p>
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
}

// Modal Component for Error Messages
function ErrorModal({ showErrorModal, closeErrorModal, errorMessage }) {
    return (
        showErrorModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-4">{errorMessage}</p>
                    <button
                        onClick={closeErrorModal}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
}

export default function Dashboard({ auth }) {
    const [data, setData] = useState([]);
    const [Attachment, setAttachment] = useState([]);
    const [click, setClick] = useState(false);
    const [details, setDetails] = useState([]);
    const [profileData, setProfileData] = useState({});
    const [proposalText, setProposalText] = useState('');
    const [proposalAttachment, setProposalAttachment] = useState(null);
    const [showModal, setShowModal] = useState(false); // For success modal control
    const [showErrorModal, setShowErrorModal] = useState(false); // For error modal control
    const [errorMessage, setErrorMessage] = useState(''); // Error message state

    const fileInputRef = useRef(null);  // To reset the file input

    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB in bytes

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
                setAttachment(response.data.Attachment);
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

    const isProfileIncomplete = !profileData.id_number || profileData.id_number.trim() === "" || !profileData.password || profileData.password.trim() === "";

  
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

        if (file && allowedTypes.includes(file.type)) {
            if (file.size <= MAX_FILE_SIZE) {
                setProposalAttachment(file);
                setErrorMessage(''); 
            } else {
                setErrorMessage('The file size exceeds the 30MB limit.');
                setShowErrorModal(true); 
                setProposalAttachment(null);
            }
        } else {
            setErrorMessage('Please upload a valid file. Accepted types are: .doc, .docx, .pdf, .jpg, .jpeg, .png');
            setShowErrorModal(true); 
            setProposalAttachment(null);
        }
    };

    const handleProposalSubmit = async (e) => {
        e.preventDefault();

        if (!proposalAttachment && proposalText.trim() === "") {
            setErrorMessage('Proposal text or attachment is required.');
            setShowErrorModal(true);
            return;
        }

        const formData = new FormData();
        formData.append('proposal_text', proposalText);
        formData.append('job_offer_id', details.id);
        if (proposalAttachment) {
            formData.append('attachment', proposalAttachment);
        }

        try {
            await axios.post('/submit-proposal', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setShowModal(true);  
            setErrorMessage('');
            setProposalText('');  
            setProposalAttachment(null);  
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; 
            }
        } catch (error) {
            setErrorMessage('Error submitting the proposal.');
            setShowErrorModal(true); 
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

                    {}
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
                {}
                <div
                    onClick={() => setClick(false)}
                    className={`fixed top-0 w-full h-screen bg-black opacity-50 ease-in-out duration-500 cursor-pointer ${
                        click ? "left-0" : "left-[-100%]"
                    }`}
                ></div>

                <div className={`fixed top-14 w-8/12 h-[92vh] shadow-md bg-white text-black ${click ? "right-100" : "right-[-100%]"} ease-in-out duration-500 p-4 space-y-4 overflow-y-auto`}>
                    <div className="flex items-center justify-between">
                        <IoMdArrowBack size={25} onClick={() => setClick(false)} className="cursor-pointer" />
                        <ImNewTab size={25} />
                    </div>

                    <div className="flex mx-8 flex-col space-y-8">
                        {}
                        <h1 className="font-bold  text-3xl italic underline text-gray-800 ">{click ? details.job_title : ""}</h1>

                        {}
                        <p className="text-3xl font-medium">Description</p>
                        <article className="leading-6 px-5">{click ? details.job_description : ""}</article>

                        {}
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

                        {}
                        <div className="mt-4">
                            <h1 className="text-3xl font-medium">New Proposal</h1>
                            <div className="px-4">
                                <label className="block text-sm font-medium text-gray-700 mt-2">Enter Your Proposal Details</label>
                                <textarea
                                    className="mt-2 block w-full px-3 py-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Provide general info about your proposal, e.g., what you can deliver and when, why you think you can do the project, etc."
                                    value={proposalText}
                                    onChange={(e) => setProposalText(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {}
                        <div className="mt-4 px-5">
                            <label className="block text-sm font-medium text-gray-700">Attachments</label>
                            <input
                                type="file"
                                className="mt-1 block px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                ref={fileInputRef}  
                            />
                        </div>

                        {}
                        <div className="mt-4 flex justify-end">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={handleProposalSubmit}>
                                Submit Proposal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <SuccessModal showModal={showModal} closeModal={() => setShowModal(false)} />

            {}
            <ErrorModal showErrorModal={showErrorModal} closeErrorModal={() => setShowErrorModal(false)} errorMessage={errorMessage} />
        </AuthenticatedLayout>
    );
}
