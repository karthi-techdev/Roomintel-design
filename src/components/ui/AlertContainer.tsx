"use client";

import React from 'react';
import { useAlertStore, AlertMessage } from '../../utils/alertStore';
import { Alert, AlertDescription, AlertTitle } from './Alert';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export function AlertContainer() {
    const { alerts, removeAlert } = useAlertStore();

    if (alerts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert: AlertMessage) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto shadow-lg"
                    >
                        <div className="relative group">
                            <Alert variant={
                                alert.type === 'error' ? 'destructive' :
                                    alert.type === 'success' ? 'success' :
                                        'default'
                            }>
                                {alert.title && <AlertTitle>{alert.title}</AlertTitle>}
                                <AlertDescription>{alert.message}</AlertDescription>
                            </Alert>
                            <button
                                onClick={() => removeAlert(alert.id)}
                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
