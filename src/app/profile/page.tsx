'use client'

import InputField from "components/fields/InputField"

const ProfilePage = () => {
    return (
        <>
            <div className="w-full text-navy-700 dark:text-white">
                <div className="block md:flex gap-4">
                    <div className="border border-gray-300 dark:border-gray-900 rounded-md flex-grow-3 flex-shrink basis-0">
                        <div className="flex flex-col items-center p-3 border-b border-gray-300 dark:border-gray-900">
                            <div className="rounded-full inline-flex items-center justify-center text-center uppercase font-medium relative w-32 h-32 text-[calc(8rem/2.5)] bg-[#11047A] text-white cursor-pointer">
                                JP
                            </div>
                            <h3 className="text-xl font-bold mt-4">James Patrick</h3>
                        </div>
                        <div className="p-3">
                            <p>Email</p>
                            <p className="font-bold">sunharius@gmail.com</p>
                        </div>
                    </div>
                    <div className="p-3 flex-grow flex-shrink basis-0 border border-gray-300 dark:border-gray-900 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField id="firstName" label="First Name" placeholder="James" />
                            <InputField id="lastName" label="Last Name" placeholder="Potter" />
                            <InputField id="email" label="Email" placeholder="jamespotter@gmail.com" type="email" />
                            <InputField id="password" label="Password" placeholder="**********" type="password" />
                        </div>
                        <div className="mt-5 border-t border-gray-300 dark:border-gray-900">
                            <button className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage