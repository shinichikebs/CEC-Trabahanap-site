import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { IoMdArrowBack } from "react-icons/io";
import { ImNewTab } from "react-icons/im";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";

function SuccessModal({ showModal, closeModal }) {
    return (
        showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">Proposal Sent Successfully!</h2>
                    <p className="text-gray-700 mb-4">Your proposal has been sent successfully.</p>
                    <div className="flex justify-center">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

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

function CategoryFilterModal({ isOpen, categories, selectedCategories, setSelectedCategories, onClose }) {
    const handleCategoryChange = (category) => {
        const updatedCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((cat) => cat !== category)
            : [...selectedCategories, category];

        setSelectedCategories(updatedCategories);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Filter By Category</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            Close
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="mt-4 space-y-4">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    className="cursor-pointer"
                                />
                                <label htmlFor={`category-${category}`} className="cursor-pointer text-gray-700">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

export default function Dashboard({ auth }) {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [click, setClick] = useState(false);
    const [details, setDetails] = useState({});
    const [proposalText, setProposalText] = useState("");
    const [proposalAttachment, setProposalAttachment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const fileInputRef = useRef(null);
    const MAX_FILE_SIZE = 30 * 1024 * 1024;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            setFilteredData(data.filter((job) => selectedCategories.includes(job.category)));
        } else {
            setFilteredData(data);
        }
    }, [selectedCategories, data]);

    const fetchData = () => {
        axios
            .get("/dashboard-data")
            .then((response) => {
                setData(response.data.jobOffers);
                setFilteredData(response.data.jobOffers);
                setCategories([...new Set(response.data.jobOffers.map((job) => job.category))]);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["application/pdf", "application/msword", "image/jpeg", "image/png", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // For .docx files
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"];

        if (file && allowedTypes.includes(file.type)) {
            if (file.size <= MAX_FILE_SIZE) {
                setProposalAttachment(file);
                setErrorMessage("");
            } else {
                setErrorMessage("The file size exceeds the 30MB limit.");
                setShowErrorModal(true);
            }
        } else {
            setErrorMessage("Please upload a valid file.");
            setShowErrorModal(true);
        }
    };

    const handleProposalSubmit = async (e) => {
        e.preventDefault();

        if (!proposalAttachment && proposalText.trim() === "") {
            setErrorMessage("Proposal text or attachment is required.");
            setShowErrorModal(true);
            return;
        }

        const formData = new FormData();
        formData.append("proposal_text", proposalText);
        formData.append("job_offer_id", details.id);
        if (proposalAttachment) {
            formData.append("attachment", proposalAttachment);
        }

        try {
            await axios.post("/submit-proposal", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setShowModal(true);
            setProposalText("");
            setProposalAttachment(null);
        } catch (error) {
            setErrorMessage("Error submitting the proposal.");
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

            <div className="p-4 flex flex-col lg:flex-row">
                {/* Filter Button for Mobile */}
                <button
                    onClick={() => setIsFilterModalOpen(true)}
                    className="lg:hidden bg-blue-600 text-white py-2 mb-4 rounded-lg"
                >
                    Filter Categories
                </button>

                {/* Sidebar Filter for Desktop */}
                <div className="hidden lg:block lg:w-64 bg-gray-100 h-auto lg:h-screen p-4 border-r">
                    <h3 className="text-lg font-semibold mb-4">Filter by Category</h3>
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`category-${category}`}
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => setSelectedCategories((prev) =>
                                        prev.includes(category)
                                            ? prev.filter((cat) => cat !== category)
                                            : [...prev, category]
                                    )}
                                    className="cursor-pointer"
                                />
                                <label
                                    htmlFor={`category-${category}`}
                                    className="cursor-pointer text-gray-700"
                                >
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow p-4">
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="border-b py-4 px-6 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setDetails(item);
                                setClick(true);
                            }}
                        >
                            <h1 className="text-2xl font-medium">{item.job_title}</h1>
                            <p className="text-sm text-gray-500">
                                Posted by {item.user.firstName} {item.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">Category: {item.category}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Filter Modal for Mobile */}
            <CategoryFilterModal
                isOpen={isFilterModalOpen}
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                onClose={() => setIsFilterModalOpen(false)}
            />

            {/* Proposal Details */}
            {click && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-5xl lg:max-w-5xl h-auto lg:h-5/6 overflow-y-auto p-6 rounded-lg shadow-lg relative">
                        <IoMdArrowBack
                            className="absolute top-7 left-4 cursor-pointer text-gray-500"
                            size={24}
                            onClick={() => setClick(false)}
                        />
                        <h1 className="text-3xl font-semibold mt-8 mb-5">{details.job_title}</h1>
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Description:</h2>
                            <p className="text-gray-600">{details.job_description || "No description provided."}</p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Category:</h2>
                            <p className="text-gray-600">{details.category || "N/A"}</p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Budget:</h2>
                            <p className="text-gray-600">₱{details.budget || "N/A"}</p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Work Type</h2>
                            <p className="text-gray-600">
                                {details.work_type === 1
                                    ? "Full Time"
                                    : details.work_type === 2
                                    ? "Part Time"
                                    : "N/A"}
                            </p>

                        </div>
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Project Duration:</h2>
                            <p className="text-gray-600">{details.days_post_end || "N/A"}</p>
                        </div>
                        {/* Attachments */}
                        <div className="mb-4">
                            <h2 className="font-medium text-gray-700">Attachments:</h2>

                            {details.attachments && details.attachments.length > 0 ? (
                                details.attachments.map((attachment) => (
                                    <a
                                        key={attachment.id}
                                        href={attachment.attachment_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline block"
                                    >
                                        <FaFileAlt className="inline mr-2" /> {attachment.file_name || "Attachment"}
                                    </a>
                                ))
                            ) : (
                                <p className="text-gray-600">No attachments available.</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <h2 className="font-medium text-gray-700">Submit Proposal:</h2>
                            <textarea
                                className="w-full border p-2 mt-2 rounded-md"
                                placeholder="Enter your proposal details..."
                                value={proposalText}
                                onChange={(e) => setProposalText(e.target.value)}
                            />
                           
                             <h2 className="font-medium text-gray-700  mt-3">Submit Proposal Documents (eg. Portfolio):</h2>
                             <h2 className="font-small text-yellow-300">Warning! Do not submit documents that contains confidential information.</h2>
                            <input
                                type="file"
                                className="mt-2"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            </div>
                            <div className="mt-6">
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleProposalSubmit}
                            >
                                Submit Proposal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SuccessModal showModal={showModal} closeModal={() => setShowModal(false)} />
            <ErrorModal
                showErrorModal={showErrorModal}
                closeErrorModal={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </AuthenticatedLayout>
    );
}
