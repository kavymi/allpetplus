import { SecurityUtils, WebhookVerifier, DataMasker } from '../security';
import crypto from 'crypto';

describe('SecurityUtils', () => {
  beforeAll(() => {
    process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars!!';
    SecurityUtils.initialize();
  });

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt text correctly', () => {
      const plaintext = 'sensitive@email.com';
      const encrypted = SecurityUtils.encrypt(plaintext);
      const decrypted = SecurityUtils.decrypt(encrypted);

      expect(encrypted).not.toBe(plaintext);
      expect(decrypted).toBe(plaintext);
    });

    it('should produce different ciphertexts for same plaintext', () => {
      const plaintext = 'test@example.com';
      const encrypted1 = SecurityUtils.encrypt(plaintext);
      const encrypted2 = SecurityUtils.encrypt(plaintext);

      expect(encrypted1).not.toBe(encrypted2);
      expect(SecurityUtils.decrypt(encrypted1)).toBe(plaintext);
      expect(SecurityUtils.decrypt(encrypted2)).toBe(plaintext);
    });
  });

  describe('hashEmail', () => {
    it('should produce consistent hash for same email', () => {
      const email = 'test@example.com';
      const hash1 = SecurityUtils.hashEmail(email);
      const hash2 = SecurityUtils.hashEmail(email);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 hex length
    });

    it('should be case-insensitive', () => {
      const hash1 = SecurityUtils.hashEmail('Test@Example.COM');
      const hash2 = SecurityUtils.hashEmail('test@example.com');

      expect(hash1).toBe(hash2);
    });

    it('should trim whitespace', () => {
      const hash1 = SecurityUtils.hashEmail('  test@example.com  ');
      const hash2 = SecurityUtils.hashEmail('test@example.com');

      expect(hash1).toBe(hash2);
    });
  });

  describe('generateToken', () => {
    it('should generate random tokens', () => {
      const token1 = SecurityUtils.generateToken();
      const token2 = SecurityUtils.generateToken();

      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it('should respect custom length', () => {
      const token = SecurityUtils.generateToken(16);
      expect(token).toHaveLength(32); // 16 bytes = 32 hex chars
    });
  });

  describe('generateMaskedId', () => {
    it('should generate masked IDs with prefix', () => {
      const id1 = SecurityUtils.generateMaskedId('ORD');
      const id2 = SecurityUtils.generateMaskedId('ORD');

      expect(id1).toMatch(/^ORD-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = SecurityUtils.sanitizeInput(input);

      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    it('should allow safe characters', () => {
      const input = 'user@example.com';
      const sanitized = SecurityUtils.sanitizeInput(input);

      expect(sanitized).toBe(input);
    });

    it('should limit length', () => {
      const input = 'a'.repeat(2000);
      const sanitized = SecurityUtils.sanitizeInput(input);

      expect(sanitized.length).toBe(1000);
    });
  });

  describe('isValidUUID', () => {
    it('should validate correct UUIDs', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      expect(SecurityUtils.isValidUUID(validUUID)).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(SecurityUtils.isValidUUID('not-a-uuid')).toBe(false);
      expect(SecurityUtils.isValidUUID('550e8400-e29b-41d4')).toBe(false);
      expect(SecurityUtils.isValidUUID('')).toBe(false);
    });
  });

  describe('sanitizeJsonb', () => {
    it('should sanitize object keys', () => {
      const dangerous = {
        __proto__: { polluted: true },
        constructor: 'bad',
        normalKey: 'safe',
      };

      const sanitized = SecurityUtils.sanitizeJsonb(dangerous);

      expect(sanitized).not.toHaveProperty('__proto__');
      expect(sanitized).not.toHaveProperty('constructor');
      expect(sanitized.normalKey).toBe('safe');
    });

    it('should recursively sanitize nested objects', () => {
      const dangerous = {
        nested: {
          __proto__: 'bad',
          safe: 'value',
        },
      };

      const sanitized = SecurityUtils.sanitizeJsonb(dangerous);

      expect(sanitized.nested).not.toHaveProperty('__proto__');
      expect(sanitized.nested.safe).toBe('value');
    });
  });
});

describe('WebhookVerifier', () => {
  describe('verifyShopifyWebhook', () => {
    it('should verify valid Shopify webhook signature', () => {
      const secret = 'test-secret';
      const body = JSON.stringify({ order_id: 123 });
      
      const hash = crypto
        .createHmac('sha256', secret)
        .update(body, 'utf8')
        .digest('base64');

      const isValid = WebhookVerifier.verifyShopifyWebhook(body, hash, secret);
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const secret = 'test-secret';
      const body = JSON.stringify({ order_id: 123 });
      const invalidSignature = 'invalid-signature';

      const isValid = WebhookVerifier.verifyShopifyWebhook(body, invalidSignature, secret);
      expect(isValid).toBe(false);
    });

    it('should reject tampered body', () => {
      const secret = 'test-secret';
      const originalBody = JSON.stringify({ order_id: 123 });
      
      const hash = crypto
        .createHmac('sha256', secret)
        .update(originalBody, 'utf8')
        .digest('base64');

      const tamperedBody = JSON.stringify({ order_id: 999 });

      const isValid = WebhookVerifier.verifyShopifyWebhook(tamperedBody, hash, secret);
      expect(isValid).toBe(false);
    });
  });
});

describe('DataMasker', () => {
  describe('maskEmail', () => {
    it('should mask email addresses', () => {
      const masked = DataMasker.maskEmail('customer@example.com');
      expect(masked).toBe('cu***@example.com');
    });
  });

  describe('maskPhone', () => {
    it('should mask phone numbers', () => {
      const masked = DataMasker.maskPhone('555-123-4567');
      expect(masked).toBe('***-***-4567');
    });
  });

  describe('maskSensitiveData', () => {
    it('should mask specified fields', () => {
      const data = {
        email: 'test@example.com',
        phone: '555-1234',
        name: 'John Doe',
      };

      const masked = DataMasker.maskSensitiveData(data, ['email', 'phone']);

      expect(masked.email).toBe('te***@example.com');
      expect(masked.phone).toBe('***-***-1234');
      expect(masked.name).toBe('John Doe');
    });
  });
});
