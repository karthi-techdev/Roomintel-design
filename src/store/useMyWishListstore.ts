
"use client";

import { create } from "zustand";
import { myWishListService } from "@/api/myWishListService";
import { useAuthStore } from "./useAuthStore";


export interface WishlistItem {
	_id: string;
	userId: string;
	roomId: string;
	room?: any;
	status?: string;
	isDeleted?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

interface WishlistState {
	wishlists: WishlistItem[];
	formData: WishlistItem | null;
	isLoading: boolean;
	error: string | null;
	message: string | null;
	toggleWishlist: (payload: { userId: string; roomId: string }) => Promise<void>;
	fetchWishlists: (filter: {}) => Promise<void>;
	removeWishlist: (id: string) => Promise<void>;
}

export const useMyWishListStore = create<WishlistState>((set) => ({
	wishlists: [],
	formData: null,
	isLoading: false,
	error: null,
	message: null,

	toggleWishlist: async (payload) => {
		set({ isLoading: true, error: null, message: null });
		try {
			const response = await myWishListService.toggleWishlist(payload);
			set({
				formData: response.data,
				message: response.message || 'Wishlist updated',
				isLoading: false,
			});
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
