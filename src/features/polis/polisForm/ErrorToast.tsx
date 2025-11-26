// src/components/ErrorToast.tsx
import {  useEffect } from 'react';
import { FieldErrors } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

function ErrorList({ errors }: { errors: object }) {
    // This is similar to the logic in your original FormErrors.tsx
    return (
        <ul className="list-disc space-y-1 pl-5">
            {Object.entries(errors).map(([key, error]) => {
                if (!error) return null;

                // Handle root errors from superRefine
                if (key === 'root' && error.message) {
                    return <li key={key}>{error.message}</li>;
                }

                // Handle field-specific errors
                if (error.message && typeof error.message === 'string') {
                    return (
                        <li key={key}>
                            <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {error.message}
                        </li>
                    );
                }

                // Recurse for nested objects (like field arrays)
                if (typeof error === 'object' && !Array.isArray(error) && Object.keys(error).length > 0) {
                    return (
                        <li key={key}>
                            <span className="font-semibold capitalize">{key}:</span>
                            <ErrorList errors={error} />
                        </li>
                    );
                }
                return null;
            })}
        </ul>
    );
}

type ErrorToastProps = {
    errors: FieldErrors | null;
    onClose: () => void;
}

export default function ErrorToast({ errors, onClose }: ErrorToastProps) {
    useEffect(() => {
        if (errors) {
            const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [errors, onClose]);

    return (
        <AnimatePresence>
            {errors && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed top-5 right-5 z-50 w-full max-w-sm rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 shadow-lg"
                >
                    <h3 className="mb-2 font-bold">Validation Errors</h3>
                    <ErrorList errors={errors} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}