import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
    id: string;
    type: AlertType;
    title?: string;
    message: string;
    duration?: number;
}

interface AlertStore {
    alerts: AlertMessage[];
    addAlert: (alert: Omit<AlertMessage, 'id'>) => void;
    removeAlert: (id: string) => void;
    clearAlerts: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
    alerts: [],
    addAlert: (alert) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newAlert: AlertMessage = { ...alert, id };

        set((state) => ({
            alerts: [...state.alerts, newAlert]
        }));

        // Auto-remove after duration (default 5 seconds)
        const duration = alert.duration || 5000;
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    alerts: state.alerts.filter((a) => a.id !== id)
                }));
            }, duration);
        }
    },
    removeAlert: (id) =>
        set((state) => ({
            alerts: state.alerts.filter((alert) => alert.id !== id)
        })),
    clearAlerts: () => set({ alerts: [] })
}));

// Convenience functions for different alert types
export const showAlert = {
    success: (message: string, title?: string, duration?: number) => {
        useAlertStore.getState().addAlert({ type: 'success', message, title, duration });
    },
    error: (message: string, title?: string, duration?: number) => {
        useAlertStore.getState().addAlert({ type: 'error', message, title, duration });
    },
    warning: (message: string, title?: string, duration?: number) => {
        useAlertStore.getState().addAlert({ type: 'warning', message, title, duration });
    },
    info: (message: string, title?: string, duration?: number) => {
        useAlertStore.getState().addAlert({ type: 'info', message, title, duration });
    }
};
