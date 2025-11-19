import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-[var(--color-foreground)]">404</h1>
        <p className="text-xl text-[var(--color-foreground-secondary)] mb-8">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

