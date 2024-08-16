import React, { useState, useRef } from 'react'; // Import useState and useRef
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Ensure this path is correct

export default function PostProject({ auth }) {
    const [isTermsChecked, setIsTermsChecked] = useState(false); // useState to track checkbox status
    const fileInputRef = useRef(null);

    // Function to handle the "Browse" click event
    const handleBrowseClick = () => {
        fileInputRef.current.click(); // Trigger the hidden file input's click event
    };

    const handleTermsChange = (e) => {
        setIsTermsChecked(e.target.checked);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Post Project
                </h2>
            }
        >
            <div className="bg-gray-100 py-10">
                {/* Main section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-md rounded-lg px-8 py-6">
                        {/* Title Section */}
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Looking for Freelancers?
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Post Your Job Here and Connect with Talented Cecian Freelancers Today!
                            </p>
                        </div>

                        {/* Form Section */}
                        <form>
                            {/* Title Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    What Do You Need To Get Done
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Title"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                            </div>

                            {/* Category Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                        Pick Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option>Video Editing</option>
                                        <option>Photo Editing</option>
                                        
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-category">
                                        Sub-category
                                    </label>
                                    <input
                                        id="sub-category"
                                        name="sub-category"
                                        type="text"
                                        placeholder="Sub-category"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            {/* Description Input */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Description about what you need"
                                    rows="4"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                ></textarea>
                            </div>

                            {/* File Upload Section */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uploads">
                                    Upload Samples and Other Helpful Material
                                </label>
                                <div
                                    className="border-2 border-dashed border-gray-400 rounded-lg h-24 flex justify-center items-center cursor-pointer"
                                    onClick={handleBrowseClick} // Handle the click event to trigger file input
                                >
                                    <span className="text-gray-500 text-sm">
                                        Drop files here or <span className="text-yellow-500 underline">Browse</span> to add attachments
                                    </span>
                                </div>
                                <input
                                    id="uploads"
                                    name="uploads"
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef} // Attach reference to the input
                                />
                            </div>

                            {/* Additional Fields */}
                            <div className="grid md:grid-cols-4 gap-2 mb-6">
                                {/* Work Type */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="work-type">
                                        Work Type
                                    </label>
                                    <select
                                        id="work-type"
                                        name="work-type"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    >
                                        <option>full Time</option>
                                        <option>Part Time</option>
                                        
                                        
                                    </select>
                                    
                                </div>

                                {/* Currency */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
                                        Currency
                                    </label>
                                    <p className="py-1"
                                    >PHP* </p>
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                                        Budget (Optional)
                                    </label>
                                    <input
                                        id="budget"
                                        name="budget"
                                        type="Number"
                                        placeholder="₱"
                                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                    />
                                </div>
                            </div>

                            {/* Days to Post End */}
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="days-post-end">
                                    Days Post End
                                </label>
                                <input
                                    id="days-post-end"
                                    name="days-post-end"
                                    type="Number"
                                    className="shadow appearance-none border rounded  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring"
                                />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        onChange={handleTermsChange} // Add onChange event
                                    />
                                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                        I have read CEC-Trabahanap's <a href="#" className="text-blue-600 underline">Terms of Service</a> and agree to them. I have read and understood CEC-Trabahanap's <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring ${!isTermsChecked ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable styling
                                    disabled={!isTermsChecked} // Disable the button if terms are not checked
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
