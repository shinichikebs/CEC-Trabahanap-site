import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { AiOutlineLoading3Quarters, AiFillFile } from 'react-icons/ai';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function PostProject({ auth, jobOffer }) { 
    const [formData, setFormData] = useState({
        title: jobOffer?.job_title || '',
        category: jobOffer?.category || '',
        subCategory: jobOffer?.subCategory || '',
        description: jobOffer?.job_description || '',
        uploads: [],
        workType: jobOffer?.workType || '',
        budget: jobOffer?.budget || '', 
        daysPostEnd: jobOffer?.daysPostEnd || '',
        terms: false,
    });

    const [uploadStatus, setUploadStatus] = useState([]);
    const [existingFiles, setExistingFiles] = useState(jobOffer?.attachments || []);
    const [termsWarning, setTermsWarning] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal state
    const [fileWarning, setFileWarning] = useState(''); // File size warning

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);

        // Check file sizes
        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            setFileWarning('Some files are too large to upload. Please choose files smaller than 5MB.');
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

    const handleTermsChange = (e) => {
        setFormData({ ...formData, terms: e.target.checked });
        setTermsWarning(false); // Remove warning when checkbox is checked
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.terms) {
            setTermsWarning(true); // Show warning if checkbox isn't checked
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'uploads') {
                for (const file of formData.uploads) {
                    data.append('uploads[]', file);
                }
            } else {
                data.append(key, formData[key] || '');
            }
        });

        // Check if the jobOffer exists, then perform update, otherwise create a new one
        const routeUrl = jobOffer ? `/post-project/${jobOffer.id}/update` : '/post-project-offer';

        router.post(routeUrl, data, {
            forceFormData: true,
            onSuccess: () => {
                setShowModal(true); // Show modal on success
                setFormData({
                    title: '',
                    category: '',
                    subCategory: '',
                    description: '',
                    uploads: [],
                    workType: '',
                    budget: '',
                    daysPostEnd: '',
                    terms: false,
                });
                setUploadStatus([]);
            },
            onError: (errors) => {
                console.error('Error:', errors);
            },
        });
    };

    const fakeUploadFile = (formData) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve("File uploaded successfully"), 2000);
        });
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="bg-purple-900 text-white py-4 px-6 shadow-lg">
                    <h2 className="font-semibold text-xl leading-tight">
                        {jobOffer ? 'Edit Project' : 'Post Project'}
                    </h2>
                </div>
            }
        >
            <div className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg px-8 py-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">What Do You Need To Get Done</label>
                                <input
                                    required
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Pick Category</label>
                                    <select
                                        required
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Video Editing">Video Editing</option>
                                        <option value="Photo Editing">Photo Editing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-category">Sub-category</label>
                                    <input
                                        id="sub-category"
                                        name="subCategory"
                                        type="text"
                                        placeholder="Sub-category"
                                        value={formData.subCategory}
                                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                                <textarea
                                    required
                                    id="description"
                                    name="description"
                                    placeholder="Description about what you need"
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                ></textarea>
                            </div>

                            {/* File Upload */}
                            <div className="mb-6">
                                <h1 className="flex flex-col text-gray-700 text-sm font-bold mb-2">Upload Samples and Other Helpful Material</h1>
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
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work-type">Work Type</label>
                                    <select
                                        id="work-type"
                                        name="workType"
                                        value={formData.workType}
                                        onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option value="">Select Work Type</option>
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
                                    <p className="py-1">PHP*</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">Budget (Optional)</label>
                                    <input
                                        id="budget"
                                        name="budget"
                                        type="decimal"
                                        placeholder="₱"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="days-post-end">Days Post End</label>
                                <input
                                    id="days-post-end"
                                    name="daysPostEnd"
                                    type="number"
                                    value={formData.daysPostEnd}
                                    onChange={(e) => setFormData({ ...formData, daysPostEnd: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        checked={formData.terms}
                                        onChange={handleTermsChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                        I have read and agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                                    </label>
                                </div>
                                {termsWarning && (
                                    <p className="text-red-600 text-sm">You must agree to the Terms of Service.</p>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring ${!formData.terms ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!formData.terms}
                                >
                                    {jobOffer ? 'UPDATE PROJECT' : 'POST PROJECT'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal for success message */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4">Success</h2>
                        <p className="text-gray-700 mb-4">{jobOffer ? 'Project successfully updated!' : 'Project uploaded successfully!'}</p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
