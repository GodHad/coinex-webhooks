"use client"
import { createContext } from 'react';

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type UserContextType = {
    user: User;
    setUser: (value: User) => void;

    login: boolean;
    setLogin: (value: boolean) => void;

    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
};

const UserContext = createContext<UserContextType>({
    user: null as User,
    setUser: () => {},

    login: false,
    setLogin: () => {},

    isLoading: false,
    setIsLoading: () => {},
})

export default UserContext;