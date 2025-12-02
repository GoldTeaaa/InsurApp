"use client";
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useDebounce } from '@/lib/utils/useDebounce';

interface FormAutoSaveProps {
    storageKey: string;
}

export function FormAutoSave({ storageKey }: FormAutoSaveProps) {
    const { control } = useFormContext();
    const watchedValues = useWatch({ control });
    const debouncedValues = useDebounce(watchedValues, 500);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(debouncedValues));
    }, [debouncedValues, storageKey]);

    return null; // This component renders nothing.
}