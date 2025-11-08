import crypto from 'crypto';
import { FastifyRequest } from 'fastify';

// Security utilities for database operations

export class SecurityUtils {
  private static encryptionKey: Buffer;

  static initialize() {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
    }
    this.encryptionKey = Buffer.from(key);
  }

  // AES-256 encryption for sensitive fields
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  static decrypt(encryptedText: string): string {
    const buffer = Buffer.from(encryptedText, 'base64');
    
    const iv = buffer.subarray(0, 16);
    const authTag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    
    return decipher.update(encrypted) + decipher.final('utf8');
  }

  // Hash emails for index lookups
  static hashEmail(email: string): string {
    return crypto
      .createHash('sha256')
      .update(email.toLowerCase().trim())
      .digest('hex');
  }

  // Generate secure tokens
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate masked order IDs
  static generateMaskedId(prefix: string = 'ORD'): string {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }

  // Sanitize user input for database queries
  static sanitizeInput(input: string): string {
    return input
      .replace(/[^\w\s-_.@]/gi, '') // Allow only safe characters
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Validate UUID format
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Rate limiting key generator
  static getRateLimitKey(request: FastifyRequest, userId?: string): string {
    if (userId) {
      return `rate_limit:user:${userId}`;
    }
    
    const ip = request.headers['x-forwarded-for'] || request.ip;
    return `rate_limit:ip:${ip}`;
  }

  // SQL injection prevention for dynamic queries
  static escapeSqlIdentifier(identifier: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error('Invalid SQL identifier');
    }
    return `"${identifier}"`;
  }

  // JSONB sanitization
  static sanitizeJsonb(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const [key, value] of Object.entries(data)) {
      // Skip prototype pollution vectors
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeJsonb(value);
      } else if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

// Row-level security context manager
export class RLSContext {
  static async withUser<T>(
    userId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const { DatabaseClient } = await import('../config/database.config');
    const db = DatabaseClient.getInstance();

    // Set the user context for RLS
    await db.$executeRaw`SET LOCAL app.current_user_id = ${userId}`;
    
    try {
      return await operation();
    } finally {
      // Reset the context
      await db.$executeRaw`RESET app.current_user_id`;
    }
  }
}

// Audit logging helper
export class AuditLogger {
  static async log(params: {
    tableName: string;
    recordId: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    userId?: string;
    clerkSessionId?: string;
    changedData?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const { DatabaseClient } = await import('../config/database.config');
    const db = DatabaseClient.getInstance();

    await db.auditLog.create({
      data: {
        tableName: params.tableName,
        recordId: params.recordId,
        operation: params.operation,
        userId: params.userId,
        clerkSessionId: params.clerkSessionId,
        changedData: params.changedData,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }
}

// Webhook signature verification
export class WebhookVerifier {
  static verifyShopifyWebhook(
    rawBody: string,
    signature: string,
    secret: string
  ): boolean {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hash)
    );
  }

  static verifyClerkWebhook(
    payload: string,
    headers: Record<string, string>,
    secret: string
  ): boolean {
    // Clerk uses Svix for webhooks
    const webhookId = headers['webhook-id'];
    const webhookTimestamp = headers['webhook-timestamp'];
    const webhookSignature = headers['webhook-signature'];

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      return false;
    }

    const signedContent = `${webhookId}.${webhookTimestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedContent)
      .digest('base64');

    const signatures = webhookSignature.split(' ');
    
    return signatures.some(sig => {
      const [version, signature] = sig.split('=');
      if (version !== 'v1') return false;
      
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    });
  }
}

// Data masking utilities
export class DataMasker {
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local.substring(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
  }

  static maskCreditCard(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return `****-****-****-${last4}`;
  }

  static maskPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const last4 = cleaned.slice(-4);
    return `***-***-${last4}`;
  }

  static maskSensitiveData(data: any, fieldsToMask: string[]): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const masked = { ...data };

    for (const field of fieldsToMask) {
      if (field in masked) {
        if (field.includes('email')) {
          masked[field] = this.maskEmail(masked[field]);
        } else if (field.includes('phone')) {
          masked[field] = this.maskPhone(masked[field]);
        } else {
          masked[field] = '***MASKED***';
        }
      }
    }

    return masked;
  }
}
