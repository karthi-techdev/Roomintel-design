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
            console.error('Fetch cart failed', error);
            set({ loading: false });
        }
    },

    loadFromStorage: () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('room_cart');
            if (stored) {
                try {
                    const item = JSON.parse(stored);
                    set({ cartItems: [item], loading: false });
                } catch (e) {
                    console.error("Failed to parse cart item", e);
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
            // Update Local Storage
            if (typeof window !== 'undefined') {
                localStorage.setItem('room_cart', JSON.stringify(item));
            }

            set({ cartItems: [item] });

            // Backend sync if logged in
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                await cartService.syncCart(item);
                // Reload to confirm (optional, maybe just trust optimistic)
                // await get().fetchCart(); 
            }
        } catch (error) {
            console.error('Add to cart failed', error);
        } finally {
            set({ loading: false });
        }
    },

    updateCartItem: async (item: CartItem) => {
        // Update Store
        set({ cartItems: [item] });
        // Update Local
        if (typeof window !== 'undefined') {
            localStorage.setItem('room_cart', JSON.stringify(item));
        }
        // Update Backend
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                await cartService.syncCart(item);
            } catch (err) {
                console.error("Failed to sync updated cart", err);
            }
        }
    },

    removeFromCart: async (itemId: string) => {
        set({ cartItems: [] });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('room_cart');
        }
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            try {
                await cartService.clearCart();
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
            console.error('Clear cart failed', error);
            set({ loading: false });
        }
    },

    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
