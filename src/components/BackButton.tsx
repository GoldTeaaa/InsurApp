'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
    text?: string;
    className?: string;
}

export default function BackButton({
    text,
    className = ""
}: Props) {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.back()} 
            type="button" 
            className={`group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4 ${className}`}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all group-hover:border-slate-300 group-hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span className="tracking-tight">Kembali {text && <span className="font-normal text-slate-400 ml-1">/ {text}</span>}</span>
        </button>
    );
}