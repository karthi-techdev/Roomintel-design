import axiosInstance from './axiosInstance';

export const authService = {
    register: async (data: any) => {
        const response = await axiosInstance.post('/site/auth/register', data);
        return response.data;
    },

    login: async (data: any) => {
        const response = await axiosInstance.post('/site/auth/login', data);
        return response.data;
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr);
        }
        return null;
    },

    getProfile: async () => {
        const response = await axiosInstance.get('/site/auth/me');
        return response.data;
    }
};
