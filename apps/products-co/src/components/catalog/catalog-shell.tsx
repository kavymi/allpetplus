

import { SignInButton, SignedIn, SignedOut } from '@/lib/clerk-components';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useMemo, useState, memo } from 'react';
import type { CatalogFilters, CatalogProduct } from '@/lib/shopify/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type CatalogShellProps = {
  initialProducts: CatalogProduct[];
  filters: CatalogFilters;
};

export function CatalogShell({ initialProducts, filters }: CatalogShellProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    sizes: string[];
    tags: string[];
    bestFor: string[];
    materials: string[];
  }>({
    sizes: [],
    tags: [],
    bestFor: [],
    materials: [],
  });

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSizes =
        !selectedFilters.sizes.length ||
        selectedFilters.sizes.some((size) => product.sizes.includes(size));
      const matchesTags =
        !selectedFilters.tags.length ||
        selectedFilters.tags.some((tag) => product.tags.includes(tag));
      const matchesBestFor =
        !selectedFilters.bestFor.length ||
        selectedFilters.bestFor.some((tag) => product.bestFor?.includes(tag));
      const matchesMaterials =
        !selectedFilters.materials.length ||
        selectedFilters.materials.some((material) => product.materials.includes(material));
      return matchesSizes && matchesTags && matchesBestFor && matchesMaterials;
    });
  }, [initialProducts, selectedFilters]);

  const toggleFilter = (key: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      const nextValues = exists ? current.filter((item) => item !== value) : [...current, value];
      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
              Harness Hero Catalog
            </p>
            <h1 className="text-4xl font-bold text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
              Find the Perfect Harness
            </h1>
            <p className="mx-auto max-w-3xl text-base text-[var(--color-muted)] sm:text-lg">
              Filter by fit, reflective options, eco materials, and more. Start from a template or
              jump into the builder to customize every detail.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Button asChild size="lg" className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
              <Link to="/builder">Try AI Design Assist</Link>
            </Button>
            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/builder">
                <Button variant="outline" size="lg" className="border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]">
                  Sign in to Save Templates
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild variant="outline" size="lg" className="border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]">
                <Link to="/saved">View Saved Templates</Link>
              </Button>
            </SignedIn>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-fit">
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)]" padding="lg">
              <h2 className="mb-6 text-lg font-semibold text-[var(--color-foreground)]">Filters</h2>
              <FilterGroup
                label="Size"
                options={filters.sizes}
                selected={selectedFilters.sizes}
                onToggle={(value) => toggleFilter('sizes', value)}
              />
              <FilterGroup
                label="Best for"
                options={filters.bestFor}
                selected={selectedFilters.bestFor}
                onToggle={(value) => toggleFilter('bestFor', value)}
              />
              <FilterGroup
                label="Materials"
                options={filters.materials}
                selected={selectedFilters.materials}
                onToggle={(value) => toggleFilter('materials', value)}
              />
              <FilterGroup
                label="Features"
                options={filters.tags}
                selected={selectedFilters.tags}
                onToggle={(value) => toggleFilter('tags', value)}
              />
            </Card>
          </aside>

          <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-[var(--color-surface)] px-6 py-4 border border-[var(--color-border)]">
              <p className="text-base text-[var(--color-muted)]">
                Showing{' '}
                <span className="font-bold text-[var(--color-foreground)]">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'harness' : 'harnesses'}
              </p>
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                More Styles Added Weekly
              </span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <CatalogCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type FilterGroupProps = {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

const FilterGroup = memo(function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: FilterGroupProps) {
  const groupId = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <fieldset className="border-b border-[var(--color-border)] pb-6 last:border-b-0 last:pb-0">
      <legend className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-labelledby={groupId}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const optionId = `${groupId}-${option.toLowerCase().replace(/\s+/g, '-')}`;

          return (
            <button
              key={option}
              id={optionId}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => onToggle(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(option);
                }
              }}
              className="rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]"
              style={{
                borderColor: isSelected
                  ? 'var(--color-primary)'
                  : 'var(--color-border-strong)',
                color: isSelected ? 'var(--color-primary-foreground)' : 'var(--color-muted)',
                backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
              }}
            >
              <span className="sr-only">
                {isSelected ? 'Remove' : 'Add'} {option} filter
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
});

interface CatalogCardProps {
  product: CatalogProduct;
}

const CatalogCard = memo(function CatalogCard({ product }: CatalogCardProps) {
  const aiHighlight = product.tags.find((tag) => tag.toLowerCase().includes('ai'));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-300" padding="none" interactive>
        <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-muted)]">
          <img
            src={product.featuredImage.src}
            alt={product.featuredImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          {product.isNewArrival && (
            <Badge
              variant="secondary"
              size="sm"
              className="absolute left-4 top-4 text-white bg-[var(--color-secondary)] shadow-lg"
            >
              New Arrival
            </Badge>
          )}
          {aiHighlight && (
            <Badge
              variant="default"
              size="sm"
              className="absolute right-4 top-4 text-white bg-[var(--color-primary)] shadow-lg"
            >
              AI Recommended
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-4 px-6 py-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-1">
                {product.title}
              </h2>
              <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                Fit for {product.sizes.join(', ')}
              </p>
            </div>
            <span className="text-lg font-bold text-[var(--color-primary)]">
              ${product.priceRange.min.toFixed(0)}
            </span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">{product.description}</p>
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" size="sm" className="bg-[var(--color-surface-muted)] text-[var(--color-muted)] border-[var(--color-border)]">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button asChild variant="outline" size="sm" fullWidth className="border-[var(--color-border-strong)] hover:bg-[var(--color-surface-muted)]">
              <Link to={`/product/${product.handle}`}>View Details</Link>
            </Button>
            <Button asChild size="sm" fullWidth className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-semibold">
              <Link to={`/builder?template=${product.handle}`}>Customize</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.article>
  );
});
