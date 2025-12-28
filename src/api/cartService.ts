import axiosInstance from './axiosInstance';

const getCart = async () => {
    try {
        const response = await axiosInstance.get('/site/cart');
        return response.data;
    } catch (error) {
        console.error("Cart fetch error", error);
        return null; // Return null on error or if no cart
    }
};

const syncCart = async (cartItem: any) => {
    try {
        // Wrap single item in array or send structure matching backend
        // Backend CartController expects { items: [...] }
        // Frontend 'cartItem' is a single object currently
        const items = cartItem ? [cartItem] : [];
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
