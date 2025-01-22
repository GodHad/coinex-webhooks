import InputField from "components/fields/InputField";
import { useEffect, useState } from "react";
import { AdminHook } from "types/admin-hook";

const AdminHookModal = ({
    isOpen,
    onClose,
    hook,
    handleSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    hook: AdminHook | null;
    handleSubmit: (hook: AdminHook) => void;
}) => {
    const [_hook, setHook] = useState<AdminHook>({
        url: '',
        name: '',
        pair: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setHook(prev => ({ ...prev, [name]: value }));
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(_hook);
    }

    useEffect(() => {
        setHook(hook ? { ...hook } : {
            url: '',
            name: '',
            pair: ''
        })
    }, [hook])

    return (
        <div className={`duration-500 w-full h-screen absolute top-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none ${isOpen ? 'opacity-100 z-[80]' : 'opacity-0 -z-10'}`}>
            <div className="max-w-lg mx-auto my-auto">
                <div className="flex flex-col bg-white bg-clip-border border border-gray-200 dark:border-gray-900 shadow-sm rounded-xl pointer-events-auto dark:!bg-navy-800 dark:text-white">
                    <div className="flex justify-between items-center py-3 px-4">
                        <h3 className="font-bold text-xl">
                            {hook ? 'Update Hook' : 'Create Hook'}
                        </h3>
                        <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" onClick={onClose}>
                            <span className="sr-only">Close</span>
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="px-2 mt-4">
                        <InputField
                            extra="mb-3"
                            label="Webhook Name*"
                            placeholder="Webhook Name"
                            id="name"
                            type="text"
                            value={_hook.name}
                            onChange={handleInputChange}
                        />
                        <InputField
                            extra="mb-3"
                            label="Pair*"
                            placeholder="Pair"
                            id="pair"
                            type="text"
                            value={_hook.pair}
                            onChange={handleInputChange}
                        />
                        {_hook.url &&
                            <InputField
                                extra="mb-3"
                                label="Webhook URL*"
                                placeholder="Webhook URL"
                                id="url"
                                type="text"
                                value={_hook.url}
                                disabled
                            />
                        }
                        <div className="flex justify-start items-center gap-x-2 py-3 px-4">
                            <button type="submit" className="flex gap-2 my-4 rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminHookModal;