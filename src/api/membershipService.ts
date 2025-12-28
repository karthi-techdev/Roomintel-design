import axiosInstance from './axiosInstance';

export const membershipService = {
    getMyMembership: async () => {
        const response = await axiosInstance.get('/site/membership/my-membership');
        return response.data;
    }
};
