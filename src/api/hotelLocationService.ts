import axiosInstance from './axiosInstance';

export const hotelLocationService = {
  getActiveLocations: async () => {
    const response = await axiosInstance.get('/site/hotelLocation/active');
    return response.data;
  },

  getAll: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/hotelLocation', { params: { page, limit } });
    return response.data;
  }
};

export default hotelLocationService;
