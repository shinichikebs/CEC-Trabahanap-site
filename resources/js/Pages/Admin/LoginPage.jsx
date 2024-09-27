import React, { useState, useEffect } from 'react';
import axios from 'axios'; // To send the login request

export default function LoginPage() {
    // State to store form inputs
    const [idNumber, setIdNumber] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState(''); // CSRF token state
    const [errors, setErrors] = useState({}); // State to store errors

    // Fetch CSRF token from the meta tag when the component mounts
    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        setCsrfToken(token);
    }, []);
    

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        try {
            // Send login request to the backend
            const response = await axios.post('/admin/login', {
                id_number: idNumber,
                password: password,
            }, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken // Include CSRF token in the headers
                }
            });

            // Handle successful login (you can redirect or show a success message)
            if (response.data.redirect) {
                window.location.href = response.data.redirect;
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Display validation errors
                setErrors(error.response.data.errors);
            } else {
                // Handle any other errors
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        }
    };

    return (
        <div className="h-screen bg-cover bg-center relative flex justify-center items-center"
             style={{ backgroundImage: `url(/cec.jpg)` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="h-screen bg-cover bg-center relative flex justify-center items-center z-[10]">
                {/* Form container */}
                <div className="p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                    {/* Logo and Title */}
                    <div className="mb-6">
                        <img src="/cec.png" alt="CEC Trabahanap Logo" className="mx-auto w-24 mb-4" />
                        <h1 className="text-white text-3xl font-style: italic font-light">CEC-Trabahanap</h1>
                    </div>

                    {/* Login form */}
                    <h2 className="text-white text-2xl font-light mb-6">LOG IN</h2>
                    <form onSubmit={handleSubmit}>
                        {/* ID Number Field */}
                        <div className="mb-4">
                            <input 
                                type="text" 
                                id="id-number" 
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)} // Update state
                                placeholder="ID Number" 
                                className={`w-full px-4 py-2 border ${errors.id_number ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.id_number && <p className="text-red-500 text-sm mt-1">{errors.id_number}</p>} {/* Error message */}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update state
                                placeholder="Password" 
                                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>} {/* Error message */}
                        </div>

                        {/* General Error */}
                        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all duration-300">
                            LOG IN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
