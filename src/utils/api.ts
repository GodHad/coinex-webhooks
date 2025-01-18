import Axios from 'axios';
import { headers } from 'next/headers';
import { toast } from 'react-toastify';
import { Hook } from 'types/hook';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getToken = () => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem('jwtToken');
    }

    return null;
}

const axios = Axios.create({
    headers: {
        Authorization: `Bearer ${getToken()}`
    }
})

export const registerUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/register`, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error)
        return false;
    }
}

export const loginUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/login`, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateUser = async (data) => {
    try {
        const response = await axios.post(`${backendUrl}api/auth/update-user`, data);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const loginWithJWT = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/auth/login-with-jwt`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const getHooks = async (jwtToken: string) => {
    const response = await axios.get(`${backendUrl}api/hooks`, {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    });
    return response.data;
}

export const insertHook = async (hook) => {
    try {
        const response = await axios.post(`${backendUrl}api/hooks/create`, hook);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const updateHook = async (hook: Hook) => {
    try {
        const response = await axios.put(`${backendUrl}api/hooks/update/${hook._id}`, hook);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}

export const deleteHook = async (id) => {
    try {
        const response = await axios.delete(`${backendUrl}api/hooks/${id}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message || error.message || error);
        return false;
    }
}