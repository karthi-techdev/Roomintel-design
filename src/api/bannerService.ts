import axiosInstance from './axiosInstance';

export const bannerService = {
    getBanners: async () => {
        const response = await axiosInstance.get('/site/banners');
        return response.data;
    }
};
