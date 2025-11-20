import Link from 'next/link';

export default function ProductsCoLanding(): React.ReactElement {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[var(--color-border)] mb-6">
              <span className="text-3xl">🐾</span>
              <span className="text-sm font-semibold text-[var(--color-primary)]">All Pet Plus Products</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[var(--color-foreground)]">
              Premium Pet Gear,
              <br />
              <span className="text-[var(--color-primary)]">Perfectly Personalized</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--color-foreground-secondary)] mb-8 max-w-2xl mx-auto">
              Custom harnesses, collars, and leashes designed exactly how you want them. Quality craftsmanship, delivered fast.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/builder"
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-all font-semibold shadow-md"
              >
                Design Custom Gear
              </Link>
              <Link
                href="/catalog"
                className="px-6 py-3 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all font-semibold"
              >
                Shop Ready-Made
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-[var(--color-foreground)]">
            What Would You Like to Create?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              { name: 'Harnesses', icon: '🦴', href: '/builder?productType=harness' },
              { name: 'Collars', icon: '⭕', href: '/builder?productType=collar' },
              { name: 'Leashes', icon: '🔗', href: '/builder?productType=leash' },
              { name: 'Bandanas', icon: '🎀', href: '/builder?productType=bandana' },
              { name: 'Clothing', icon: '👕', href: '/builder?productType=clothing' },
              { name: 'More', icon: '✨', href: '/catalog' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group p-6 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] hover:shadow-md transition-all text-center"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-sm font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Box */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[var(--color-foreground)]">
              Monthly Subscription Boxes
            </h2>
            <p className="text-lg text-[var(--color-foreground-secondary)] mb-6">
              Curated treats, toys, and gear delivered every month
            </p>
            <Link
              href="/subscriptions"
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-all font-semibold"
            >
              View Options
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">Fully Customizable</h3>
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                Design every detail exactly how you want it
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">Premium Quality</h3>
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                Made-to-order with quality materials
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">Fast Delivery</h3>
              <p className="text-sm text-[var(--color-foreground-secondary)]">
                Ships in 3-5 days, free over $50
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Create Something Special?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Design your perfect pet gear today
          </p>
          <Link
            href="/builder"
            className="inline-block px-8 py-3 bg-white text-[var(--color-primary)] rounded-lg hover:bg-gray-50 transition-all font-bold shadow-lg"
          >
            Start Designing
          </Link>
        </div>
      </section>
    </div>
  );
}
