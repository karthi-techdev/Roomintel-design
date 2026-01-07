// src/api/accommodationService.ts
import axiosInstance from './axiosInstance';

export interface Accommodation {
  _id: string;
  title: string;
  price: number;
  description: string;
  beds: number;
  bathroom: number;
  image?: string;
  status?: string;
}

export const accommodationService = {
  // Get all active accommodations (public)
  getAllAccommodations: async (): Promise<Accommodation[]> => {
    const response = await axiosInstance.get('/site/accommodations');
    return response.data.data.data || [];
  },

  // Optional: get single
  getAccommodationById: async (id: string): Promise<Accommodation> => {
    const response = await axiosInstance.get(`/site/accommodations/${id}`);
    return response.data.data || response.data;
  },
};