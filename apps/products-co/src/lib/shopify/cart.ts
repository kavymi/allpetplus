import { shopifyFetch } from './client';
import type { Cart, CartLine, CartSummary, ShopifyCartEdge } from './types';
import { getMockCart } from './mock';

const CREATE_CART_MUTATION = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]!, $attributes: [AttributeInput!]) {
    cartCreate(input: { lines: $lines, attributes: $attributes }) {
      cart {
        id
        createdAt
        updatedAt
      }
      errors {
        message
        field
        code
      }
    }
  }
`;

const ADD_LINES_MUTATION = /* GraphQL */ `
  mutation AddLines($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        updatedAt
      }
      errors {
        message
        field
        code
      }
    }
  }
`;

const REMOVE_LINES_MUTATION = /* GraphQL */ `
  mutation RemoveLines($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        updatedAt
      }
      errors {
        message
        field
        code
      }
    }
  }
`;

const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      estimatedCost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount }
        totalDutyAmount { amount }
      }
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product { handle title featuredImage { url altText } }
                price {
                  amount
                  currencyCode
                }
              }
            }
            attributes { key value }
          }
        }
      }
    }
  }
`;

export const SHOPIFY_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
);

function ensureShopifyEnabled() {
  if (!SHOPIFY_ENABLED) {
    throw new Error('Shopify Storefront credentials not configured');
  }
}

export type CartLineInput = {
  merchandiseId: string;
  quantity: number;
  attributes?: Array<{ key: string; value: string }>;
};

export async function createCart(
  lines: CartLineInput[],
  attributes?: Array<{ key: string; value: string }>
): Promise<string> {
  ensureShopifyEnabled();
  const result = await shopifyFetch<{
    cartCreate: { cart: { id: string } | null; errors: Array<{ message: string }> };
  }>(CREATE_CART_MUTATION, { lines, attributes });

  if (result.cartCreate.errors.length || !result.cartCreate.cart) {
    throw new Error(result.cartCreate.errors.map((error) => error.message).join(', ') || 'Failed to create cart');
  }

  return result.cartCreate.cart.id;
}

export async function addLinesToCart(cartId: string, lines: CartLineInput[]): Promise<void> {
  ensureShopifyEnabled();
  const result = await shopifyFetch<{
    cartLinesAdd: { errors: Array<{ message: string }> };
  }>(ADD_LINES_MUTATION, { cartId, lines });

  if (result.cartLinesAdd.errors.length) {
    throw new Error(result.cartLinesAdd.errors.map((error) => error.message).join(', ') || 'Failed to add lines');
  }
}

export async function removeLinesFromCart(cartId: string, lineIds: string[]): Promise<void> {
  ensureShopifyEnabled();
  const result = await shopifyFetch<{
    cartLinesRemove: { errors: Array<{ message: string }> };
  }>(REMOVE_LINES_MUTATION, { cartId, lineIds });

  if (result.cartLinesRemove.errors.length) {
    throw new Error(result.cartLinesRemove.errors.map((error) => error.message).join(', ') || 'Failed to remove lines');
  }
}

export async function getCart(cartId: string): Promise<Cart> {
  if (!SHOPIFY_ENABLED) {
    return getMockCart(cartId);
  }

  const result = await shopifyFetch<{
    cart: {
      id: string;
      checkoutUrl?: string | null;
      estimatedCost: {
        subtotalAmount: { amount: string; currencyCode: string };
        totalAmount: { amount: string; currencyCode: string };
        totalTaxAmount?: { amount: string } | null;
        totalDutyAmount?: { amount: string } | null;
      };
      lines: { edges: ShopifyCartEdge[] };
    } | null;
  }>(CART_QUERY, { cartId });
  if (!result.cart) {
    throw new Error('Cart not found');
  }

  const lines = mapShopifyLines(result.cart.lines.edges);

  return {
    id: result.cart.id,
    lines,
    summary: mapShopifySummary(result.cart.estimatedCost),
    estimatedFulfillment: new Date().toISOString(),
    checkoutUrl: result.cart.checkoutUrl ?? undefined,
  };
}

function mapShopifyLines(edges: ShopifyCartEdge[]): CartLine[] {
  return edges.map((edge) => {
    const merchandise = edge.node.merchandise;
    const product = merchandise.product;
    const attributes = edge.node.attributes.reduce<Record<string, string>>((acc, attribute) => {
      if (attribute?.key && attribute?.value) {
        acc[attribute.key] = attribute.value;
      }
      return acc;
    }, {});

    return {
      id: edge.node.id,
      title: product.title,
      handle: product.handle,
      quantity: edge.node.quantity,
      price: {
        min: Number.parseFloat(merchandise.price.amount),
        max: Number.parseFloat(merchandise.price.amount),
        currencyCode: merchandise.price.currencyCode,
      },
      previewImage: {
        src: product.featuredImage?.url ?? '/placeholder.svg',
        alt: product.featuredImage?.altText ?? product.title,
      },
      selections: attributes,
    };
  });
}

function mapShopifySummary(cost: {
  subtotalAmount: { amount: string; currencyCode: string };
  totalAmount: { amount: string; currencyCode: string };
  totalTaxAmount?: { amount: string };
  totalDutyAmount?: { amount: string };
}): CartSummary {
  const subtotal = Number.parseFloat(cost.subtotalAmount.amount);
  const total = Number.parseFloat(cost.totalAmount.amount);
  const tax = Number.parseFloat(cost.totalTaxAmount?.amount ?? '0');
  const shipping = Number.parseFloat(cost.totalDutyAmount?.amount ?? '0');

  return {
    subtotal,
    discounts: subtotal - total,
    shipping,
    tax,
    total,
    currencyCode: cost.totalAmount.currencyCode,
  };
}



