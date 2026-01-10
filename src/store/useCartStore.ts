import { create } from 'zustand';
import { cartService } from '@/api/cartService';

export interface CartItem {
    _id?: string;
    roomId: string | any;
    roomSlug?: string;
    roomName: string;
    roomTitle?: string;
    price: number;
    roomImage?: string;
    image?: string;
    checkIn: string;
    checkOut: string;
    guestDetails?: {
        rooms: number;
        adults: number;
        children: number;
    };
    guests?: {
        adults: number;
        children: number;
    };
    amenities?: any[];
    financials?: {
        baseTotal: number;
        extrasTotal: number;
        taxes: number;
        serviceCharge: number;
        discountAmount: number;
        grandTotal: number;
        currency: string;
    };
    rateConfig?: {
        baseAdults: number;
        baseChildren: number;
        extraAdultPrice: number;
        extraChildPrice: number;
        maxAdults: number;
        maxChildren: number;
    };
    selectedExtras?: string[];
    promoCode?: string;
    totalAmount?: number;
}

interface CartState {
    cartItems: CartItem[];
    loading: boolean;
    isOpen: boolean;
    total: number;

    fetchCart: () => Promise<void>;
    loadFromStorage: () => void;
    addToCart: (item: CartItem) => Promise<void>;
    updateCartItem: (item: CartItem) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cartItems: [],
    loading: false,
    isOpen: false,
    total: 0,

    fetchCart: async () => {
        set({ loading: true });
        try {
            // Check if user is logged in (token exists) - simple check
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                // Guest mode: load from local storage
                get().loadFromStorage();
                return;
            }

            const res = await cartService.getCart();
            if (res && (res.status || res.success) && res.data && res.data.items) {
                // If backend has items, usage them.
                // Ideally we might want to merge local storage if it's newer, but for now backend wins if logged in
                set({
                    cartItems: res.data.items,
                    total: res.data.totalAmount || 0,
                    loading: false
                });
            } else {
                set({ cartItems: [], total: 0, loading: false });
            }
        } catch (error) {
            set({ loading: false });
        }
    },

    loadFromStorage: () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('room_cart');
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    const items = Array.isArray(parsed) ? parsed : [parsed];
                    set({ cartItems: items, loading: false });
                } catch (e) {
                    set({ loading: false });
                }
            } else {
                set({ loading: false });
            }
        }
    },

    addToCart: async (item: CartItem) => {
        set({ loading: true });
        try {
            const currentItems = get().cartItems;

            // Check if room already exists in cart
            const existingIndex = currentItems.findIndex(i =>
                (i.roomId === item.roomId) ||
                (typeof i.roomId === 'object' && i.roomId._id === item.roomId) ||
                (typeof i.roomId === 'object' && typeof item.roomId === 'object' && i.roomId._id === item.roomId._id)
            );

            let newItems;
            if (existingIndex > -1) {
                // Update existing item
                newItems = [...currentItems];
                newItems[existingIndex] = {
                    ...newItems[existingIndex],
                    ...item
                };
            } else {
                // Add new item
                newItems = [...currentItems, item];
            }

            // Update Local Storage
            if (typeof window !== 'undefined') {
                localStorage.setItem('room_cart', JSON.stringify(newItems));
            }

            set({ cartItems: newItems });

            // Backend sync if logged in
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                await cartService.syncCart(newItems);
            }
        } catch (error) {
        } finally {
            set({ loading: false });
        }
    },

    updateCartItem: async (item: CartItem) => {
        const currentItems = get().cartItems;
        // If it has _id, update by _id. If not (local), maybe update the first one or logic needs to change.
        // For simplicity in this multi-room context, let's update by index or roomId if IDs aren't available yet.
        const newItems = currentItems.map(i => {
            if (item._id && i._id === item._id) return item;
            if (!item._id && i.roomId === item.roomId) return item; // Fallback for local
            return i;
        });

        set({ cartItems: newItems });

        if (typeof window !== 'undefined') {
            localStorage.setItem('room_cart', JSON.stringify(newItems));
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                await cartService.syncCart(newItems);
            } catch (err) {
                console.error("Failed to sync updated cart", err);
            }
        }
    },

    removeFromCart: async (itemId: string) => {
        const currentItems = get().cartItems;
        const newItems = currentItems.filter(i => (i._id !== itemId && i.roomId !== itemId)); // Handle both _id and roomId if needed

        set({ cartItems: newItems });

        if (typeof window !== 'undefined') {
            localStorage.setItem('room_cart', JSON.stringify(newItems));
        }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                if (newItems.length === 0) {
                    await cartService.clearCart();
                } else {
                    await cartService.syncCart(newItems);
                }
            } catch (e) { console.error(e) }
        }
    },

    clearCart: async () => {
        set({ loading: true });
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('room_cart');
            }
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                await cartService.clearCart();
            }
            set({ cartItems: [], total: 0, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
