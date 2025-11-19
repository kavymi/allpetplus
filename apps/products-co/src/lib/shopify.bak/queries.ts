import { shopifyFetch } from './client';
import type {
  CatalogFilters,
  CatalogProduct,
  ProductDetail,
  ProductImage,
  ProductPreset,
  ProductSizeGuideEntry,
} from './types';
import {
  getMockCatalogFilters,
  getMockCatalogProducts,
  getMockProductDetail,
} from './mock';

const SHOPIFY_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
);

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  options: Array<{ name: string; values: string[] }>;
  metafield?: { value: string | null } | null;
  metafields?: Array<{ key: string; value: string | null } | null> | null;
}

interface CatalogQueryResponse {
  products: {
    edges: Array<{ node: ShopifyProductNode }>;
  };
}

interface ProductByHandleResponse {
  product: ShopifyProductNode | null;
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query CatalogProducts($first: Int = 24, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          title
          description
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          featuredImage { url altText }
          images(first: 6) {
            edges {
              node { url altText }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      featuredImage { url altText }
      images(first: 8) {
        edges { node { url altText } }
      }
      options { name values }
      metafields(identifiers: [
        { namespace: "custom", key: "care" },
        { namespace: "custom", key: "presets" },
        { namespace: "custom", key: "size_guide" }
      ]) {
        key
        value
      }
    }
  }
`;

function mapProductNode(node: ShopifyProductNode): CatalogProduct {
  const sizeOption = node.options.find((option) => option.name.toLowerCase() === 'size');
  const materialsFromTags = node.tags
    .filter((tag) => tag.toLowerCase().startsWith('material:'))
    .map((tag) => tag.split(':')[1]?.trim())
    .filter(Boolean) as string[];

  const materials = materialsFromTags.length
    ? materialsFromTags
    : node.options.find((option) => option.name.toLowerCase().includes('material'))?.values ?? [];

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    priceRange: {
      min: Number.parseFloat(node.priceRange.minVariantPrice.amount),
      max: Number.parseFloat(node.priceRange.maxVariantPrice.amount),
      currencyCode: node.priceRange.minVariantPrice.currencyCode,
    },
    featuredImage: {
      src: node.featuredImage?.url ?? '/placeholder.svg',
      alt: node.featuredImage?.altText ?? `${node.title} harness`,
    },
    sizes: sizeOption?.values ?? [],
    tags: node.tags,
    materials,
    isNewArrival: node.tags.includes('new'),
    bestFor: node.tags
      .filter((tag) => tag.toLowerCase().startsWith('best:'))
      .map((tag) => tag.split(':')[1]?.trim())
      .filter(Boolean) as string[],
  };
}

function deriveFilters(products: CatalogProduct[]): CatalogFilters {
  const uniqueness = <T,>(items: (T | null | undefined)[]) => [...new Set(items.filter(Boolean))] as T[];

  return {
    sizes: uniqueness(products.flatMap((product) => product.sizes)),
    tags: uniqueness(products.flatMap((product) => product.tags)),
    materials: uniqueness(products.flatMap((product) => product.materials)),
    bestFor: uniqueness(products.flatMap((product) => product.bestFor ?? [])),
  };
}

function parseImages(node: ShopifyProductNode): ProductImage[] {
  return node.images.edges.map((edge) => ({
    src: edge.node.url,
    alt: edge.node.altText ?? `${node.title} alternative view`,
  }));
}

function parsePresets(metaValue: string | null | undefined, fallback: ProductPreset[] = []): ProductPreset[] {
  if (!metaValue) return fallback;
  try {
    const parsed = JSON.parse(metaValue);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean) as ProductPreset[];
    }
  } catch (error) {
    console.warn('Failed to parse Shopify presets metafield', error);
  }
  return fallback;
}

function parseSizeGuide(metaValue: string | null | undefined, fallback: ProductSizeGuideEntry[]): ProductSizeGuideEntry[] {
  if (!metaValue) return fallback;
  try {
    const parsed = JSON.parse(metaValue);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean) as ProductSizeGuideEntry[];
    }
  } catch (error) {
    console.warn('Failed to parse Shopify size guide metafield', error);
  }
  return fallback;
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  if (!SHOPIFY_ENABLED) {
    return getMockCatalogProducts();
  }

  try {
    const data = await shopifyFetch<CatalogQueryResponse>(PRODUCTS_QUERY, {
      first: 24,
      query: 'tag:harness -status:draft',
    });
    return data.products.edges.map((edge) => mapProductNode(edge.node));
  } catch (error) {
    console.warn('Shopify catalog fetch failed, using mock data', error);
    return getMockCatalogProducts();
  }
}

export async function getCatalogFilters(): Promise<CatalogFilters> {
  if (!SHOPIFY_ENABLED) {
    return getMockCatalogFilters();
  }

  const products = await getCatalogProducts();
  if (!products.length) {
    return getMockCatalogFilters();
  }
  return deriveFilters(products);
}

export async function getProductDetail(handle: string): Promise<ProductDetail | null> {
  const fallback = await getMockProductDetail(handle);

  if (!SHOPIFY_ENABLED) {
    return fallback;
  }

  try {
    const data = await shopifyFetch<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!data.product) {
      return fallback;
    }

    const base = mapProductNode(data.product);
    const metafields = data.product.metafields ?? [];
    const careMeta = metafields.find((field) => field?.key === 'care')?.value ?? fallback?.care ?? '';
    const sizeMeta = metafields.find((field) => field?.key === 'size_guide')?.value;
    const presetsMeta = metafields.find((field) => field?.key === 'presets')?.value;

    const images = parseImages(data.product);
    if (!images.length && fallback) {
      images.push(...fallback.images);
    }

    return {
      ...base,
      images,
      badges: fallback?.badges ?? [],
      sizeGuide: parseSizeGuide(sizeMeta, fallback?.sizeGuide ?? []),
      presets: parsePresets(presetsMeta, fallback?.presets ?? []),
      care: careMeta || fallback?.care || 'Spot clean as needed; hang dry.',
    };
  } catch (error) {
    console.warn('Shopify product fetch failed, using mock product detail', error);
    return fallback;
  }
}


