import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogShell } from '../catalog-shell';
import type { CatalogFilters, CatalogProduct } from '@/lib/shopify/types';

const mockProducts: CatalogProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'galaxy-glide',
    title: 'Galaxy Glide Harness',
    description: 'High-visibility reflective straps',
    priceRange: { min: 68, max: 92, currencyCode: 'USD' },
    featuredImage: { src: '/test-image.jpg', alt: 'Galaxy Glide harness' },
    sizes: ['S', 'M', 'L'],
    tags: ['Reflective', 'Night walk'],
    materials: ['Eco mesh', 'Reflective nylon'],
    isNewArrival: true,
    bestFor: ['Night walks', 'Visibility'],
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'sunset-trail',
    title: 'Sunset Trail Harness',
    description: 'Soft knit interior with durable canvas',
    priceRange: { min: 62, max: 88, currencyCode: 'USD' },
    featuredImage: { src: '/test-image-2.jpg', alt: 'Sunset Trail harness' },
    sizes: ['M', 'L'],
    tags: ['Adventure ready', 'Durable'],
    materials: ['Ripstop canvas', 'Microfleece'],
    bestFor: ['Hiking', 'Everyday'],
  },
];

const mockFilters: CatalogFilters = {
  sizes: ['S', 'M', 'L'],
  tags: ['Reflective', 'Adventure ready', 'Durable'],
  materials: ['Eco mesh', 'Reflective nylon', 'Ripstop canvas'],
  bestFor: ['Night walks', 'Visibility', 'Hiking', 'Everyday'],
};

describe('CatalogShell', () => {
  it('should render all products initially', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    expect(screen.getByText('Galaxy Glide Harness')).toBeInTheDocument();
    expect(screen.getByText('Sunset Trail Harness')).toBeInTheDocument();
    expect(screen.getByText('Showing 2 harnesses')).toBeInTheDocument();
  });

  it('should filter products by size', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    // Click on size filter 'S'
    fireEvent.click(screen.getByText('S'));

    // Should only show Galaxy Glide (has size S)
    expect(screen.getByText('Galaxy Glide Harness')).toBeInTheDocument();
    expect(screen.queryByText('Sunset Trail Harness')).not.toBeInTheDocument();
    expect(screen.getByText('Showing 1 harnesses')).toBeInTheDocument();
  });

  it('should filter products by tags', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    // Click on tag filter 'Reflective'
    fireEvent.click(screen.getByText('Reflective'));

    // Should only show Galaxy Glide (has Reflective tag)
    expect(screen.getByText('Galaxy Glide Harness')).toBeInTheDocument();
    expect(screen.queryByText('Sunset Trail Harness')).not.toBeInTheDocument();
  });

  it('should show new arrival badge', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    expect(screen.getByText('New arrival')).toBeInTheDocument();
  });

  it('should display product prices', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    expect(screen.getByText('$68')).toBeInTheDocument();
    expect(screen.getByText('$62')).toBeInTheDocument();
  });

  it('should have customize and view details links', () => {
    render(<CatalogShell initialProducts={mockProducts} filters={mockFilters} />);

    const customizeLinks = screen.getAllByText('Customize');
    const viewDetailsLinks = screen.getAllByText('View details');

    expect(customizeLinks).toHaveLength(2);
    expect(viewDetailsLinks).toHaveLength(2);

    expect(customizeLinks[0]).toHaveAttribute('href', '/builder?template=galaxy-glide');
    expect(viewDetailsLinks[0]).toHaveAttribute('href', '/product/galaxy-glide');
  });
});
