import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        id_number: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        role: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Handle ID number input validation (only numbers, allow starting with 0)
    const handleIdNumberChange = (e) => {
        const value = e.target.value;
        // Allow only numbers (including leading 0)
        if (/^\d*$/.test(value)) {
            setData('id_number', value); // Ensure this is set as a string
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />
            <div className={`fixed inset-0 w-full h-screen bg-black opacity-50 z-[1]`}></div>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{
                    backgroundImage: `url('/cec.jpg')`,
                }}
            >
                <div className="w-full max-w-md py-8 z-[10]">
                    <h1 className="text-4xl font-bold text-center text-white mb-6">
                        SIGN UP
                    </h1>

                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <TextInput
                                id="id_number"
                                name="id_number"
                                value={data.id_number}
                                className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="ID Number"
                                onChange={handleIdNumberChange}  // Use the new validation function
                                required
                            />
                            <InputError message={errors.id_number} className="mt-2" />

                            <div className="grid grid-cols-3 gap-4">
                                <TextInput
                                    id="lastName"
                                    name="lastName"
                                    value={data.lastName}
                                    className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                    placeholder="Last Name"
                                    onChange={(e) => setData('lastName', e.target.value)}
                                    required
                                />
                                <TextInput
                                    id="firstName"
                                    name="firstName"
                                    value={data.firstName}
                                    className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                    placeholder="First Name"
                                    onChange={(e) => setData('firstName', e.target.value)}
                                    required
                                />
                                <TextInput
                                    id="middleName"
                                    name="middleName"
                                    value={data.middleName}
                                    className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                    placeholder="Middle Name"
                                    onChange={(e) => setData('middleName', e.target.value)}
                                />
                            </div>
                            <InputError message={errors.firstName || errors.lastName || errors.middleName} className="mt-2" />

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                    onChange={(e) => setData('gender', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="employee">Employee</option>
                                </select>
                            </div>
                            <InputError message={errors.gender || errors.role} className="mt-2" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="CeC Email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="Password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full bg-white text-black !text-black border-b border-black placeholder-black focus:ring-0 focus:border-black"
                                placeholder="Confirm Password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
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

                        <div className="mt-4 text-center">
                            <Link
                                href={route('login')}
                                className="text-white underline text-sm"
                            >
                                Already have an account? Log in here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
