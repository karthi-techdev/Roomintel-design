
"use client";

import { create } from "zustand";
import { myWishListService } from "@/api/wishListService";
import { useAuthStore } from "./useAuthStore";


interface RoomInfo {
	_id: string;
	name: string;
	price: number;
	previewImage : string;
	rating : number;
	slug : string;
	size : string;
	adults : number
}
export interface WishlistItem {
	_id: string;
	userId: string;
	roomId: RoomInfo;
	status?: string;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

interface formData {
	userId: string;
	roomId: string;
}

interface WishlistState {
	wishlists: WishlistItem[];
	formData: formData | null;
	isLoading: boolean;
	error: string | null;
	message: string | null;
	addWishList: (payload: formData) => Promise<void>;
	fetchWishlists: (filter: {}) => Promise<void>;
	removeWishlist: (id: string) => Promise<void>;
}

export const useMyWishListStore = create<WishlistState>((set ,get) => ({
	wishlists: [],
	formData: null,
	isLoading: false,
	error: null,
	message: null,

	addWishList: async (payload) => {
		set({ isLoading: true, error: null, message: null });
		try {
			const response = await myWishListService.addWishList(payload);

			set({
				formData: response.result, // backend returns 'result'
				message: response.message || 'Wishlist updated',
				isLoading: false,
			});
			return response;
		} catch (error: any) {
			set({
				isLoading: false,
				error: error.message || 'Failed to update wishlist',
			});
		}
	},

	fetchWishlists: async (filter = {}) => {
		set({ isLoading: true, error: null });
		try {
			const response = await myWishListService.getWishlists(filter);
			set({
				wishlists: response.data || [],
				isLoading: false,
			});
			return response;
		} catch (error: any) {
			set({
				isLoading: false,
				error: error.message || 'Failed to load wishlist',
			});
		}
	},

	removeWishlist: async (id: string) => {
		set({ isLoading: true });
		try {
			await myWishListService.deleteWishlist(id);
			set({ isLoading: false, message: 'Wishlist item removed' });
		} catch (error: any) {
			set({
				isLoading: false,
				error: error.message || 'Failed to remove wishlist',
			});
		}
	},
}));

export default useMyWishListStore;
