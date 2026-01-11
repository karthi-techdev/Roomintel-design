import { create } from 'zustand';
import { siteService } from '@/api/siteService';

export interface Room {
    _id: string;
    title: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
    adults: number;
    maxAdults: number;
    maxChildren: number;
   
    baseAdults: number;
    bookedDates: string[];
    baseChildren: number;
    extraAdultPrice: number;
    extraChildPrice: number;
    amenities: any[];
    // Add other fields as needed
    [key: string]: any; // Allow for other fields from API
}

interface RoomState {
    rooms: Room[];
    selectedRoom: Room | null;
    categories: any[];
    loading: boolean;
    error: string | null;
    fetchRooms: () => Promise<void>;
    fetchRoomBySlug: (slug: string) => Promise<void>;
    fetchCategories: () => Promise<void>;
    selectRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    rooms: [],
    selectedRoom: null,
    categories: [],
    loading: false,
    error: null,

    fetchRooms: async () => {
        set({ loading: true, error: null });
        try {
            const res = await siteService.getRooms();
            if (res.status === undefined || res.status || res.success) { 
                set({ rooms: res.data || [], loading: false });
            } else {
                set({ error: res.message || 'Failed to fetch rooms', loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch rooms', loading: false });
        }
    },

    fetchRoomBySlug: async (slug: string) => {
        set({ loading: true, error: null, selectedRoom: null });
        try {
            const res = await siteService.getRoomBySlug(slug);
            if (res.status === undefined || res.status || res.success) {
                set({ selectedRoom: res.data, loading: false, error: null });
            } else {
                set({ error: res.message || 'Failed to fetch room details', loading: false, selectedRoom: null });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch room details', loading: false, selectedRoom: null });
        }
    },

    fetchCategories: async () => {
        try {
            const res = await siteService.getCategories();
            if (res.status === undefined || res.status || res.success) {
                set({ categories: res.data || [] });
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    },

    selectRoom: (room) => set({ selectedRoom: room }),
}));
