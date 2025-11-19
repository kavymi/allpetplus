

import { SignInButton, SignedIn, SignedOut } from '@/lib/clerk-components';
import { useMemo, useState } from 'react';
import Image from 'react';
import { Link } from '@tanstack/react-router';
import type { ProductDetail } from '@/lib/shopify/types';

type ProductDetailShellProps = {
  product: ProductDetail;
};

export function ProductDetailShell({ product }: ProductDetailShellProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(product.presets[0]?.handle ?? null);

  const selectedImage = product.images[selectedImageIndex];

  const sizeGuide = useMemo(() => {
    if (!selectedSize) return null;
    return product.sizeGuide.find((guide) => guide.size === selectedSize);
  }, [product.sizeGuide, selectedSize]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
      <section className="flex-1 space-y-6">
        <div className="relative aspect-square overflow-hidden rounded-[36px] bg-[var(--color-background)]">
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            className="object-cover"
            priority
          />
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="absolute left-6 top-6 rounded-full bg-[var(--color-secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md"
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {product.images.map((image, index) => {
            const isActive = index === selectedImageIndex;
            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className="relative aspect-square overflow-hidden rounded-2xl border"
                style={{
                  borderColor: isActive
                    ? 'var(--color-primary)'
                    : 'color-mix(in srgb,var(--color-border)80%,white)',
                }}
              >
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
              </button>
            );
          })}
        </div>
      </section>

      <aside className="flex-1 space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            Harness hero
          </p>
          <h1 className="text-3xl font-semibold text-[var(--color-foreground)] sm:text-4xl">
            {product.title}
          </h1>
          <p className="text-sm text-[var(--color-muted)]">{product.description}</p>
          <div className="flex items-center gap-3 text-lg font-semibold text-[var(--color-foreground)]">
            <span>${product.priceRange.min.toFixed(0)}</span>
            <span className="text-sm text-[var(--color-muted)]">
              up to ${product.priceRange.max.toFixed(0)}
            </span>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Recommended presets
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {product.presets.map((preset) => (
              <button
                key={preset.handle}
                type="button"
                onClick={() => setSelectedTemplate(preset.handle)}
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition"
                style={{
                  borderColor:
                    selectedTemplate === preset.handle
                      ? 'var(--color-primary)'
                      : 'color-mix(in srgb,var(--color-border)80%,white)',
                  backgroundColor:
                    selectedTemplate === preset.handle
                      ? 'rgba(59,175,218,0.12)'
                      : 'var(--color-surface)',
                }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  {preset.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {preset.title}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">{preset.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Fit guide
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.sizeGuide.map((guide) => (
              <button
                key={guide.size}
                type="button"
                onClick={() => setSelectedSize(guide.size)}
                className="rounded-full border px-4 py-2 text-sm font-semibold transition"
                style={{
                  borderColor:
                    selectedSize === guide.size
                      ? 'var(--color-secondary)'
                      : 'color-mix(in srgb,var(--color-border)75%,white)',
                  color:
                    selectedSize === guide.size ? 'var(--color-secondary)' : 'var(--color-muted)',
                }}
              >
                {guide.size}
              </button>
            ))}
          </div>
          {sizeGuide ? (
            <div className="rounded-2xl border border-[color-mix(in srgb,var(--color-border)70%,white)] bg-white/90 px-5 py-4 text-sm text-[var(--color-muted)]">
              <p>
                <strong className="text-[var(--color-foreground)]">{sizeGuide.size}</strong> best
                fits neck{' '}
                <strong className="text-[var(--color-foreground)]">{sizeGuide.neck}</strong> and
                chest <strong className="text-[var(--color-foreground)]">{sizeGuide.chest}</strong>.{' '}
                {sizeGuide.note}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-muted)]">
              Select a size to see measurement guidance. Need help?{' '}
              <a className="underline" href="mailto:fit@harnesshero.com">
                Contact fit expert
              </a>
            </p>
          )}
        </section>

        <section className="rounded-[28px] border border-[color-mix(in srgb,var(--color-border)70%,white)] bg-white/90 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Customize & add to cart
          </h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Add your dog’s name, pick hardware finishes, and tweak colors inside the builder. We
            carry your selections into Shopify checkout automatically.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/builder?template=${selectedTemplate ?? product.handle}`}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[var(--color-secondary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(255,122,89,0.9)] transition hover:translate-y-[-1px] hover:bg-[color-mix(in srgb,var(--color-secondary)92%,white)]"
              prefetch={false}
            >
              Customize this harness
            </Link>
            <Link
              href="/cart"
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[color-mix(in srgb,var(--color-border)75%,white)] px-5 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Add preset to cart
            </Link>
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl={`/builder?template=${selectedTemplate ?? product.handle}`}>
                <button className="inline-flex flex-1 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)30%,white)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-white">
                  Save with AI suggestions
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/saved"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)30%,white)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)] hover:bg-white"
              >
                Save for later
              </Link>
            </SignedIn>
          </div>
        </section>

        <section className="space-y-3 text-sm text-[var(--color-muted)]">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-muted)]">
            Materials & care
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            {product.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
          <div className="rounded-2xl border border-[color-mix(in srgb,var(--color-border)70%,white)] bg-[var(--color-background)] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
              Care tips
            </p>
            <p className="mt-1 text-sm">{product.care}</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
