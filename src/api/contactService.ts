import axiosInstance from './axiosInstance';
    
export const contactService = {
  submitContactInquiry: async (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const response = await axiosInstance.post('/site/contact', data);
    return response.data;
  },
   getSettings: async () => {
        const response = await axiosInstance.get('/site/settings');
        return response.data;
    }
};