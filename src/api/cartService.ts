import axiosInstance from './axiosInstance';

const getCart = async () => {
    try {
        const response = await axiosInstance.get('/site/cart');
        return response.data;
    } catch (error) {
        return null; // Return null on error or if no cart
    }
};

const syncCart = async (items: any[]) => {
    try {
        // Backend CartController expects { items: [...] }
        const response = await axiosInstance.post('/site/cart/sync', { items });
        return response.data;
    } catch (error) {
        console.error("Cart sync error", error);
        return null;
    }
};

const clearCart = async () => {
    try {
        await axiosInstance.delete('/site/cart');
    } catch (error) {
        console.error("Cart clear error", error);
    }
};

export const cartService = {
    getCart,
    syncCart,
    clearCart
};
