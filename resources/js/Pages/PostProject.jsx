import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { AiOutlineLoading3Quarters, AiFillFile } from "react-icons/ai";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export default function PostProject({ auth, jobOffer }) {
    const [formData, setFormData] = useState({
        title: jobOffer?.job_title || "",
        category: jobOffer?.category || "",
        customCategory: "",
        subCategory: jobOffer?.subCategory || "",
        description: jobOffer?.job_description || "",
        uploads: [],
        workType: jobOffer?.workType || "",
        budget: jobOffer?.budget || "",
        daysPostEnd: jobOffer?.daysPostEnd || "",
        terms: false,
    });

    const [errors, setErrors] = useState({});
    const [uploadStatus, setUploadStatus] = useState([]);
    const [existingFiles, setExistingFiles] = useState(
        jobOffer?.attachments || []
    );
    const [termsWarning, setTermsWarning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fileWarning, setFileWarning] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        checkFormValidity();
    }, [formData, errors]);

    const validateField = (field, value) => {
        let errorMsg = "";
        switch (field) {
            case "title":
                if (!value) errorMsg = "Title is required.";
                break;
            case "category":
                if (!value) errorMsg = "Category is required.";
                break;
                case "customCategory":
                    if (formData.category === "Others" && !value) {
                        errorMsg = "Custom category is required when 'Others' is selected.";
                    }
                    break;
            case "description":
                if (!value) errorMsg = "Description is required.";
                break;
            case "budget":
                if (value && !/^\d+$/.test(value)) {
                    errorMsg =
                        "Budget must be a valid numeric amount without commas or decimal points (e.g., 1000).";
                }
                break;
                case "workType":
                    if (!value) errorMsg = "Work type is required.";
                    break;
                case "daysPostEnd":
                    if (!value || isNaN(value))
                        errorMsg = "Days to post end must be a valid number.";
                    break;
            case "terms":
                if (!value) errorMsg = "You must agree to the terms.";
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMsg }));
    };
    

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        const fieldValue = name === "terms" ? checked : value;
        setFormData({ ...formData, [name]: fieldValue });
        validateField(name, fieldValue);
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        // Check file sizes
        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            setFileWarning('Some files are too large to upload. Please choose files smaller than 2MB.');
            return;
        } else {
            setFileWarning('');
        }

        setFormData({ ...formData, uploads: files });

        const initialStatus = files.map(file => ({ file, status: 'uploading' }));
        setUploadStatus(initialStatus);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileData = new FormData();
            fileData.append('file', file);

            try {
                await fakeUploadFile(fileData);

                setUploadStatus((prevStatus) =>
                    prevStatus.map((status, index) =>
                        index === i ? { ...status, status: 'done' } : status
                    )
                );
            } catch (error) {
                console.error('Upload error:', error);
                setUploadStatus((prevStatus) =>
                    prevStatus.map((status, index) =>
                        index === i ? { ...status, status: 'error' } : status
                    )
                );
            }
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
    
        if (!formData.terms) {
            setTermsWarning(true);
            return;
        }
    
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "uploads") {
                for (const file of formData.uploads) {
                    data.append("uploads[]", file);
                }
            } else if (key === "category" && formData.category === "Others") {
                // Replace "Others" with customCategory value
                data.append("category", formData.customCategory || "");
            } else {
                data.append(key, formData[key] || "");
            }
        });
    
        // Debug: Log the FormData contents
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
    
        const routeUrl = jobOffer
            ? `/post-project/${jobOffer.id}/update`
            : "/post-project-offer";
    
        router.post(routeUrl, data, {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(true);
                setFormData({
                    title: "",
                    category: "",
                    subCategory: "",
                    description: "",
                    uploads: [],
                    workType: "",
                    budget: "",
                    daysPostEnd: "",
                    terms: false,
                });
                setUploadStatus([]);
            },
            onError: (errors) => {
                console.error("Error:", errors);
            },
        });
    };
    
    
    

    const checkFormValidity = () => {
        const isValid =
            Object.values(errors).every((error) => !error) &&
            formData.title &&
            formData.category &&
            (formData.category !== "Others" || formData.customCategory) && // Ensure customCategory is filled only if category is "Others"
            formData.description &&
            formData.terms;
    
        setIsFormValid(isValid);
    };
    const fakeUploadFile = (formData) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve("File uploaded successfully"), 2000);
        });
    };

    const handleSelectedChange = (e) => {
        const { name, value } = e.target;
    
        // Update formData based on category selection
        if (name === "category") {
            if (value !== "Others") {
                // Clear customCategory if not "Others"
                setFormData({ ...formData, category: value, customCategory: "" });
            } else {
                // Allow input for customCategory when "Others" is selected
                setFormData({ ...formData, category: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="bg-purple-900 text-white py-4 px-6 shadow-lg">
                    
                    <h2 className="font-semibold text-xl leading-tight">
                        {jobOffer ? "Edit Project" : "Post Project"}
                    </h2>
                </div>
            }
        >
            <div className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg px-8 py-6">
                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="title"
                                >
                                    Post Job Offers
                                </label>
                                <input
                                    required
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                                {errors.title && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="category"
                                    >
                                        Pick Category
                                    </label>
                                    <select
                                        required
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleSelectedChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        <option value="Video Editing">
                                            Video Editing
                                        </option>
                                        <option value="Photo Editing">
                                            Photo Editing
                                        </option>
                                        <option value="Others">Others</option>
                                    </select>

                                    {/* Show the "Specify Category" input only if "Others" is selected */}
                                    {formData.category === "Others" && (
                                        <div className="mt-4">
                                            <label
                                                className="block text-gray-700 text-sm font-bold mb-2"
                                                htmlFor="customCategory"
                                            >
                                                Specify Category
                                            </label>
                                            <input
                                                type="text"
                                                id="customCategory"
                                                name="customCategory"
                                                placeholder="Enter your custom category"
                                                value={formData.customCategory}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        customCategory:
                                                            e.target.value,
                                                    })
                                                }
                                                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                            />
                                        </div>
                                    )}

                                    {errors.category && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="sub-category"
                                    >
                                        sub-category
                                    </label>
                                    <input
                                        id="sub-category"
                                        name="subCategory"
                                        type="text"
                                        placeholder="sub-category"
                                        value={formData.subCategory}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    required
                                    id="description"
                                    name="description"
                                    placeholder="Description about what you need"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                ></textarea>
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="mb-6">
                                <h1 className="flex flex-col text-gray-700 text-sm font-bold mb-2">Upload Samples and Other Helpful Material</h1>
                                <h2 className="font-small text-yellow-400">Warning! Do not submit documents that contains confidential information.</h2>
                                <div>
                                    <label className="block w-full h-24 flex justify-center items-center border-2 border-dashed border-gray-400 rounded-lg items-center cursor-pointer" htmlFor="uploads">
                                        {uploadStatus.length > 0 ? (
                                            <div className="flex flex-col space-y-2">
                                                {uploadStatus.map((fileStatus, index) => (
                                                    <div key={index} className="flex items-center space-x-2">
                                                        {fileStatus.status === 'uploading' ? (
                                                            <AiOutlineLoading3Quarters className="animate-spin text-blue-500" size={20} />
                                                        ) : (
                                                            <AiFillFile className="text-green-500" size={20} />
                                                        )}
                                                        <span className="text-gray-700 text-sm">
                                                            {fileStatus.file.name} - {fileStatus.status === 'uploading' ? 'Uploading...' : 'Done uploading'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span>Drop files here or Browse to add attachments</span>
                                        )}
                                    </label>
                                    <input
                                        id="uploads"
                                        name="uploads[]"
                                        type="file"
                                        onChange={handleFileChange}
                                        multiple
                                        className="hidden"
                                    />
                                </div>
                                {existingFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h2 className="text-sm font-semibold text-gray-700">Existing Attachments:</h2>
                                        <ul>
                                            {existingFiles.map((file, index) => (
                                                <li key={index} className="text-sm text-gray-600">{file.attachment_path}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {fileWarning && (
                                    <p className="text-red-600 text-sm mt-2">{fileWarning}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="work-type"
                                    >
                                        Work Type
                                    </label>
                                    <select
                                        id="work-type"
                                        name="workType"
                                        value={formData.workType}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option value="">
                                            Select Work Type
                                        </option>
                                        <option value="1">Full Time</option>
                                        <option value="2">Part Time</option>
                                    </select>
                                    {errors.workType && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.workType}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Currency
                                    </label>
                                    <p className="py-1">PHP*</p>
                                </div>

                                <div>
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="budget"
                                    >
                                        Budget (Optional)
                                    </label>
                                    <input
                                        id="budget"
                                        name="budget"
                                        type="text"
                                        placeholder="₱"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                    {errors.budget && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.budget}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="days-post-end"
                                >
                                    Project Duration
                                </label>
                                <input
                                    id="days-post-end"
                                    name="daysPostEnd"
                                    type="number"
                                    value={formData.daysPostEnd}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                                {errors.daysPostEnd && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.daysPostEnd}
                                    </p>
                                )}
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={formData.terms}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="ml-2 text-sm text-gray-600"
                                    >
                                        I have read and agree to the{" "}
                                        <a
                                            href="https://docs.google.com/document/d/1zZSdQuxgD4Vm4V2m_NXC4ysBd7vzIPiZnP4xlGbZy4Q/edit?usp=sharing"
                                            className="text-blue-600 underline"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="https://docs.google.com/document/d/1yjudtsYQX_W_MAxhfz7CRSY9Ek8iejUAlk44r5teFro/edit?usp=sharing"
                                            className="text-blue-600 underline"
                                        >
                                            Privacy Policy
                                        </a>
                                        .
                                    </label>
                                </div>
                                {termsWarning && (
                                    <p className="text-red-600 text-sm">
                                        You must agree to the Terms of Service.
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring ${
                                        !isFormValid
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                    disabled={!isFormValid}
                                >
                                    {jobOffer
                                        ? "UPDATE PROJECT"
                                        : "POST PROJECT"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto text-center">
                        <h2 className="text-xl font-semibold mb-4">Success</h2>
                        <p className="text-gray-700 mb-4">
                            {jobOffer
                                ? "Project successfully updated!"
                                : "Project uploaded successfully!"}
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
