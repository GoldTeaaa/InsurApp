"use client";

import BlueRingBackground from "@/components/BlueRingBackground";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 md:grid-cols-2">
      {/* Left side with blue ring animation, hidden on mobile */}
      <div className="flex items-center justify-center bg-slate-50 p-4">
        <LoginForm />
      </div>
      <div className="relative hidden bg-slate-900 md:block">
        <BlueRingBackground />
      </div>
      {/* Right side with login form */}
    </div>
  );
}