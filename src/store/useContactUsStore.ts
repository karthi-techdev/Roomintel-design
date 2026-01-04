// src/store/useContactUsStore.ts
import { create } from 'zustand';
import { contactService } from '@/api/contactService';

interface ContactInfo {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  checkIn?: string;
  checkOut?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactUsState {
  // Site settings
  contact: ContactInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;

  // Form submission state
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
  successMessage: string | null;

  submitContactForm: (formData: ContactFormData) => Promise<{ success: boolean; message?: string }>;
  resetSubmission: () => void;
}

export const useContactUsStore = create<ContactUsState>((set) => ({
  contact: null,
  isLoading: false,
  error: null,

  isSubmitting: false,
  isSubmitted: false,
  submitError: null,
  successMessage: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await contactService.getSettings();
      if (response?.data?.contact) {
        set({ contact: response.data.contact, isLoading: false });
      } else {
        set({ isLoading: false, error: 'Invalid settings data' });
      }
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Failed to load contact information',
      });
    }
  },

  submitContactForm: async (formData: ContactFormData) => {
    set({ isSubmitting: true, submitError: null });

    try {
      const response = await contactService.submitContactInquiry(formData);
      set({
        isSubmitting: false,
        isSubmitted: true,
        successMessage: response?.message || 'Thank you! Your message has been sent successfully.',
      });
      return { success: true };
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to send message. Please try again later.';
      set({
        isSubmitting: false,
        submitError: message,
      });
      return { success: false, message };
    }
  },

  resetSubmission: () => {
    set({
      isSubmitted: false,
      submitError: null,
      successMessage: null,
    });
  },
}));