'use client';
import { AuthForm } from "@/app/(auth)/AuthForm";

export default function Page() {
    return (
        <div className="grid min-h-screen w-full">
            <div className="flex items-center justify-center bg-slate-50 p-4">
                <AuthForm
                    mode="signup"
                />
            </div>
        </div>
    );
}