export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function ProductsCoLanding(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-primary)]/5">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <div className="text-6xl mb-6">🐾</div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[var(--color-foreground)]">
              Unique as Your Pet
            </h1>
            
            <p className="text-xl md:text-2xl text-[var(--color-foreground-secondary)] mb-12 max-w-3xl mx-auto">
              Design custom harnesses, collars, and leashes with our 3D builder. Or browse our collection of premium ready-made pet gear. Every piece is crafted with quality that lasts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/builder"
                className="px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold shadow-lg"
              >
                Start Custom Builder
              </Link>
              <Link
                href="/catalog"
                className="px-8 py-4 border-2 border-[var(--color-border)] rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors text-lg font-semibold text-[var(--color-foreground)]"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-foreground)]">
            What Would You Like to Create?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Custom Harnesses', desc: 'Perfect fit, every time', icon: '🦴', href: '/builder?productType=harness' },
              { name: 'Custom Collars', desc: 'Style meets safety', icon: '⭕', href: '/builder?productType=collar' },
              { name: 'Custom Leashes', desc: 'Strong and beautiful', icon: '🔗', href: '/builder?productType=leash' },
              { name: 'Bandanas', desc: 'Add personality', icon: '🎀', href: '/builder?productType=bandana' },
              { name: 'Dog Clothing', desc: 'Comfort and style', icon: '👕', href: '/builder?productType=clothing' },
              { name: 'Accessories', desc: 'Complete the look', icon: '✨', href: '/catalog' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-[var(--color-foreground-secondary)]">{category.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Box */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-5xl mb-6">📦</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-foreground)]">
              Monthly Subscription Boxes
            </h2>
            <p className="text-xl text-[var(--color-foreground-secondary)] mb-8">
              Curated treats, toys, and gear delivered to your door every month
            </p>
            <Link
              href="/subscriptions"
              className="inline-block px-8 py-4 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-semibold"
            >
              View Subscription Options
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--color-foreground)]">
            Why All Pet Plus Products?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Fully Customizable</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                3D builder lets you design every detail. See your creation in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Premium Quality</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                Made-to-order with premium materials. Built to last.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Fast Delivery</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                Custom orders ship in 3-5 days. Free shipping over $50.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-primary)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Something Special?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy pets and their humans
          </p>
          <Link
            href="/builder"
            className="inline-block px-10 py-4 bg-white text-[var(--color-primary)] rounded-xl hover:opacity-90 transition-opacity text-lg font-bold shadow-xl"
          >
            Start Building Now
          </Link>
        </div>
      </section>
    </div>
  );
}
