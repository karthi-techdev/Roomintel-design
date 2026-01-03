import { create } from 'zustand';
import { siteService } from '@/api/siteService';

interface Settings {
    siteName: string;
    siteLogo: string;
    footerLogo: string;
    backendLogo: string;
    favicon: string;
    currencyIcon: string;
    defaultCurrency: string;
    timezone: string;
}

interface SettingsState {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    loading: false,
    error: null,

    fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
            // Use existing siteService to fetch general settings
            const response = await siteService.getGeneralSettings();
            if (response && (response.status || response.success) && response.data) {
                set({ settings: response.data, loading: false });
            } else {
                set({ settings: null, loading: false });
            }
        } catch (error: any) {
            console.error('Failed to fetch settings:', error);
            set({ error: error.message || 'Failed to fetch settings', loading: false });
        }
    },
}));
