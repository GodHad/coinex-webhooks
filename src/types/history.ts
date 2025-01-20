import { Hook } from "./hook"

export type HistoryType = {
    hook: Hook;
    symbol: string;
    amount: string;
    action: string;
    data?: {
        code: number;
        message: string;
    };
    createdAt: Date;
}