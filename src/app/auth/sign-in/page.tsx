'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import UserContext from 'contexts/UserContext';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { loginUser, loginWithJWT } from 'utils/api';

function SignInDefault() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const { user, setUser } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(form);
    if (result) {
      toast.success(result.message);
      setUser(result.user);
      setForm({
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

  const handleLoginWithJWT = async () => {
    const token = window.localStorage.getItem('jwtToken');
    if (token && !user) {
      const result = await loginWithJWT();
      if (result) {
        toast.success(result.message);
        setUser(result.user);
        setForm({
          email: '',
          password: ''
        })
        window.localStorage.setItem('jwtToken', result.token);
        redirect('/dashboard');
      }
    }
  }
  
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      handleLoginWithJWT();
      hasRun.current = true;
    }
  }, [handleLoginWithJWT]);

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Enter your email and password to sign in!
            </p>
            <form onSubmit={onSubmit}>
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
                Sign In
              </button>
            </form>
            <div className="mt-4">
              <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Not registered yet?
              </span>
              <Link
                href="/auth/sign-up"
                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
