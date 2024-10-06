import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios"; // To send the login request

export default function LoginPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_number: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.login.submit"));
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
                    <form onSubmit={submit}>
                        {/* ID Number Field */}
                        <div className="mb-4">
                            <input
                                type="text"
                                id="id_number"
                                name="id_number"
                                value={data.id_number}
                                onChange={(e) =>
                                    setData("id_number", e.target.value)
                                }
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
                                name="id_number"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
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
