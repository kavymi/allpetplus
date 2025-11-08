/**
 * Pet Licensing Application Page
 * Multi-step form for pet license application
 */

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Apply for Pet License</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <p className="text-gray-600 mb-8">
            Complete the application below. You'll need your pet's information and proof of rabies
            vaccination.
          </p>

          {/* Multi-step form will go here */}
          <div className="space-y-6">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-xl font-semibold mb-2">🚧 Application Form Coming Soon</p>
              <p className="text-gray-600">
                Integration with dashboard and pet profiles in progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

