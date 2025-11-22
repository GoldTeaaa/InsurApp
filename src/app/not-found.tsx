import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}