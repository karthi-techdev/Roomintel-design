import axiosInstance from "./axiosInstance";

interface WishlistPayload {
  userId: string;
  roomId: string;
}

interface WishlistFilter {
  [key: string]: any; // e.g. userId, page, limit, etc.
}

export const myWishListService = {
  // Add or toggle wishlist
  toggleWishlist: async (payload: WishlistPayload) => {
    const response = await axiosInstance.post('/wishlist', payload);
    return response.data;
  },
  // Get wishlists with flexible filter (like reviewService)
  getWishlists: async (filter: WishlistFilter = {}) => {
    const response = await axiosInstance.get('/wishlist/all', { params: filter });
    return response.data;
  },
  // Delete wishlist
  deleteWishlist: async (id: string) => {
    const response = await axiosInstance.delete(`/wishlist/${id}`);
    return response.data;
  },
};

export default myWishListService;