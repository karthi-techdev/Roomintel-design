import axiosInstance from './axiosInstance';

export const siteService = {
    // Rooms
    getRooms: async () => {
        const response = await axiosInstance.get('/site/rooms');
        return response.data;
    },
    getRoomBySlug: async (slug: string) => {
        const response = await axiosInstance.get(`/site/rooms/${slug}`);
        return response.data;
    },

    // Categories
    getCategories: async () => {
        const response = await axiosInstance.get('/site/categories');
        return response.data;
    },

    // Room Banner
    getRoomBanner: async () => {
        const response = await axiosInstance.get('/site/room-banner');
        return response.data;
    },

    // FAQs
    getFaqs: async () => {
        const response = await axiosInstance.get('/site/faqs');
        return response.data;
    },

    // Services
    getServices: async () => {
        const response = await axiosInstance.get('/site/services');
        return response.data;
    },

    // Config
    getConfigBySlug: async (slug: string) => {
        const response = await axiosInstance.get(`/site/config/${slug}`);
        return response.data;
    },

    // General Settings
    getGeneralSettings: async () => {
        const response = await axiosInstance.get('/site/settings/general');
        return response.data;
    }
};
