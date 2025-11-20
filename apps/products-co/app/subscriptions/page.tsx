'use client';

import Link from 'next/link';

const SUBSCRIPTION_TIERS = [
  {
    id: 'essential',
    name: 'The Essential Box',
    price: 39.99,
    interval: 'month',
    description: 'Perfect for everyday needs',
    features: [
      '1 accessory item',
      '2-3 fun toys',
      '1 treat bag',
      'Surprise bonus item',
      'Free shipping',
    ],
    icon: '📦',
    badge: null,
  },
  {
    id: 'deluxe',
    name: 'The Deluxe Box',
    price: 79.99,
    interval: 'month',
    description: 'Premium products for pampered pets',
    features: [
      '1 gear item (collar, leash, or harness)',
      '3-5 premium toys',
      'Grooming product',
      'Gourmet treat assortment',
      'Exclusive limited item',
      'Free shipping',
      'Priority support',
    ],
    icon: '💎',
    badge: 'Most Popular',
  },
];

export default function SubscriptionsPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--color-foreground)]">
            Monthly Subscription Boxes
          </h1>
          <p className="text-lg text-[var(--color-foreground-secondary)] max-w-xl mx-auto">
            Curated treats, toys, and gear delivered every month. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="relative rounded-xl border border-[var(--color-border)] bg-white p-6 hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 right-6">
                    <span className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full text-xs font-semibold">
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Icon & Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{tier.icon}</div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-foreground)]">
                      {tier.name}
                    </h2>
                    <p className="text-sm text-[var(--color-foreground-secondary)]">
                      {tier.description}
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-5">
                  <span className="text-3xl font-bold text-[var(--color-primary)]">
                    ${tier.price}
                  </span>
                  <span className="text-[var(--color-foreground-secondary)]">
                    /{tier.interval}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 text-lg">✓</span>
                      <span className="text-[var(--color-foreground-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/subscriptions/${tier.id}`}
                  className={`
                    block w-full px-5 py-3 rounded-lg font-semibold text-center transition-all text-sm
                    ${
                      tier.badge
                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]'
                        : 'border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                    }
                  `}
                >
                  Subscribe Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--color-foreground)]">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Choose Your Box</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                Select Essential or Deluxe based on your pet&apos;s needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Customize Preferences</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                Tell us about your pet&apos;s size, toy preferences, and any special needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Enjoy Monthly Surprises</h3>
              <p className="text-[var(--color-foreground-secondary)]">
                Get curated products delivered every month. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[var(--color-background)]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--color-foreground)]">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">
                  Can I customize my box?
                </h3>
                <p className="text-[var(--color-foreground-secondary)]">
                  Yes! Tell us your pet&apos;s size, toy preferences, and color choices. We&apos;ll curate each box to match.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">
                  Can I skip a month?
                </h3>
                <p className="text-[var(--color-foreground-secondary)]">
                  Absolutely. Pause or skip deliveries anytime from your dashboard. No questions asked.
                </p>
              </div>

              <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                <h3 className="text-lg font-bold mb-2 text-[var(--color-foreground)]">
                  What if my pet doesn&apos;t like something?
                </h3>
                <p className="text-[var(--color-foreground-secondary)]">
                  We offer a satisfaction guarantee. Contact us within 14 days for a replacement or refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

