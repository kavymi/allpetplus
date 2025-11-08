import Link from 'next/link';

/**
 * Pet Licensing - Public Landing Page
 * Can be accessed standalone at pet-licensing.harnesshero.com
 * OR embedded in dashboard
 */
export default function LicensingLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Pet Licensing Made Simple 🐾
          </h1>

          <p className="text-2xl text-gray-600">
            Get your pet licensed in minutes. Fully digital, hassle-free process.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/apply"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Apply for License
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              Manage Existing License
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="⚡"
            title="Fast Application"
            description="Complete your application in under 5 minutes with our streamlined process"
          />
          <FeatureCard
            icon="✅"
            title="Instant Verification"
            description="Get verified instantly with our automated system"
          />
          <FeatureCard
            icon="📱"
            title="Digital License"
            description="Access your license anytime, anywhere on any device"
          />
          <FeatureCard
            icon="🔔"
            title="Renewal Reminders"
            description="Never miss a renewal with automatic email reminders"
          />
          <FeatureCard
            icon="🏥"
            title="Vet Integration"
            description="Automatically sync vaccination records with your vet"
          />
          <FeatureCard
            icon="🌍"
            title="Multi-State"
            description="Recognized in all 50 states and most municipalities"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-blue-600 text-white rounded-3xl p-12">
          <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-xl">Join thousands of pet owners who've licensed their pets with us</p>
          <Link
            href="/apply"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Start Application →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 All Pet Plus Pet Licensing. All rights reserved.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Back to All Pet Plus →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
