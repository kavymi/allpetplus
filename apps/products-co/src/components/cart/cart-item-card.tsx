

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import type { CartLine } from '@/lib/shopify/types';

interface CartItemCardProps {
  line: CartLine;
  onQuantityChange: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
}

export function CartItemCard({ line, onQuantityChange, onRemove }: CartItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantity, setQuantity] = useState(line.quantity);

  const handleRemove = async () => {
    setIsRemoving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    onRemove(line.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onQuantityChange(line.id, newQuantity);
  };

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.article
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20, height: 0 }}
          className="flex flex-col gap-4 rounded-[26px] border border-[color-mix(in_srgb,var(--color-border)70%,white)] bg-white/90 p-5 sm:flex-row sm:items-center"
        >
          <div className="relative h-28 w-28 flex-none overflow-hidden rounded-2xl bg-[var(--color-background)]">
            <Image
              src={line.previewImage.src}
              alt={line.previewImage.alt}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
                  {line.title}
                </h2>
                <Link
                  href={`/product/${line.handle}`}
                  className="text-xs uppercase tracking-wide text-[var(--color-primary)] underline"
                >
                  View details
                </Link>
              </div>
              <motion.p layout className="text-lg font-semibold text-[var(--color-foreground)]">
                ${(line.price.min * quantity).toFixed(2)}
              </motion.p>
            </div>

            <ul className="grid gap-1 text-xs text-[var(--color-muted)] sm:grid-cols-2">
              {Object.entries(line.selections).map(([key, value]) => (
                <li key={key} className="flex gap-2">
                  <span className="font-semibold capitalize text-[var(--color-foreground)]">
                    {key}:
                  </span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--color-muted)]">Quantity:</span>
                <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="flex h-7 w-7 items-center justify-center rounded-l-full text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-muted)] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="flex w-8 items-center justify-center text-sm font-semibold text-[var(--color-foreground)]"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-r-full text-[var(--color-foreground)] transition hover:bg-[var(--color-surface-muted)]"
                    aria-label="Increase quantity"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <Link
                  href={`/builder/${line.handle}?edit=${line.id}`}
                  className="font-semibold text-[var(--color-primary)] underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="font-semibold text-[var(--color-muted)] underline transition hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}
