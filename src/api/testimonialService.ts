import axiosInstance from "./axiosInstance";

export const testimonialService = {
    getTestimonial: async () => {
        const res = await axiosInstance.get('/site/testimonial')
        return res.data
    }
}