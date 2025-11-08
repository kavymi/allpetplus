import { PrismaClient } from '@prisma/client';
import { SecurityUtils } from '../src/utils/security';

const prisma = new PrismaClient();

// Initialize security utilities
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'development-key-32-chars-long!!!!';
SecurityUtils.initialize();

async function main() {
  console.log('Starting database seed...');

  // Clean existing data
  await prisma.analyticsEvent.deleteMany();
  await prisma.experimentAssignment.deleteMany();
  await prisma.savedDesign.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.builderPreset.deleteMany();
  await prisma.orderMeta.deleteMany();

  // Create test users
  const users = await Promise.all([
    prisma.userProfile.create({
      data: {
        clerkId: 'user_test_1',
        email: SecurityUtils.encrypt('test1@harnesshero.com'),
        emailHash: SecurityUtils.hashEmail('test1@harnesshero.com'),
        preferences: {
          theme: 'light',
          notifications: true,
          defaultSize: 'medium'
        },
        lastActiveAt: new Date(),
      },
    }),
    prisma.userProfile.create({
      data: {
        clerkId: 'user_test_2',
        email: SecurityUtils.encrypt('test2@harnesshero.com'),
        emailHash: SecurityUtils.hashEmail('test2@harnesshero.com'),
        preferences: {
          theme: 'dark',
          notifications: false,
          defaultSize: 'large'
        },
        lastActiveAt: new Date(Date.now() - 86400000), // 1 day ago
      },
    }),
  ]);

  console.log(`Created ${users.length} test users`);

  // Create builder presets
  const presets = await Promise.all([
    prisma.builderPreset.create({
      data: {
        name: 'Classic Adventure',
        description: 'Perfect for outdoor adventures with your pup',
        category: 'outdoor',
        configJson: {
          size: 'medium',
          colorway: 'forest-green',
          hardware: 'brass',
          stitching: 'contrast',
          addons: ['reflective-strips']
        },
        previewUrl: 'https://example.com/presets/classic-adventure.jpg',
        thumbnailUrl: 'https://example.com/presets/classic-adventure-thumb.jpg',
        sortOrder: 1,
        tags: ['outdoor', 'adventure', 'popular'],
      },
    }),
    prisma.builderPreset.create({
      data: {
        name: 'Urban Style',
        description: 'Sleek design for city walks',
        category: 'urban',
        configJson: {
          size: 'small',
          colorway: 'midnight-black',
          hardware: 'matte-black',
          stitching: 'minimal',
          addons: ['name-tag']
        },
        previewUrl: 'https://example.com/presets/urban-style.jpg',
        thumbnailUrl: 'https://example.com/presets/urban-style-thumb.jpg',
        sortOrder: 2,
        tags: ['urban', 'minimal', 'trendy'],
      },
    }),
    prisma.builderPreset.create({
      data: {
        name: 'Rainbow Pride',
        description: 'Show your colors with pride',
        category: 'special',
        configJson: {
          size: 'large',
          colorway: 'rainbow',
          hardware: 'silver',
          stitching: 'rainbow',
          addons: ['charm', 'reflective-strips']
        },
        previewUrl: 'https://example.com/presets/rainbow-pride.jpg',
        thumbnailUrl: 'https://example.com/presets/rainbow-pride-thumb.jpg',
        sortOrder: 3,
        tags: ['special', 'pride', 'colorful'],
      },
    }),
  ]);

  console.log(`Created ${presets.length} builder presets`);

  // Create saved designs for users
  const designs = await Promise.all([
    prisma.savedDesign.create({
      data: {
        userId: users[0].id,
        name: 'Max\'s Adventure Harness',
        configJson: {
          size: 'large',
          colorway: 'ocean-blue',
          hardware: 'silver',
          stitching: 'matching',
          personalization: { name: 'MAX', font: 'bold' },
          addons: ['gps-holder']
        },
        priceBreakdown: {
          base: 45.00,
          options: 15.00,
          personalization: 10.00,
          total: 70.00
        },
        previewUrl: 'https://example.com/designs/user1-design1.jpg',
        thumbnailUrl: 'https://example.com/designs/user1-design1-thumb.jpg',
        shareToken: 'SHARE_TOKEN_1',
        status: 'ACTIVE',
        viewCount: 25,
      },
    }),
    prisma.savedDesign.create({
      data: {
        userId: users[0].id,
        name: 'Training Harness Draft',
        configJson: {
          size: 'medium',
          colorway: 'red',
          hardware: 'brass',
          stitching: 'contrast',
        },
        status: 'DRAFT',
      },
    }),
    prisma.savedDesign.create({
      data: {
        userId: users[1].id,
        name: 'Luna\'s Pink Paradise',
        configJson: {
          size: 'small',
          colorway: 'pink',
          hardware: 'rose-gold',
          stitching: 'decorative',
          personalization: { name: 'LUNA', font: 'script' },
          addons: ['bow-tie', 'charm']
        },
        priceBreakdown: {
          base: 45.00,
          options: 20.00,
          personalization: 10.00,
          total: 75.00
        },
        previewUrl: 'https://example.com/designs/user2-design1.jpg',
        thumbnailUrl: 'https://example.com/designs/user2-design1-thumb.jpg',
        shareToken: 'SHARE_TOKEN_2',
        status: 'ACTIVE',
        isTemplate: true,
        viewCount: 150,
      },
    }),
  ]);

  console.log(`Created ${designs.length} saved designs`);

  // Create test orders
  const orders = await Promise.all([
    prisma.orderMeta.create({
      data: {
        shopifyOrderId: 'gid://shopify/Order/1001',
        shopifyOrderNumber: '1001',
        email: SecurityUtils.encrypt('customer1@example.com'),
        emailHash: SecurityUtils.hashEmail('customer1@example.com'),
        maskedId: SecurityUtils.generateMaskedId(),
        status: 'DELIVERED',
        statusHistory: [
          { status: 'CONFIRMED', timestamp: new Date(Date.now() - 7 * 86400000) },
          { status: 'IN_PRODUCTION', timestamp: new Date(Date.now() - 6 * 86400000) },
          { status: 'QUALITY_CHECK', timestamp: new Date(Date.now() - 4 * 86400000) },
          { status: 'SHIPPED', timestamp: new Date(Date.now() - 3 * 86400000) },
          { status: 'DELIVERED', timestamp: new Date(Date.now() - 86400000) },
        ],
        designConfig: designs[0].configJson,
        shippingInfo: {
          carrier: 'USPS',
          trackingNumber: '1234567890',
          trackingUrl: 'https://tracking.example.com/1234567890',
        },
      },
    }),
    prisma.orderMeta.create({
      data: {
        shopifyOrderId: 'gid://shopify/Order/1002',
        shopifyOrderNumber: '1002',
        email: SecurityUtils.encrypt('customer2@example.com'),
        emailHash: SecurityUtils.hashEmail('customer2@example.com'),
        maskedId: SecurityUtils.generateMaskedId(),
        status: 'IN_PRODUCTION',
        statusHistory: [
          { status: 'CONFIRMED', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'IN_PRODUCTION', timestamp: new Date(Date.now() - 86400000) },
        ],
        designConfig: designs[2].configJson,
      },
    }),
  ]);

  console.log(`Created ${orders.length} test orders`);

  // Create experiment assignments
  const experiments = await Promise.all([
    prisma.experimentAssignment.create({
      data: {
        userId: users[0].id,
        experimentKey: 'new_builder_ui',
        variant: 'control',
        metadata: { source: 'homepage' },
      },
    }),
    prisma.experimentAssignment.create({
      data: {
        userId: users[1].id,
        experimentKey: 'new_builder_ui',
        variant: 'treatment',
        metadata: { source: 'email_campaign' },
      },
    }),
    prisma.experimentAssignment.create({
      data: {
        sessionId: 'session_anonymous_1',
        experimentKey: 'checkout_flow',
        variant: 'streamlined',
      },
    }),
  ]);

  console.log(`Created ${experiments.length} experiment assignments`);

  // Create sample analytics events
  const events = await Promise.all([
    prisma.analyticsEvent.create({
      data: {
        sessionId: 'session_1',
        userId: users[0].id,
        eventName: 'builder_started',
        eventCategory: 'engagement',
        properties: { source: 'homepage_cta' },
        pageUrl: '/builder',
      },
    }),
    prisma.analyticsEvent.create({
      data: {
        sessionId: 'session_1',
        userId: users[0].id,
        eventName: 'design_saved',
        eventCategory: 'conversion',
        properties: { design_id: designs[0].id, time_spent: 300 },
        pageUrl: '/builder',
      },
    }),
    prisma.analyticsEvent.create({
      data: {
        sessionId: 'session_2',
        userId: users[1].id,
        eventName: 'preset_selected',
        eventCategory: 'engagement',
        properties: { preset_id: presets[0].id },
        pageUrl: '/builder',
      },
    }),
  ]);

  console.log(`Created ${events.length} analytics events`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
