import { reviewService } from "@/api/reviewService";
import { create } from "zustand"

export interface ReviewDetails {
    token : string,
    bookingId: string,
    userId: string,
    rating: number,
    comment: string,
}
interface verifyDetails {
    bookingId : string,
    userId : string,
    message : string
}
interface ReviewState {
    formData: ReviewDetails | null,
    verifyResponse : verifyDetails | null;
    isLoading: boolean;
    error: string | null;
    addReview: (payload : ReviewDetails) => Promise<void>;
    verifyReview: (token : string) => Promise<void>;
    alreadyExistErrMsg : string,
}
export const useReviewStore = create<ReviewState>((set) => ({
    formData: null,
    verifyResponse : null,
    isLoading: false,
    error: null,
    alreadyExistErrMsg : '',
    addReview: async (payload: ReviewDetails) => {
        try {
            const response = await reviewService.addReview(payload);
            console.log('=========reeeeeeee',response)
            set({
                
            })
        } catch (error : any) {
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
                verifyResponse : response
            })
        } catch (error : any) {
            console.log('======error',error )
            set({
                alreadyExistErrMsg :error.response.data.message, 
                isLoading: false,
                error: error.message || 'Failed to load review information',
              });
        }
    },
}))