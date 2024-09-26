'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 h-full w-full">
      <h2>Oops! Terjadi kesalahan</h2>
      <Button
        variant="destructive"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Coba lagi
      </Button>
    </div>
  );
}
