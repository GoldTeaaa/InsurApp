'use client';

import Link from 'next/link';

export default function PolisNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6">
      <div className="max-w-xl w-full text-center p-8 rounded-2xl shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center justify-center mb-6">
          <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-full shadow-inner">
            <svg className="w-20 h-20 animate-[float_4s_ease-in-out_infinite]" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="10" y="10" width="100" height="100" rx="18" fill="url(#g)" stroke="white" strokeOpacity="0.6" strokeWidth="2"/>
              <path d="M38 46h44M38 62h44M38 78h28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#7c3aed" stopOpacity="0.12"/>
                  <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.12"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Polis not found</h1>
        <p className="text-gray-600 mb-6">We couldn’t find the policy you were looking for. It may have been removed or the link is incorrect.</p>

        <div className="flex justify-center gap-3">
          <Link href="/dashboard/polis/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition">
            Back
          </Link>

          <a href="mailto:support@example.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            Contact support
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500">Tip: check the policy number or try searching from the dashboard.</div>
      </div>

      <style jsx>{` 
        @keyframes float { 
          0% { transform: translateY(0) }
          50% { transform: translateY(-6px) }
          100% { transform: translateY(0) }
        }
        .animate-\[float_4s_ease-in-out_infinite\] { animation: float 4s ease-in-out infinite; }
      `}</style>
    </main>
  );
}
