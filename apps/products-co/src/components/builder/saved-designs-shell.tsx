

import { trpc } from '@/lib/trpc';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { SignInButton, SignedIn, SignedOut } from '@/lib/clerk-components';
import { Link } from '@tanstack/react-router';

interface SavedDesignCardProps {
  design: {
    id: string;
    name: string | null;
    configJson: unknown; // JsonValue from Prisma
    priceBreakdown: unknown; // JsonValue from Prisma
    previewUrl: string | null;
    thumbnailUrl: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
  onDelete: (id: string) => void;
}

function SavedDesignCard({ design, onDelete }: SavedDesignCardProps): React.ReactElement {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    // Navigate to builder with this design
    router.push(`/builder/${design.id}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this design?')) return;
    setIsDeleting(true);
    try {
      await onDelete(design.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 transition hover:shadow-lg">
      {/* Preview Image */}
      <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-white">
        {design.thumbnailUrl || design.previewUrl ? (
          <img
            src={design.thumbnailUrl || design.previewUrl || ''}
            alt={design.name || 'Saved design'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              className="h-16 w-16 text-[var(--color-muted)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Design Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
          {design.name || 'Untitled Design'}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-muted)]">
          <span>Updated {formatDate(design.updatedAt)}</span>
          <span>•</span>
          <span className="capitalize">{design.status.toLowerCase()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleEdit} className="flex-1" size="sm">
          Edit Design
        </Button>
        <Button onClick={handleDelete} variant="outline" size="sm" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>

      {/* Status Badge */}
      {design.status === 'DRAFT' && (
        <div className="absolute right-4 top-4 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          Draft
        </div>
      )}
    </div>
  );
}

export function SavedDesignsShell(): React.ReactElement {
  const router = useRouter();
  const { data, isLoading, error, refetch } = trpc.designs.list.useQuery({
    status: undefined,
    limit: 50,
  });

  const deleteDesign = trpc.designs.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = async (id: string) => {
    await deleteDesign.mutateAsync({ id });
  };

  return (
    <div className="min-h-[100svh] bg-[var(--color-background)]">
      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--color-foreground)]">Saved Designs</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Your custom harness designs</p>
          </div>
          <Button asChild variant="primary">
            <Link to="/builder/default">Create New Design</Link>
          </Button>
        </div>
        <SignedOut>
          <div className="py-12">
            <EmptyState
              variant="illustrated"
              icon={
                <svg
                  className="h-8 w-8 text-[var(--color-muted)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Sign in to view your designs"
              description="Create an account or sign in to save and manage your custom harness designs."
            />
            <div className="mt-6 flex justify-center">
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {isLoading && <LoadingState message="Loading your designs..." />}

          {error && (
            <ErrorState
              message={error.message || 'Failed to load designs'}
              onRetry={() => refetch()}
            />
          )}

          {data && !isLoading && !error && (
            <>
              {data.designs.length === 0 ? (
                <div className="py-12">
                  <EmptyState
                    variant="illustrated"
                    icon={
                      <svg
                        className="h-8 w-8 text-[var(--color-muted)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    }
                    title="No saved designs yet"
                    description="Create your first custom harness design and it will appear here."
                    action={{
                      label: 'Start Building',
                      onClick: () => router.push('/builder/default'),
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-[var(--color-muted)]">
                      {data.designs.length} {data.designs.length === 1 ? 'design' : 'designs'}
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.designs.map((design) => (
                      <SavedDesignCard key={design.id} design={design} onDelete={handleDelete} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </SignedIn>
      </main>
    </div>
  );
}
