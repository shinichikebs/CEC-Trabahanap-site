import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { AnchorLink } from "@/Components";
import { FaGooglePlusG } from "react-icons/fa";

export default function Login({ status, canResetPassword, isGoogleOnlyAccount }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [googleOnlyError, setGoogleOnlyError] = useState(""); // Error message for Google-only accounts

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        // Check if the account requires Google login and prevent password login
        if (isGoogleOnlyAccount) {
            setGoogleOnlyError("This account was created using Google. Please log in using 'Continue with Google'.");
            return;
        }

        post(route("login"));
    };

    return (
        <div>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: "url(cec.jpg)" }}
            >
                <Head title="Log in" />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="min-h-screen flex items-center justify-center bg-cover bg-center z-[10]">
                    <div className="p-8 rounded shadow-md w-full max-w-md">
                        {status && (
                            <div className="mb-4 font-medium text-sm text-white-900">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full h-9 text-black border-b border-black"
                                    style={{ color: 'black' }}
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => {
                                        setData("email", e.target.value);
                                        setGoogleOnlyError(""); // Clear the Google-only error when email changes
                                    }}
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />
                                <div className="relative mt-1">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="block w-full h-9 text-black border-b border-black pr-10"
                                        style={{ color: 'black' }}
                                        autoComplete="current-password"
                                        onChange={(e) => {
                                            setData("password", e.target.value);
                                            setGoogleOnlyError(""); // Clear the Google-only error when password changes
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-black focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M10 3.5c-4 0-7.45 2.61-8.97 6.24a.75.75 0 000 .52C2.55 13.89 6 16.5 10 16.5c4 0 7.45-2.61 8.97-6.24a.75.75 0 000-.52C17.45 6.11 14 3.5 10 3.5zm0 11a5 5 0 100-10 5 5 0 000 10zm0-2.25a2.75 2.75 0 110-5.5 2.75 2.75 0 010 5.5z" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.55 5.8a8.57 8.57 0 00-2.6 4.15.75.75 0 000 .52c1.52 3.63 5.97 6.24 9.97 6.24 1.52 0 2.98-.3 4.3-.83l.48.49a.75.75 0 101.06-1.06l-12-12a.75.75 0 00-1.06 1.06l.46.47zm6.95 6.95L6.3 7.55a5 5 0 005.2 5.2zM10 3.5c1.52 0 2.98.3 4.3.83l1.32 1.32C14.72 4.72 12.44 4 10 4c-4 0-7.45 2.61-8.97 6.24a.75.75 0 000 .52c.67 1.6 1.82 2.99 3.23 4.03l1.09-1.1a6.95 6.95 0 01-2.27-2.35z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError
                                    message={errors.password || googleOnlyError}
                                    className="mt-2 text-red-500"
                                />
                            </div>

                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                    />
                                    <span className="ms-2 text-xs text-white dark:text-gray-400">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-col items-center justify-end mt-4 space-y-5">
                                <PrimaryButton className="w-full" disabled={processing}>
                                    Log in
                                </PrimaryButton>
                                <p className="text-white text-xs">OR</p>
                                <AnchorLink
                                    href={route("google-auth")}
                                    className="bg-red-600 text-white rounded-lg flex items-center w-full"
                                >
                                    <FaGooglePlusG size={20} className="mr-2" />
                                    Continue with Google
                                </AnchorLink>
                                <Link
                                    href={route("register")}
                                    className="underline text-sm text-white hover:text-white dark:hover:text-white"
                                >
                                    Don't have an account?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
