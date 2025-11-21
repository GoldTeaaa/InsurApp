'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Something went wrong!</h2>
      <p className="mt-2 text-gray-600">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Button onClick={() => reset()} className="mt-6">
        Try again
      </Button>
    </div>
  );
}