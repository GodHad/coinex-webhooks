'use client'

import InputField from "components/fields/InputField"
import UserContext, { User } from "contexts/UserContext"
import { redirect } from "next/navigation"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { updateUser } from "utils/api"

const ProfilePage = () => {
    const { user, setUser } = useContext(UserContext);
    if (!user) redirect('/auth/sign-in');

    const [form, setForm] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await updateUser(form);
        if (result) {
            toast.success(result.message);
            setUser(result.user);
            setForm({
                firstName: '',
                lastName: '',
                email: '',
                password: ''
            })
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    return (
        <>
            <div className="w-full text-navy-700 dark:text-white mt-2">
                <div className="block md:flex gap-4">
                    <div className="border border-gray-300 dark:border-gray-900 rounded-md flex-grow-3 flex-shrink basis-0">
                        <div className="flex flex-col items-center p-3 border-b border-gray-300 dark:border-gray-900">
                            <div className="rounded-full inline-flex items-center justify-center text-center uppercase font-medium relative w-32 h-32 text-[calc(8rem/2.5)] bg-[#11047A] text-white cursor-pointer">
                                {user.firstName[0] + user.lastName[0]}
                            </div>
                            <h3 className="text-xl font-bold mt-4">{`${user.firstName} ${user.lastName}`}</h3>
                        </div>
                        <div className="p-3">
                            <p>Username</p>
                            <p className="font-bold">{user.email}</p>
                        </div>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="p-3 flex-grow flex-shrink basis-0 border border-gray-300 dark:border-gray-900 rounded-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    id="firstName"
                                    label="First Name"
                                    placeholder={user.firstName}
                                    value={form.firstName}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    id="lastName"
                                    label="Last Name"
                                    placeholder={user.lastName}
                                    value={form.lastName}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    id="email"
                                    label="Username"
                                    placeholder={user.email}
                                    value={form.email}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    id="password"
                                    label="Password"
                                    placeholder="*************"
                                    type="password"
                                    value={form.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mt-5 border-t border-gray-300 dark:border-gray-900">
                                <button type="submit" className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                    Update
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProfilePage