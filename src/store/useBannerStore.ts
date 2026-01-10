import { create } from 'zustand';
import { bannerService } from '@/api/bannerService';

interface BannerData {
    aboutBanner?: {
        bannerOne?: {
            userName: string;
            userImage: string;
            position: string;
            subtitle: string;
            title: string;
            ckEditor: string;
            image: string;
        };
        bannerTwo?: {
            backgroundImage: string;
            title: string;
            subtitle: string;
            cardTitle: string;
            highlightedCardTitle: string;
            descriptionOne: string;
            descriptionTwo: string;
            cardImages: { id: number; url: string }[];
        };
        bannerThree?: {
            imageOne: string;
            imageTwo: string;
            title: string;
            descriptionOne: string;
            descriptionTwo: string;
            subtitle: string;
        };
    };
  
}

interface BannerState {
    banners: BannerData | null;
    loading: boolean;
    error: string | null;
    fetchBanners: () => Promise<void>;
}

export const useBannerStore = create<BannerState>((set) => ({
    banners: null,
    loading: false,
    error: null,

    fetchBanners: async () => {
        set({ loading: true, error: null });
        try {
            const data = await bannerService.getBanners();
            set({ banners: data, loading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch banners', loading: false });
        }
    },
}));
