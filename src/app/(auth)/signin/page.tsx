'use client';
// import BlueRingBackground from "@/app/(auth)/signin/BlueRingBackground";
import { AuthForm } from "@/app/(auth)/AuthForm";

export default function Page() {
    return (
        <div className="grid min-h-screen w-full">
          <div className="flex items-center justify-center bg-slate-50 p-4">
            <AuthForm 
              mode="signin"
            />
          </div>
          {/* <div className="relative hidden bg-slate-900 md:block">
            <BlueRingBackground />
          </div> */}
        </div>
      );
}