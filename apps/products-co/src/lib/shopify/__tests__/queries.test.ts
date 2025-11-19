import { getCatalogProducts, getProductDetail } from '../queries';
import { shopifyFetch } from '../client';

// Mock the shopify client
jest.mock('../client', () => ({
  shopifyFetch: jest.fn(),
}));

// Mock the mock data
jest.mock('../mock', () => ({
  getMockCatalogProducts: jest.fn(() => Promise.resolve([])),
  getMockCatalogFilters: jest.fn(() => Promise.resolve({ sizes: [], tags: [], materials: [], bestFor: [] })),
  getMockProductDetail: jest.fn(() => Promise.resolve(null)),
}));

const mockShopifyFetch = shopifyFetch as jest.MockedFunction<typeof shopifyFetch>;

describe('Shopify Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.SHOPIFY_STOREFRONT_ENDPOINT;
    delete process.env.SHOPIFY_STOREFRONT_TOKEN;
  });

  describe('getCatalogProducts', () => {
    it('should use mock data when Shopify is not enabled', async () => {
      const products = await getCatalogProducts();
      expect(products).toEqual([]);
      expect(mockShopifyFetch).not.toHaveBeenCalled();
    });

    it('should fetch from Shopify when enabled', async () => {
      process.env.SHOPIFY_STOREFRONT_ENDPOINT = 'https://test.myshopify.com/api/graphql';
      process.env.SHOPIFY_STOREFRONT_TOKEN = 'test-token';

      const mockResponse = {
        products: {
          edges: [
            {
              node: {
                id: 'gid://shopify/Product/1',
                handle: 'test-harness',
                title: 'Test Harness',
                description: 'A test harness',
                tags: ['test'],
                priceRange: {
                  minVariantPrice: { amount: '58.00', currencyCode: 'USD' },
                  maxVariantPrice: { amount: '88.00', currencyCode: 'USD' },
                },
                featuredImage: { url: 'https://example.com/image.jpg', altText: 'Test harness' },
                images: { edges: [] },
                options: [{ name: 'Size', values: ['S', 'M', 'L'] }],
              },
            },
          ],
        },
      };

      mockShopifyFetch.mockResolvedValueOnce(mockResponse);

      const products = await getCatalogProducts();
      
      expect(mockShopifyFetch).toHaveBeenCalledWith(
        expect.stringContaining('query CatalogProducts'),
        { first: 24, query: 'tag:harness -status:draft' }
      );
      expect(products).toHaveLength(1);
      expect(products[0].handle).toBe('test-harness');
    });

    it('should fallback to mock data on Shopify error', async () => {
      process.env.SHOPIFY_STOREFRONT_ENDPOINT = 'https://test.myshopify.com/api/graphql';
      process.env.SHOPIFY_STOREFRONT_TOKEN = 'test-token';

      mockShopifyFetch.mockRejectedValueOnce(new Error('Network error'));

      const products = await getCatalogProducts();
      expect(products).toEqual([]);
    });
  });

  describe('getProductDetail', () => {
    it('should return null for non-existent product', async () => {
      const product = await getProductDetail('non-existent');
      expect(product).toBeNull();
    });

    it('should map Shopify product data correctly', async () => {
      process.env.SHOPIFY_STOREFRONT_ENDPOINT = 'https://test.myshopify.com/api/graphql';
      process.env.SHOPIFY_STOREFRONT_TOKEN = 'test-token';

      const mockResponse = {
        product: {
          id: 'gid://shopify/Product/1',
          handle: 'test-harness',
          title: 'Test Harness',
          description: 'A test harness',
          tags: ['test', 'new'],
          priceRange: {
            minVariantPrice: { amount: '58.00', currencyCode: 'USD' },
            maxVariantPrice: { amount: '88.00', currencyCode: 'USD' },
          },
          featuredImage: { url: 'https://example.com/image.jpg', altText: 'Test harness' },
          images: { edges: [] },
          options: [{ name: 'Size', values: ['S', 'M', 'L'] }],
          metafields: [
            { key: 'care', value: 'Machine wash cold' },
            { key: 'presets', value: '[]' },
            { key: 'size_guide', value: '[]' },
          ],
        },
      };

      mockShopifyFetch.mockResolvedValueOnce(mockResponse);

      const product = await getProductDetail('test-harness');
      
      expect(product).toBeDefined();
      expect(product?.handle).toBe('test-harness');
      expect(product?.isNewArrival).toBe(true); // Because of 'new' tag
      expect(product?.care).toBe('Machine wash cold');
    });
  });
});
