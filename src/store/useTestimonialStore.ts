import { testimonialService } from "@/api/testimonialService";
import { create } from "zustand";

export interface TestimonialDetails {
    _id: string;
    title: string;
    reviewerName: string;
    image: string;
    ratings: string;
    reviews: string;
    status: string;
}

interface TestimonialState {
    testimonials: TestimonialDetails[];
    error: string | null;
    loading: boolean;
    fetchTestimonial: () => Promise<void>;
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
    testimonials: [],
    loading: false,
    error: null,
    fetchTestimonial: async () => {
        set({ loading: true, error: null })
        try {
            const res = await testimonialService.getTestimonial();
            if (res.status === undefined || res.status || res.success) {
                set({ testimonials: res?.data?.data || [], loading: false });
            } else {
                set({ error: res.message || 'Failed to fetch testimonials', loading: false });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch testimonials', loading: false });
        }
    }
}));
