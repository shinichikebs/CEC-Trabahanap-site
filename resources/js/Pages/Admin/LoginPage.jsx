import React, { useState, useEffect } from "react";
import axios from "axios"; // To send the login request

export default function LoginPage() {
    const [idNumber, setIdNumber] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form inputs
        const formErrors = {};
        if (!idNumber) {
            formErrors.id_number = "ID Number is required";
        }
        if (!password) {
            formErrors.password = "Password is required";
        }

        // If errors exist, set them and stop form submission
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        } else {
            setErrors({}); // Clear any existing errors if inputs are valid
        }

        console.log("ID Number:", idNumber);
        console.log("Password:", password);

        const data = {
            id_number: idNumber,
            password: password,
        };

        try {
            console.log("Attempting to fetch CSRF token...");

            // Step 1: Fetch the CSRF cookie
            const csrfResponse = await axios.get("/sanctum/csrf-cookie");
            console.log("CSRF Token fetched:", csrfResponse.status);

            // Step 2: Proceed with login request
            console.log("Attempting login with data:", data);
            const response = await axios.post("/admin/login", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });


            console.log("Login successful", response.data);
            
            // Handle the successful login response here
        } catch (error) {
            // Detailed error handling
            if (error.response) {
                // Server responded with a status outside the 2xx range
                console.error("Error Response Data:", error.response.data);
                console.error("Error Response Status:", error.response.status);
                setErrors({
                    general: `Login failed: ${
                        error.response.data.message ||
                        "Please check your credentials."
                    }`,
                });
            } else if (error.request) {
                // No response received from the server
                console.error("No response received:", error.request);
                setErrors({
                    general:
                        "Network error: Failed to reach the server. Check if the backend is running.",
                });
            } else {
                // Error occurred while setting up the request
                console.error("Error in setting up request:", error.message);
                setErrors({
                    general: `Unexpected error: ${error.message}`,
                });
            }
        }
    };

    return (
        <div
            className="h-screen bg-cover bg-center relative flex justify-center items-center"
            style={{ backgroundImage: `url(/cec.jpg)` }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="h-screen bg-cover bg-center relative flex justify-center items-center z-[10]">
                {/* Form container */}
                <div className="p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                    {/* Logo and Title */}
                    <div className="mb-6">
                        <img
                            src="/cec.png"
                            alt="CEC Trabahanap Logo"
                            className="mx-auto w-24 mb-4"
                        />
                        <h1 className="text-white text-3xl font-style: italic font-light">
                            CEC-Trabahanap
                        </h1>
                    </div>

                    {/* Login form */}
                    <h2 className="text-white text-2xl font-light mb-6">
                        LOG IN
                    </h2>
                    <form onSubmit={handleSubmit}>
                        {/* ID Number Field */}
                        <div className="mb-4">
                            <input
                                type="text"
                                id="id_number"
                                value={idNumber}
                                onChange={(e) => setIdNumber(e.target.value)}
                                placeholder="ID Number"
                                className={`w-full px-4 py-2 border ${
                                    errors.id_number
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.id_number && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.id_number}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full px-4 py-2 border ${
                                    errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* General Error */}
                        {errors.general && (
                            <p className="text-red-500 text-sm mb-4">
                                {errors.general}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all duration-300"
                        >
                            LOG IN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
