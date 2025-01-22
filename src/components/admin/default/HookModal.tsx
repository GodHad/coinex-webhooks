import InputField from "components/fields/InputField";
import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { AdminHook } from "types/admin-hook";
import { Hook } from "types/hook";
import { getAdminHooks } from "utils/api";

const HookModal = ({
    isOpen,
    onClose,
    hook,
    handleSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    hook: Hook | null;
    handleSubmit: (hook: Hook, isUsingAdminHook: boolean) => void;
}) => {
    const [_hook, setHook] = useState<Hook>({
        url: '',
        name: '',
        coinExApiKey: '',
        coinExApiSecret: '',
        tradeDirection: 'BOTH',
        adminHook: '',
        status: 0,
    });

    const [adminHooks, setAdminHooks] = useState<AdminHook[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setHook(prev => ({ ...prev, [name]: value }));
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(_hook, isUsingAdminHook);
    }

    useEffect(() => {
        setHook(hook ? { ...hook, adminHook: typeof hook.adminHook === 'undefined' ? '' : (hook.adminHook as AdminHook)._id } : {
            url: '',
            name: '',
            coinExApiKey: '',
            coinExApiSecret: '',
            tradeDirection: 'BOTH',
            adminHook: '',
            status: 0,
        })
    }, [hook]);

    const handleGetAdminHooks = async () => {
        try {
            const _adminHooks = await getAdminHooks();
            setAdminHooks(_adminHooks);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetAdminHooks();
    }, [])

    const { user } = useContext(UserContext);

    const [isUsingAdminHook, setIsUsingAdminHook] = useState<boolean>(false);

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
                    {(user.subscribed === 1 && new Date(user.subscribeEndDate).getTime() > Date.now()) &&
                        < div className="relative flex justify-center rounded-[20px] bg-gradient-to-br from-[#868CFF] via-[#432CF3] to-brand-500 pb-4 mx-2">
                            <div className="flex mt-2 h-fit flex-col items-center">
                                <p className="text-white">You are available to use admin's hook.</p>
                                <a
                                    className="text-medium mt-2 block rounded-full bg-gradient-to-b from-white/50 to-white/10 px-4 py-2 text-center text-base text-white hover:bg-gradient-to-b hover:from-white/40 hover:to-white/5 "
                                    onClick={() => setIsUsingAdminHook(prev => !prev)}
                                >
                                    {isUsingAdminHook ? "Use My Own Hook" : "Use Admin's Hook"}
                                </a>
                            </div>
                        </div>
                    }
                    <div className="px-4 overflow-y-auto">
                        <p className="mt-1 break-all text-red-500 font-medium text-sm">
                            {(user.subscribed !== 1 || new Date(user.subscribeEndDate).getTime() < Date.now()) ?
                                "*The webhook URL should be the last part of the path. For example, if the URL is https://api.nothingparticular.com/api/webhooks/your_username/btc_down_99999 in the webhook of tradingview, you should input btc_down_99999 in the URL field."
                                :
                                "Webhook URL will be generated automatically in Premium version."
                            }
                        </p>
                    </div>
                    {!isUsingAdminHook ?
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
                            {(user.subscribed !== 1 || new Date(user.subscribeEndDate).getTime() < Date.now()) &&
                                <InputField
                                    extra="mb-3"
                                    label="Webhook URL*"
                                    placeholder="Webhook URL"
                                    id="url"
                                    type="text"
                                    value={_hook.url}
                                    onChange={handleInputChange}
                                />
                            }
                            <div className="mb-3">
                                <label
                                    htmlFor={'tradeDirection'}
                                    className={`text-sm text-navy-700 dark:text-white ml-3 font-bold
                                    }`}
                                >
                                    Trade Direction*
                                </label>
                                <select
                                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 px-3 py-1 text-sm outline-none"
                                    name="tradeDirection"
                                    id="tradeDirection"
                                    value={_hook.tradeDirection}
                                    onChange={handleInputChange}
                                >
                                    <option value="BOTH">BOTH</option>
                                    <option value="LONG_ONLY">Long Only</option>
                                    <option value="SHORT_ONLY">Short Only</option>
                                </select>
                            </div>
                            <InputField
                                extra="mb-3"
                                label="CoinEx API Key*"
                                placeholder="CoinEx API Key"
                                id="coinExApiKey"
                                type="text"
                                value={_hook.coinExApiKey}
                                onChange={handleInputChange}
                            />
                            <InputField
                                extra="mb-3"
                                label="CoinEx API Secret*"
                                placeholder="CoinEx API Secret"
                                id="coinExApiSecret"
                                type="text"
                                value={_hook.coinExApiSecret}
                                onChange={handleInputChange}
                            />
                            <div className="flex justify-start items-center gap-x-2 py-3 px-4">
                                <button type="submit" className="flex gap-2 rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                    Save
                                </button>
                            </div>
                        </form>
                        :
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
                            <div className="mb-3">
                                <label
                                    htmlFor={'adminHook'}
                                    className={`text-sm text-navy-700 dark:text-white ml-3 font-bold
                                    }`}
                                >
                                    Admin Hooks*
                                </label>
                                <select
                                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 px-3 py-1 text-sm outline-none"
                                    name="adminHook"
                                    id="adminHook"
                                    value={(typeof _hook.adminHook === 'string' || typeof _hook.adminHook === 'undefined') ? _hook.adminHook : _hook.adminHook._id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select One</option>
                                    {adminHooks.map(adminHook => (
                                        <option key={adminHook._id} value={adminHook._id}>{`${adminHook.name}(${adminHook.pair})`}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor={'tradeDirection'}
                                    className={`text-sm text-navy-700 dark:text-white ml-3 font-bold
                                    }`}
                                >
                                    Trade Direction*
                                </label>
                                <select
                                    className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 px-3 py-1 text-sm outline-none"
                                    name="tradeDirection"
                                    id="tradeDirection"
                                    value={_hook.tradeDirection}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select One</option>
                                    <option value="BOTH">BOTH</option>
                                    <option value="LONG_ONLY">Long Only</option>
                                    <option value="SHORT_ONLY">Short Only</option>
                                </select>
                            </div>
                            <InputField
                                extra="mb-3"
                                label="CoinEx API Key*"
                                placeholder="CoinEx API Key"
                                id="coinExApiKey"
                                type="text"
                                value={_hook.coinExApiKey}
                                onChange={handleInputChange}
                            />
                            <InputField
                                extra="mb-3"
                                label="CoinEx API Secret*"
                                placeholder="CoinEx API Secret"
                                id="coinExApiSecret"
                                type="text"
                                value={_hook.coinExApiSecret}
                                onChange={handleInputChange}
                            />
                            <div className="flex justify-start items-center gap-x-2 py-3 px-4">
                                <button type="submit" className="flex gap-2 rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                    Save
                                </button>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div >
    )
}

export default HookModal;