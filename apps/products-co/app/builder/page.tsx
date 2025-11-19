'use client';

import Link from 'next/link';

export default function BuilderPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-foreground)]">
          Custom Builder
        </h1>
        <p className="text-xl text-[var(--color-foreground-secondary)] mb-8">
          Coming Soon - Wire up builder components
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
