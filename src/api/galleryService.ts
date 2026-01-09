import axiosInstance from './axiosInstance';

export interface GalleryItem {
    _id: string;
    name: string;
    image: string;
    isFeatured: boolean;
    galleryCategory: {
        _id: string;
        name: string;
    };
}

export interface GalleryCategory {
    _id: string;
    name: string;
}

const galleryService = {
    getGalleries: async (category?: string) => {
        const response = await axiosInstance.get('/site/gallery', {
            params: { category }
        });
        return response.data;
    },

    getCategories: async () => {
        const response = await axiosInstance.get('/site/gallery/categories');
        return response.data;
    }
};

export default galleryService;
