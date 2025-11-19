

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface AIHintProps {
  suggestion: string;
  confidence?: 'low' | 'medium' | 'high';
  reason?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
  className?: string;
  variant?: 'inline' | 'tooltip' | 'card';
}

const confidenceColors = {
  low: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  medium: 'text-blue-600 bg-blue-50 border-blue-200',
  high: 'text-green-600 bg-green-50 border-green-200',
};

const confidenceLabels = {
  low: 'AI suggests',
  medium: 'AI recommends',
  high: 'AI strongly recommends',
};

export function AIHint({
  suggestion,
  confidence = 'medium',
  reason,
  onAccept,
  onDismiss,
  className,
  variant = 'inline',
}: AIHintProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleAccept = () => {
    onAccept?.();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  if (variant === 'tooltip') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        className={cn(
          'absolute z-50 max-w-xs rounded-2xl border bg-white p-3 shadow-lg',
          confidenceColors[confidence],
          className,
        )}
      >
        <div className="flex items-start gap-2">
          <AISparkleIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold">{confidenceLabels[confidence]}</p>
            <p className="text-xs">{suggestion}</p>
            {reason && <p className="text-[10px] opacity-75">{reason}</p>}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'card') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            'rounded-2xl border p-4 space-y-3',
            confidenceColors[confidence],
            className,
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <AISparkleIcon className="h-4 w-4" />
              <Badge variant="outline" size="sm">
                {confidenceLabels[confidence]}
              </Badge>
            </div>
            <button
              onClick={handleDismiss}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{suggestion}</p>
            {reason && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs opacity-75 hover:opacity-100 transition-opacity underline"
              >
                {isExpanded ? 'Hide' : 'Why?'}
              </button>
            )}
            <AnimatePresence>
              {isExpanded && reason && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs opacity-75"
                >
                  {reason}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {onAccept && (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 rounded-full bg-current/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-current/20"
              >
                Apply suggestion
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-medium opacity-60 hover:opacity-100 transition-opacity"
              >
                Not now
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default inline variant
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-3 py-1',
          confidenceColors[confidence],
          className,
        )}
      >
        <AISparkleIcon className="h-3 w-3" />
        <span className="text-xs font-medium">{suggestion}</span>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity ml-1"
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function AISparkleIcon({ className }: { className?: string }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M8 0l1.5 4.5L14 6l-4.5 1.5L8 12l-1.5-4.5L2 6l4.5-1.5L8 0z" />
      <path d="M12 2l0.5 1.5L14 4l-1.5 0.5L12 6l-0.5-1.5L10 4l1.5-0.5L12 2z" opacity="0.6" />
    </motion.svg>
  );
}

export function AIAssistBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
      >
        <AISparkleIcon className="h-2.5 w-2.5 text-white" />
      </motion.div>
    </div>
  );
}
