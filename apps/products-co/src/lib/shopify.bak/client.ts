const SHOPIFY_STOREFRONT_ENDPOINT =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT;
const SHOPIFY_STOREFRONT_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!SHOPIFY_STOREFRONT_ENDPOINT || !SHOPIFY_STOREFRONT_TOKEN) {
  console.warn('Shopify Storefront env vars missing; catalog data will use mock payloads.');
}

export async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!SHOPIFY_STOREFRONT_ENDPOINT || !SHOPIFY_STOREFRONT_TOKEN) {
    throw new Error('Shopify Storefront configuration missing');
  }

  const response = await fetch(SHOPIFY_STOREFRONT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'force-cache',
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data as T;
}


