'use client';

/**
 * Last-resort boundary for failures in the root layout. It must render its own
 * <html> and <body> because the layout that normally provides them has failed,
 * and it cannot rely on the app stylesheet being available.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020617',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>
            A critical error occurred
          </h1>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            The application could not start. Our engineers have been notified.
          </p>
          {error.digest ? (
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(90deg, #0057ff, #00c2ff)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload the application
          </button>
        </div>
      </body>
    </html>
  );
}
