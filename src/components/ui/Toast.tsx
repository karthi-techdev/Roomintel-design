"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | "success";
}

interface ToastContextType {
    toasts: Toast[];
    toast: (props: Omit<Toast, "id">) => void;
    dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const toast = React.useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000); // Auto dismiss
    }, []);

    const dismiss = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, toast, dismiss }}>
            {children}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[350px]">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "relative flex w-full items-start gap-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all animate-in slide-in-from-right-full",
                            t.variant === "destructive" && "bg-destructive text-destructive-foreground border-red-500 bg-white",
                            t.variant === "success" && "border-green-500 bg-white",
                            t.variant === "default" && "bg-background text-foreground bg-white"
                        )}
                    >
                        {t.variant === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                        {t.variant === "destructive" && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}

                        <div className="grid gap-1">
                            {t.title && <div className={cn("text-sm font-semibold",
                                t.variant === "destructive" ? "text-red-600" :
                                    t.variant === "success" ? "text-green-600" : "text-gray-900"
                            )}>{t.title}</div>}
                            {t.description && <div className="text-sm opacity-90 text-gray-500 text-xs">{t.description}</div>}
                        </div>
                        <button
                            onClick={() => dismiss(t.id)}
                            className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5"
                        >
                            <X className="h-4 w-4 opacity-50" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
