'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary. The raw error is never rendered — only the
 * digest, which lets support correlate a report with the server logs.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[route-error]', error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
          <TriangleAlert className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Something went wrong
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          The page could not be loaded. This has been logged for our engineers. Please try again — if
          the problem persists, contact our support team.
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-subtle">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} size="lg">
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
