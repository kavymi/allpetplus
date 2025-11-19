/**
 * Client-side cart cookie utilities
 * For TanStack Router SPA
 */

const CART_ID_COOKIE = 'harnesshero_cart_id';
const CART_EXPIRY_DAYS = 7;

export function getCartId(): string | null {
  if (typeof document === 'undefined') return null;

  try {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === CART_ID_COOKIE) {
        return decodeURIComponent(value);
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to read cart ID from cookies', error);
    return null;
  }
}

// Alias for backwards compatibility
export const getCartIdFromCookies = getCartId;

export function setCartId(cartId: string): void {
  if (typeof document === 'undefined') return;

  try {
    const maxAge = CART_EXPIRY_DAYS * 24 * 60 * 60;
    const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
    document.cookie = `${CART_ID_COOKIE}=${encodeURIComponent(cartId)}; path=/; max-age=${maxAge}; SameSite=Lax; ${secure}`;
  } catch (error) {
    console.warn('Failed to set cart ID cookie', error);
  }
}

// Alias for backwards compatibility
export const setCartIdCookie = setCartId;

export function clearCartId(): void {
  if (typeof document === 'undefined') return;

  try {
    document.cookie = `${CART_ID_COOKIE}=; path=/; max-age=0`;
  } catch (error) {
    console.warn('Failed to clear cart ID cookie', error);
  }
}

// Alias for backwards compatibility
export const clearCartIdCookie = clearCartId;
