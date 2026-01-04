import { useSettingsStore } from '@/store/useSettingsStore';

export const useCurrency = () => {
    const settings = useSettingsStore((state) => state.settings);
    const currencyIcon = settings?.currencyIcon || '₹'; // Default to Rupee if not loaded

    const formatPrice = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return `${currencyIcon}0.00`;
        return `${currencyIcon}${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return { currencyIcon, formatPrice };
};
