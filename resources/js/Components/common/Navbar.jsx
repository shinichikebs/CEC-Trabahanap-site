import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // for mobile menu icons
import { FaQuestion } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";

export default function Navbar({ className = "", ...props }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            {...props}
            className={`bg-[#231955] w-full flex justify-between items-center p-4 md:p-6 ${className} relative`}
        >
            {/* Brand and About Us */}
            <div className="flex items-center justify-between w-full md:w-auto">
                <h1 className="text-2xl font-semibold text-[#E8AA42]">
                    CeC-Trabahanap
                </h1>
                <div className="hidden md:flex items-center space-x-10 ml-10 text-white text-sm">
                    <li className="list-none">
                        <a  href="https://sites.google.com/view/risk-coders/home" className="hover:underline">About Us</a>
                    </li>
                </div>
                {/* Hamburger menu icon for mobile */}
                <button
                    className="md:hidden text-white z-10" // Ensuring z-index on the button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 text-white text-sm">
                <a href="/login" className="hover:underline">Log in</a>
                <a href="/register" className="bg-[#E8AA42] p-2 rounded-lg w-24 text-center">
                    Sign Up
                </a>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="bg-[#231955] text-white p-4 rounded-lg shadow-lg absolute top-16 right-0 w-52 z-20">
                    <a
                        href="https://sites.google.com/view/risk-coders/home"
                        className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                    >
                        <FaQuestion size={16} className="mr-2" />
                        About Us
                    </a>
                    <a
                        href="/login"
                        className="block py-2 px-4 text-white rounded-lg mb-2 hover:bg-[#D18C33] flex items-center"
                    >
                        <IoIosLogIn size={16} className="mr-2" />
                        Log in
                    </a>
                    <a
                        href="/register"
                        className="block py-2 px-4 text-white rounded-lg hover:bg-[#D18C33] flex items-center"
                    >
                        Sign Up
                    </a>
                </div>
            )}

            {/* Overlay for closing the menu when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-10" // Full-screen overlay
                    onClick={() => setIsOpen(false)} // Close menu when clicking outside
                />
            )}
        </div>
    );
}
