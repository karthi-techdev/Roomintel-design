import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import { getImageUrl } from '../utils/getImage';

interface SlideData {
    image: string;
    title: string;
    subtitle: string;
    buttonName?: string;
    buttonUrl?: string;
}

interface SliderState {
    slides: SlideData[];
    loading: boolean;
    error: string | null;
    fetchActiveSlides: () => Promise<void>;
}

export const useSliderStore = create<SliderState>((set) => ({
    slides: [],
    loading: false,
    error: null,

    fetchActiveSlides: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get('/site/slider?status=active');
            if (res.data && res.data.data && Array.isArray(res.data.data.data)) {
                const fetchedSlides = res.data.data.data.map((s: any) => ({
                    image: getImageUrl(s.image, ''),
                    title: s.title,
                    subtitle: s.description,
                    buttonName: s.buttonName || "View Rooms",
                    buttonUrl: s.buttonUrl || "/rooms"
                }));
                set({ slides: fetchedSlides, loading: false });
            } else {
                set({ slides: [], loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch slides', loading: false });
        }
    },
}));
