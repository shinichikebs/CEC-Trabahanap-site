import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { AiOutlineLoading3Quarters, AiFillFile } from 'react-icons/ai'; // Icons for loading and file

export default function PostProject({ auth }) {
    const [formData, setFormData] = useState({
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

    const [uploadStatus, setUploadStatus] = useState([]); // New state to track upload status

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, uploads: files });

        // Set initial status as 'uploading' for each file
        const initialStatus = files.map(file => ({ file, status: 'uploading' }));
        setUploadStatus(initialStatus);
    };

    const handleTermsChange = (e) => {
        setFormData({ ...formData, terms: e.target.checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.keys(formData).forEach(key => {
            if (key === 'uploads') {
                for (const file of formData.uploads) {
                    data.append('uploads[]', file);
                }
            } else {
                data.append(key, formData[key]);
            }
        });

        // Handle file upload with progress indication
        router.post('/post-project-offer', data, {
            forceFormData: true,
            onProgress: (event) => {
                // Update the status based on the progress
                const percentCompleted = Math.round((event.loaded * 100) / event.total);

                setUploadStatus((prevStatus) =>
                    prevStatus.map((status) =>
                        status.status === 'uploading' && percentCompleted === 100
                            ? { ...status, status: 'done' }
                            : status
                    )
                );
            },
            onSuccess: () => {
                console.log('Success');
            },
            onError: (errors) => {
                console.error('Error:', errors);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Post Project</h2>}>
            <div className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg px-8 py-6">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            @csrf
                            {/* Title Input */}
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

                            {/* Category Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                                        {/* Add more options as needed */}
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

                            {/* Description Input */}
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

                            {/* File Upload Section */}
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
                            </div>

                            {/* Additional Fields */}
                            <div className="grid md:grid-cols-4 gap-2 mb-6">
                                {/* Work Type */}
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
                                        <option value="full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </div>

                                {/* Currency */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Currency</label>
                                    <p className="py-1">PHP*</p>
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">Budget (Optional)</label>
                                    <input
                                        id="budget"
                                        name="budget"
                                        type="number"
                                        placeholder="₱"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            {/* Days to Post End */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="days-post-end">Days Post End</label>
                                <input
                                    required
                                    id="days-post-end"
                                    name="daysPostEnd"
                                    type="number"
                                    value={formData.daysPostEnd}
                                    onChange={(e) => setFormData({ ...formData, daysPostEnd: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                            </div>

                            {/* Terms and Conditions */}
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
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring ${!formData.terms ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!formData.terms}
                                >
                                    POST PROJECT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
