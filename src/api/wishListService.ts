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
  addWishList: async (payload: WishlistPayload) => {
    const response = await axiosInstance.post('/wishlist', payload);
    console.log('============000000000====',response.data)
    return response.data;
  },
  getWishlists: async (filter: any = {}) => {
    const response = await axiosInstance.get('/wishlist', { params: filter });
    return response.data;
  },
  // Delete wishlist
  deleteWishlist: async (id: string) => {
    const response = await axiosInstance.post(`/wishlist/${id}`);
    console.log('=================response',response)

    return response.data;
  },
};

export default myWishListService;