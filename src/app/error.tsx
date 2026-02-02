'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
  back
}: {
  error: Error & { digest?: string };
  reset: () => void;
  back?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center gap-4">
      <h2 className="text-2xl font-semibold text-gray-800">Something went wrong!</h2>
      <p className="mt-2 text-gray-600">
        {error.message || 'An unexpected error occurred.'}
      </p>
      {/* Add agnostic back button */}
      <div className='flex justify-center gap-2'>
        <Button onClick={() => back ? back() : router.back()}>
          Go Back
        </Button>
        <Button onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  );
}