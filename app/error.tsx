'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="bg-red-50 border border-red-500 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-2xl">⚠️</span>
          <h2 className="text-lg font-bold text-red-700">Something went wrong!</h2>
          <p className="text-sm text-red-600">
            {error.message || 'An unexpected error occurred.'}
            {error.digest && (
              <div className="mt-2 text-xs text-red-600">
                Error ID: {error.digest}
              </div>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => reset()}
          >
            🔄 Try again
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => router.push('/')}
          >
            🏠 Return Home
          </button>
        </div>
      </div>
    </div>
  );
}