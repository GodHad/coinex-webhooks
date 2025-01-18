'use client'

import UserContext, { User } from "contexts/UserContext";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [login, setLogin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <QueryClientProvider client={queryClient}>
            <UserContext.Provider
                value={{
                    user,
                    setUser,
                    login,
                    setLogin,
                    isLoading,
                    setIsLoading
                }}
            >
                {children}
            </UserContext.Provider>
        </QueryClientProvider>
    )
}