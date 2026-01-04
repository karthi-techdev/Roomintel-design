import axiosInstance from "./axiosInstance";
interface ReviewDetails{
    token : string,
    bookingId : string,
    userId : string,
    rating : number,
    comment : string,
}

export const reviewService = {
    addReview : async (payload : ReviewDetails) => {
        const response = await axiosInstance.post('/review', payload);
        return response.data;
    },
    verifyReview : async (token : string) => {
        const response  = await axiosInstance.get(`/review/verify?token=${token}`);
        return response.data;
    },
    getReview : async (filter : {}) => {
        const response  = await axiosInstance.get(`/review`,{params : filter});
        return response.data;
    },
}