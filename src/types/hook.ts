import { AdminHook } from "./admin-hook";

export type Hook = {
    _id?: string;
    name: string;
    url: string;
    coinExApiKey: string;
    coinExApiSecret: string;
    status: number;
    tradeDirection: string;
    isSubscribed?: boolean;
    adminHook?: string | AdminHook;
};