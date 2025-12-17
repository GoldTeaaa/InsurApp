'use client';

import GeneralError from '@/components/GeneralError';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // You can now pass a custom title specific to this route if you want
  return <GeneralError error={error} reset={reset} title="Error pada dataNasabah" />;
}