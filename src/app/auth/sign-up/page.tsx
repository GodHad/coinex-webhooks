'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { registerUser } from 'utils/api';
import UserContext, { User } from 'contexts/UserContext';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';

function SignUp() {
    const [form, setForm] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const { setUser, setJwtToken } = useContext(UserContext);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await registerUser(form);
        if (!result) {
            toast.success(result.message);
            setUser(result.user);
            setJwtToken(result.token);
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            })
            window.localStorage.setItem('jwtToken', result.token);
            redirect('/dashboard');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    return (
        <Default
            maincard={
                <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
                    {/* Sign in section */}
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                            Sign Up
                        </h3>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                            Enter your information to sign up!
                        </p>
                        <form onSubmit={onSubmit}>
                            {/* First Name */}
                            <InputField
                                variant="auth"
                                extra="mb-3"
                                label="First Name*"
                                placeholder="Your First Name"
                                id="firstName"
                                type="text"
                                value={form.firstName}
                                onChange={handleInputChange}
                            />
                            {/* Last Name*/}
                            <InputField
                                variant="auth"
                                extra="mb-3"
                                label="Last Name*"
                                placeholder="Your Last Name"
                                id="lastName"
                                type="text"
                                value={form.lastName}
                                onChange={handleInputChange}
                            />

                            {/* Email */}
                            <InputField
                                variant="auth"
                                extra="mb-3"
                                label="Email*"
                                placeholder="Your Email Address"
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={handleInputChange}
                            />

                            {/* Password */}
                            <InputField
                                variant="auth"
                                extra="mb-3"
                                label="Password*"
                                placeholder="Min. 8 characters"
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={handleInputChange}
                            />
                            <button type='submit' className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                Sign Up
                            </button>
                        </form>
                        <div className="mt-4">
                            <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                                Already have an account?
                            </span>
                            <Link
                                href="/auth/sign-in"
                                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                            >
                                Login with an account
                            </Link>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default SignUp;
