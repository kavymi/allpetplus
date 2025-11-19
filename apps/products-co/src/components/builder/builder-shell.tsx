import { useEffect, useMemo } from 'react';
import { useRouter } from '@tanstack/react-router';
import { BuilderStepNavigation } from './step-navigation';
import { BuilderPreviewPane } from './preview-pane';
import { BuilderOptionsPane } from './options-pane';
import { BuilderSummaryPane } from './summary-pane';
import { useBuilder } from './use-builder';
import { encodeSelection } from './config';

type BuilderShellProps = {
  configId: string;
  searchParams: Record<string, string | string[] | undefined>;
  isReorder?: boolean;
};

export function BuilderShell({ configId, searchParams, isReorder }: BuilderShellProps) {
  const initialState = useMemo(
    () => ({
      configId,
      searchParams,
    }),
    [configId, searchParams],
  );

  const router = useRouter();

  const {
    currentStep,
    steps,
    selection,
    updateSelection,
    undo,
    redo,
    canUndo,
    canRedo,
    goToStep,
    isHydrated,
  } = useBuilder(initialState);

  useEffect(() => {
    if (!isHydrated) return;
    const encoded = encodeSelection(selection);
    const currentSearch = new URLSearchParams(searchParams as Record<string, string>).toString();
    if (encoded !== currentSearch) {
      const next = encoded ? `?${encoded}` : '';
      router.navigate({ to: `/builder/${configId}${next}`, replace: true });
    }
  }, [configId, searchParams, isHydrated, router, selection]);

  if (!isHydrated) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-5xl items-center justify-center p-10 text-sm text-[var(--color-muted)]">
        {isReorder ? 'Loading your previous harness…' : 'Rehydrating your perfect harness…'}
      </div>
    );
  }

  return (
    <div>
      {isReorder ? (
        <div className="mx-auto max-w-4xl px-4 pb-6 pt-4">
          <div className="rounded-[28px] border border-[var(--color-primary)]/30 bg-[var(--color-primary-soft)] px-5 py-4 text-sm">
            <p className="font-semibold text-[var(--color-primary)]">
              Reordering your previous harness
            </p>
            <p className="mt-1 text-[var(--color-muted)]">
              We&apos;ve loaded your last configuration. Make any changes below, then add to cart.
            </p>
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-24 pt-10 lg:flex-row lg:gap-8 lg:px-8">
        <div className="flex w-full flex-col gap-6 lg:max-w-[360px]">
          <BuilderStepNavigation
            steps={steps}
            currentStep={currentStep}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onStepClick={goToStep}
          />
          <BuilderOptionsPane
            step={steps[currentStep]}
            selection={selection}
            updateSelection={updateSelection}
            currentStep={currentStep}
            totalSteps={steps.length}
            onNext={currentStep < steps.length - 1 ? () => goToStep(currentStep + 1) : undefined}
            onPrevious={currentStep > 0 ? () => goToStep(currentStep - 1) : undefined}
          />
        </div>
        <div className="flex w-full flex-col gap-6">
          <BuilderPreviewPane selection={selection} />
          <div className="hidden lg:block">
            <BuilderSummaryPane selection={selection} />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-30 border-t border-[var(--color-border-strong)] bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden">
        <BuilderSummaryPane selection={selection} compact />
      </div>
    </div>
  );
}
