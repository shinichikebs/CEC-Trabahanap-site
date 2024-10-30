// components/AddUserModal.js
import React, { useState } from "react";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import axios from "axios";
import Swal from "sweetalert2";

const AddUserModal = ({ isOpen, onClose }) => {
    const [data, setData] = useState({
        id_number: '',
        lastName: '',
        firstName: '',
        middleName: '',
        gender: '',
        role: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await axios.post("/admin/add-user", data);
            
            if (response.status === 200) {
                Swal.fire("Success", "User added successfully!", "success");
                onClose(); // Close modal after successful submission
                setData({ 
                    id_number: '',
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    gender: '',
                    role: '',
                    email: '',
                    password: '',
                    password_confirmation: ''
                });
            }
        } catch (error) {
            if (error.response) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Error:", error.message);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2">✖</button>
                <h1 className="text-2xl font-bold mb-4 text-center">Add New User</h1>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <input
                            id="id_number"
                            name="id_number"
                            value={data.id_number || ''}
                            className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                            placeholder="ID Number"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.id_number} className="mt-2" />

                        <div className="grid grid-cols-3 gap-4">
                            <input
                                id="lastName"
                                name="lastName"
                                value={data.lastName || ''}
                                className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="Last Name"
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="firstName"
                                name="firstName"
                                value={data.firstName || ''}
                                className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="First Name"
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                id="middleName"
                                name="middleName"
                                value={data.middleName || ''}
                                className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="Middle Name"
                                onChange={handleInputChange}
                            />
                        </div>
                        <InputError message={errors.firstName || errors.lastName || errors.middleName} className="mt-2" />

                        <div className="grid grid-cols-2 gap-4">
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender || ''}
                                className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            <select
                                id="role"
                                name="role"
                                value={data.role || ''}
                                className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select Role</option>
                                <option value="student">Student</option>
                                <option value="employee">Employee</option>
                            </select>
                        </div>
                        <InputError message={errors.gender || errors.role} className="mt-2" />

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email || ''}
                            className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                            placeholder="Email"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password || ''}
                            className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                            placeholder="Password"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />

                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation || ''}
                            className="w-full bg-transparent text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                            placeholder="Confirm Password"
                            onChange={handleInputChange}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    <div className="flex flex-col items-center mt-6">
                        <PrimaryButton
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring"
                            disabled={processing}
                        >
                            SIGN UP
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
