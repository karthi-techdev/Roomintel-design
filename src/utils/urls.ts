export const LIVE = true;

export const SITE_URL = LIVE ? 'https://avensstay.com' : 'http://localhost:3000';
export const API_BASE_URL = LIVE ? 'http://admin.avensstay.com:8000/api/v1' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1');
export const IMAGE_BASE_URL = LIVE ? 'http://admin.avensstay.com:8000' : (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'http://localhost:8000');


export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/site/auth/login',
    AUTH_REGISTER: '/site/auth/register',
    AUTH_ME: '/site/auth/me',
    AUTH_FORGOT_PASSWORD: '/site/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/site/auth/reset-password',
    AUTH_UPDATE_PROFILE: '/site/auth/update-profile',

    // Settings
    SETTINGS_GENERAL: '/site/settings/general',
    SETTINGS_ALL: '/site/settings',

    // Accommodations
    ACCOMMODATIONS: '/site/accommodations',
    ACCOMMODATIONS_BY_ID: (id: string) => `/site/accommodations/${id}`,

    // Banners
    BANNERS: '/site/banners',

    // Cart
    CART: '/site/cart',
    CART_SYNC: '/site/cart/sync',

    // Contact
    CONTACT_INQUIRY: '/site/contact',

    // Gallery
    GALLERY: '/site/gallery',
    GALLERY_CATEGORIES: '/site/gallery/categories',

    // Membership
    MEMBERSHIP_MY: '/site/membership/my-membership',

    // Wishlist
    WISHLIST: '/wishlist',
    WISHLIST_ALL: '/wishlist/all',
    WISHLIST_BY_ID: (id: string) => `/wishlist/${id}`,

    // Promo Codes
    PROMO_VALIDATE: '/site/promo-codes/validate',
    PROMO_APPLY: '/site/promo-codes/apply',
    PROMO_REMOVE: '/site/promo-codes/remove',

    // Reviews
    REVIEWS: '/review',
    REVIEWS_VERIFY: '/review/verify',

    // Site / Rooms / Content
    SITE_ROOMS: '/site/rooms',
    SITE_ROOM_BY_SLUG: (slug: string) => `/site/rooms/${slug}`,
    SITE_CATEGORIES: '/site/categories',
    SITE_ROOM_BANNER: '/site/room-banner',
    SITE_FAQS: '/site/faqs',
    SITE_SERVICES: '/site/services',
    SITE_CONFIG_BY_SLUG: (slug: string) => `/site/config/${slug}`,

    // Testimonials
    TESTIMONIALS: '/site/testimonial',

    // Bookings
    BOOKINGS: '/site/bookings',
    BOOKINGS_MY: '/site/bookings/my-bookings',
    BOOKINGS_CANCEL: (id: string) => `/site/bookings/${id}/cancel`,
    BOOKINGS_ROOM: (slug: string) => `/bookings/room/${slug}`,
    BOOKINGS_BOOKED_DATES: '/site/bookings/booked-dates',

    // Payment
    PAYMENT_INITIATE: '/payment',
};

const URLS = {
    SITE_URL,
    API_BASE_URL,
    IMAGE_BASE_URL,
    API_ENDPOINTS
};

export default URLS;
