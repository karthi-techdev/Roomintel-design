import axiosInstance from './axiosInstance';

export interface PromoCodeValidationResult {
    valid: boolean;
    message?: string;
    code?: string;
    discountType?: "percentage" | "fixed";
    discountValue?: number;
    discountAmount?: number;
}

export const promoCodeService = {
    validatePromoCode: async (code: string, orderAmount: number): Promise<PromoCodeValidationResult> => {
        try {
            const response = await axiosInstance.post('/site/promo-codes/validate', {
                code,
                orderAmount
            });
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return {
                    valid: false,
                    message: error.response.data.message || "Invalid promo code"
                };
            }
            return {
                valid: false,
                message: "Failed to validate promo code"
            };
        }
    }
};
