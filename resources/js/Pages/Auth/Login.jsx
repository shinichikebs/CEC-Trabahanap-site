import { useEffect } from "react";
import Checkbox from "@/Components/Checkbox";
// import GuestLayout from '@/Layouts/GuestLayout'; *note comment imports if not used (because it will still be rendered even if not used)
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { AnchorLink } from "@/Components";
import { FaGooglePlusG } from "react-icons/fa";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_number: "",
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

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
                <div className="min-h-screen flex items-center justify-center bg-cover bg-center z-[10] ">
                    <div className=" p-8 rounded shadow-md w-full max-w-md">
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
                                    className="mt-1 block w-full h-9"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full h-9"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-xs text-gray-600 dark:text-gray-400">
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            {/* <div className="flex items-center justify-end mt-4">
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="underline text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div> */}
                            <div className="flex flex-col items-center justify-end mt-4 space-y-5">
                                <PrimaryButton
                                    className="w-full"
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                                <p className={`text-white text-xs`}>OR</p>
                                <AnchorLink
                                    href={route("google-auth")}
                                    className={`bg-red-600 text-white rounded-lg flex items-center w-full`}
                                >
                                    <FaGooglePlusG
                                        size={20}
                                        className={`mr-2`}
                                    />
                                    Continue with Google
                                </AnchorLink>
                                <Link
                                    href={route("register")}
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    Don't have account?
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
