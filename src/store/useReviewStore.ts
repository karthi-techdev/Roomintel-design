import { reviewService } from "@/api/reviewService";
import { create } from "zustand"

export interface ReviewDetails {
    token: string,
    bookingId: string,
    userId: string,
    rating: number,
    comment: string,
}

interface verifyDetails {
    bookingId: string,
    userId: string,
    message: string
}

interface RoomId {
    _id: string,
    name: string,
    slug : string,
}

interface bookingIdProps {
    _id : string,
    bookingStatus : string,
    room : RoomId
}

interface userIdProps {
    _id : string,
    email : string,
    name : string,
    avatar : string,
    phone : string,
}

export interface Reviews {
    _id: string,
    bookingId: bookingIdProps,
    userId: userIdProps,
    rating: number,
    comment: string,
    status: string,
    createdAt: string,
    updatedAt: string,
}

interface ReviewState {
    reviews : Reviews[] | [],
    formData: ReviewDetails | null,
    verifyResponse: verifyDetails | null;
    isLoading: boolean;
    error: string | null;
    addReview: (payload: ReviewDetails) => Promise<void>;
    verifyReview: (token: string) => Promise<void>;
    fetchReview: (filter: {}) => Promise<void>;
    alreadyExistErrMsg: string,
    message : string | null;
}
export const useReviewStore = create<ReviewState>((set) => ({
    reviews : [],
    formData: null,
    verifyResponse: null,
    isLoading: false,
    error: null,
    message : null,
    alreadyExistErrMsg: '',
    addReview: async (payload: ReviewDetails) => {
        try {
            const response = await reviewService.addReview(payload);
            set({
                message : 'Review added successfully'
            })
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || 'Failed to load review information',
            });
        }
    },
    verifyReview: async (token: string) => {
        try {
            const response = await reviewService.verifyReview(token);
            set({
                verifyResponse: response
            })
        } catch (error: any) {
            set({
                alreadyExistErrMsg: error.response.data.message,
                isLoading: false,
                error: error.message || 'Failed to load review information',
            });
        }
    },
    fetchReview: async (filter : {}) =>  {
        try {
            const response = await reviewService.getReview(filter);
            set({
                reviews : response.data
            })
        } catch (error : any) {
            set({
                isLoading: false,
                error: error.message || 'Failed to load review data',
            });
        }
    }
}))