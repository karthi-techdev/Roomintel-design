export const validateField = (name: string, value: string): string => {
    switch (name) {
        case 'name':
            if (!value.trim()) return 'Name is required';
            if (value.trim().length < 2) return 'Name must be at least 2 characters';
            if (value.trim().length > 50) return 'Name must not exceed 50 characters';
            return '';

        case 'email':
            if (!value.trim()) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
            return '';

        case 'phone':
            if (!value.trim()) return 'Phone number is required';
            const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number (10-15 digits)';
            return '';

        case 'address':
            if (!value.trim()) return 'Address is required';
            return '';

        case 'city':
            if (!value.trim()) return 'City is required';
            return '';

        case 'state':
            if (!value.trim()) return 'State is required';
            return '';

        case 'country':
            if (!value.trim()) return 'Country is required';
            return '';

        case 'postcode':
            if (!value.trim()) return 'Postcode is required';
            if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(value)) return 'Please enter a valid postcode';
            return '';

        default:
            return '';
    }
};
