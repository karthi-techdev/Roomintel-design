"use client";

import { useEffect } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { getImageUrl } from '../utils/getImage';

export default function DynamicFavicon() {
    const { settings } = useSettingsStore();

    useEffect(() => {
        if (settings?.favicon) {
            const url = getImageUrl(settings.favicon);

            // Update existing icon or create new one
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.head.appendChild(link);
            }
            link.href = url;

            // Also handle Apple Touch Icon if needed, but standard icon is priority
        }
    }, [settings]);

    return null;
}
