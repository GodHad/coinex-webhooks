import axios from 'axios';
import { toast } from 'react-toastify';
import { Hook } from 'types/hook';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getToken = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('jwtToken');
    }

    return null;
}

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/register`, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error)
        return false;
    }
}

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/login`, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/update-user`, data, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const loginWithJWT = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/auth/login-with-jwt`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHooks = async (jwtToken: string) => {
    const response = await axios.get(`${backendUrl}api/hooks`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return response.data;
}

export const insertHook = async (hook) => {
    try {
        const response = await axios.post(`${backendUrl}api/hooks/create`, hook, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateHook = async (hook: Hook) => {
    try {
        const response = await axios.put(`${backendUrl}api/hooks/update/${hook._id}`, hook, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const deleteHook = async (id) => {
    try {
        const response = await axios.delete(`${backendUrl}api/hooks/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHistories = async ({
    perPage = 10,
    searchTerm,
    currentPage = 1
}: {
    perPage: number,
    searchTerm: string;
    currentPage: number
}) => {
    try {
        const response = await axios.get(`${backendUrl}api/histories?perPage=${perPage}&currentPage=${currentPage}&searchTerm=${searchTerm}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        return response.data
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return [];
    }
}