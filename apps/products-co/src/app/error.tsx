'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-[var(--color-foreground)]">Oops!</h1>
        <p className="text-xl text-[var(--color-foreground-secondary)] mb-8">
          Something went wrong
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

