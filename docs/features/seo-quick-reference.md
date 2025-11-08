# SEO Quick Reference Guide

Quick copy-paste examples for common SEO tasks in All Pet Plus.

## Table of Contents
- [Page Metadata](#page-metadata)
- [Structured Data](#structured-data)
- [Breadcrumbs](#breadcrumbs)
- [Open Graph Images](#open-graph-images)
- [Common Patterns](#common-patterns)

---

## Page Metadata

### Static Page Metadata
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | All Pet Plus',
  description: 'Compelling description under 155 characters that includes primary keywords.',
  keywords: 'dog harness, custom harness, pet accessories',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/page-url`,
  },
  openGraph: {
    title: 'Page Title | All Pet Plus',
    description: 'Description for social sharing',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/page-url`,
    siteName: 'All Pet Plus',
    images: [
      {
        url: '/og/page-specific.png',
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title | All Pet Plus',
    description: 'Description for Twitter sharing',
    images: ['/og/page-specific.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Dynamic Page Metadata (Products, Blog Posts, etc.)
```typescript
import type { Metadata } from 'next';

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchData(params.slug);
  
  if (!data) {
    return {
      title: 'Not Found | All Pet Plus',
      description: 'The page you are looking for could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harnesshero.example';
  const pageUrl = `${baseUrl}/path/${data.slug}`;
  
  const metaDescription = data.description.length > 155 
    ? `${data.description.slice(0, 152)}...` 
    : data.description;

  return {
    title: `${data.title} | All Pet Plus`,
    description: metaDescription,
    keywords: data.tags.join(', '),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${data.title} | All Pet Plus`,
      description: metaDescription,
      url: pageUrl,
      siteName: 'All Pet Plus',
      images: data.images.map((img) => ({
        url: img.url,
        width: 1200,
        height: 630,
        alt: img.alt,
      })),
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.title} | All Pet Plus`,
      description: metaDescription,
      images: data.images.length > 0 ? [data.images[0].url] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
```

---

## Structured Data

### FAQ Schema
```typescript
import { FAQStructuredData } from '@/components/seo/structured-data';

const faqs = [
  {
    question: "How do I measure my dog for a harness?",
    answer: "Measure around the widest part of your dog's chest, just behind the front legs. Use a soft measuring tape and add 2 inches for comfort."
  },
  {
    question: "What materials are used?",
    answer: "Premium nylon webbing with reinforced stitching and stainless steel or anodized aluminum hardware."
  },
];

// In your page component:
<FAQStructuredData faqs={faqs} />
```

### Product Review Schema
```typescript
import { ProductReviewStructuredData } from '@/components/seo/structured-data';

const reviews = [
  {
    author: "Jane Smith",
    rating: 5,
    reviewBody: "Perfect fit for my golden retriever! The quality is outstanding.",
    datePublished: "2025-09-15"
  },
];

// In your product page:
<ProductReviewStructuredData 
  product={{ title: product.title }}
  reviews={reviews}
  averageRating={4.8}
  reviewCount={127}
/>
```

### Breadcrumb Schema
```typescript
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';

const breadcrumbItems = [
  { name: 'Home', url: 'https://harnesshero.com' },
  { name: 'Catalog', url: 'https://harnesshero.com/catalog' },
  { name: product.title, url: `https://harnesshero.com/product/${product.handle}` },
];

<BreadcrumbStructuredData items={breadcrumbItems} />
```

### Product Schema (Already in use)
```typescript
import { ProductStructuredData } from '@/components/seo/structured-data';

<ProductStructuredData product={product} />
```

### Organization Schema (Already in layout)
```typescript
import { OrganizationStructuredData } from '@/components/seo/structured-data';

// In root layout:
<OrganizationStructuredData />
```

---

## Breadcrumbs

### Basic Breadcrumb
```typescript
import { Breadcrumb } from '@/components/ui/breadcrumb';

<Breadcrumb 
  items={[
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'Current Page', href: '/current' },
  ]}
/>
```

### Breadcrumb with Custom Styling
```typescript
<Breadcrumb 
  items={breadcrumbItems}
  className="mb-6 bg-white/80 rounded-lg p-4"
/>
```

### Combined Breadcrumb (Visible + Schema)
```typescript
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { BreadcrumbStructuredData } from '@/components/seo/structured-data';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://harnesshero.example';

const breadcrumbItems = [
  { name: 'Home', href: '/', url: baseUrl },
  { name: 'Category', href: '/category', url: `${baseUrl}/category` },
  { name: 'Page', href: '/category/page', url: `${baseUrl}/category/page` },
];

// In component:
<>
  <BreadcrumbStructuredData 
    items={breadcrumbItems.map(item => ({ 
      name: item.name, 
      url: item.url 
    }))} 
  />
  <Breadcrumb 
    items={breadcrumbItems.map(item => ({ 
      name: item.name, 
      href: item.href 
    }))} 
  />
</>
```

---

## Open Graph Images

### Image Specifications
- **Dimensions**: 1200x630 pixels (1.91:1 aspect ratio)
- **Format**: PNG (recommended) or JPG
- **Max Size**: 5MB
- **Location**: `apps/web/public/og/`

### Creating OG Images
1. Design in Figma/Photoshop at 1200x630px
2. Use brand colors (#3BAFDA, #FF7A59, #F5F6F7)
3. Include logo and clear messaging
4. Keep text in safe zone (1200x600px center)
5. Export as PNG with optimization
6. Place in `/public/og/` directory

### Using OG Images
```typescript
// In metadata:
openGraph: {
  images: [
    {
      url: '/og/your-image.png',
      width: 1200,
      height: 630,
      alt: 'Descriptive alt text for the image',
    },
  ],
}
```

---

## Common Patterns

### No-Index Page (Admin, User-Specific)
```typescript
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};
```

### Product Listing Page
```typescript
export const metadata: Metadata = {
  title: 'Shop Dog Harnesses by Size | All Pet Plus',
  description: 'Find the perfect harness for your dog. Available in XS to XXL sizes. Free shipping on orders over $50.',
  keywords: 'dog harness by size, small dog harness, large dog harness, XL dog harness',
  alternates: {
    canonical: `${baseUrl}/catalog`,
  },
};
```

### Blog Post
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  return {
    title: `${post.title} | All Pet Plus Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.featuredImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}
```

### Category Page
```typescript
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const category = await getCategory(params.category);
  
  return {
    title: `${category.name} Dog Harnesses | Shop by ${category.name} | All Pet Plus`,
    description: `Browse our ${category.name.toLowerCase()} collection. ${category.productCount} products available with free shipping.`,
    alternates: {
      canonical: `${baseUrl}/catalog/${category.slug}`,
    },
  };
}
```

---

## Testing Your SEO

### Local Testing
```bash
# Build production version
npm run build

# Run Lighthouse audit
npm run lighthouse

# Analyze bundle size
ANALYZE=true npm run build
```

### Online Tools
- **Rich Results**: https://search.google.com/test/rich-results
- **Schema Validator**: https://validator.schema.org/
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Validator**: https://cards-dev.twitter.com/validator
- **PageSpeed Insights**: https://pagespeed.web.dev/

### Checklist
- [ ] Title is 50-60 characters
- [ ] Description is 150-155 characters
- [ ] Canonical URL is set
- [ ] OG tags are complete
- [ ] Twitter Cards configured
- [ ] Structured data validates
- [ ] Images have alt text
- [ ] Breadcrumbs visible
- [ ] Mobile responsive
- [ ] Fast loading (< 3s)

---

## Tips & Best Practices

### Title Tag Optimization
- Put primary keyword first
- Include brand name at end
- Keep under 60 characters
- Make it compelling and clickable

### Meta Description
- Include primary and secondary keywords naturally
- Add a call-to-action
- Stay under 155 characters
- Make it unique for each page

### Keywords
- Focus on 2-4 primary keywords per page
- Use long-tail variations
- Include location keywords if relevant
- Don't keyword stuff

### Internal Linking
- Link to related products/content
- Use descriptive anchor text
- Create topic clusters
- Ensure all pages are within 3 clicks from homepage

### Image Optimization
- Always include descriptive alt text
- Use next/image for automatic optimization
- Compress images before uploading
- Use WebP format when possible

---

**Need Help?**  
See the full guide: `/docs/seo-implementation-guide.md`
