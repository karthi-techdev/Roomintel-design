import React from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

interface AlertProps {
    variant?: 'default' | 'destructive' | 'success';
    className?: string;
    title?: string;
    children: React.ReactNode;
}

export function Alert({ variant = 'default', className = '', title, children }: AlertProps) {
    const baseStyles = "relative w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";

    let variantStyles = "bg-background text-foreground";
    let icon = <FaInfoCircle className="h-4 w-4" />;

    if (variant === 'destructive') {
        variantStyles = "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600 bg-red-50";
        icon = <FaExclamationTriangle className="h-4 w-4" />;
    } else if (variant === 'success') {
        variantStyles = "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600 bg-green-50";
        icon = <FaCheckCircle className="h-4 w-4" />;
    } else {
        variantStyles = "bg-gray-50 text-gray-800 border-gray-200";
    }

    return (
        <div className={`${baseStyles} ${variantStyles} ${className}`} role="alert">
            {icon}
            <div className="pl-7 text-sm [&_p]:leading-relaxed">
                {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
                {children}
            </div>
        </div>
    );
}

export function AlertTitle({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
            {children}
        </h5>
    );
}

export function AlertDescription({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
            {children}
        </div>
    );
}
