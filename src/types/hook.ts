export type Hook = {
    _id?: string;
    name: string;
    url: string;
    coinExApiKey: string;
    coinExApiSecret: string;
    status: number;
    totalCalls?: number;
};