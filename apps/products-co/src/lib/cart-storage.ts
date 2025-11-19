

const CART_ID_KEY = 'harnesshero_cart_id';
const CART_EXPIRY_KEY = 'harnesshero_cart_expiry';
const CART_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getStoredCartId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const cartId = localStorage.getItem(CART_ID_KEY);
    const expiry = localStorage.getItem(CART_EXPIRY_KEY);

    if (!cartId || !expiry) return null;

    const expiryTime = Number.parseInt(expiry, 10);
    if (Date.now() > expiryTime) {
      clearStoredCartId();
      return null;
    }

    return cartId;
  } catch (error) {
    console.warn('Failed to read cart ID from localStorage', error);
    return null;
  }
}

export function setStoredCartId(cartId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const expiry = Date.now() + CART_TTL;
    localStorage.setItem(CART_ID_KEY, cartId);
    localStorage.setItem(CART_EXPIRY_KEY, String(expiry));
  } catch (error) {
    console.warn('Failed to store cart ID in localStorage', error);
  }
}

export function clearStoredCartId(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_EXPIRY_KEY);
  } catch (error) {
    console.warn('Failed to clear cart ID from localStorage', error);
  }
}

export function useCartId(): {
  cartId: string | null;
  setCartId: (id: string) => void;
  clearCartId: () => void;
} {
  const cartId = getStoredCartId();

  return {
    cartId,
    setCartId: setStoredCartId,
    clearCartId: clearStoredCartId,
  };
}
