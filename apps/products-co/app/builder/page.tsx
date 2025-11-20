'use client';

import Link from 'next/link';

export default function BuilderPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="text-3xl font-bold mb-3 text-[var(--color-foreground)]">
          Custom Builder
        </h1>
        <p className="text-lg text-[var(--color-foreground-secondary)] mb-6">
          Full builder coming soon - wire up components
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-all font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
