import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
});

/**
 * Pet Licensing Dashboard (Embedded View)
 * This view is shown when embedded in main dashboard
 * Uses pet data from main platform via shared domain
 */
function DashboardComponent(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">License Management</h1>
          <p className="text-gray-600">Manage all your pet licenses in one place</p>
        </div>

        {/* Active Licenses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Active Licenses</h2>

          <div className="space-y-4">
            {/* Placeholder for license cards */}
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-lg font-semibold mb-2">No active licenses</p>
              <p className="text-gray-600 mb-4">
                Get your pets licensed to comply with local regulations
              </p>
              <Link
                to="/apply"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Apply for License
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Digital License"
            description="Access your license on any device, anytime"
            icon="📱"
          />
          <InfoCard
            title="Auto-Renewal"
            description="Never miss a renewal with automatic reminders"
            icon="🔔"
          />
          <InfoCard
            title="Compliance"
            description="Stay compliant with local and state regulations"
            icon="✅"
          />
        </div>

        {/* Integration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-gray-700">
            <strong>🔗 Micro-Frontend Integration:</strong> This is a standalone app (pet-licensing)
            embedded in the main dashboard. It can run independently or integrated. Pet data is
            shared via <code className="bg-white px-2 py-1 rounded">@pet/domain</code> library.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}): React.ReactElement {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

