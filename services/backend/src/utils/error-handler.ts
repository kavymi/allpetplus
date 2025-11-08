import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export class ValidationError extends Error implements AppError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class NotFoundError extends Error implements AppError {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ShopifyError extends Error implements AppError {
  statusCode = 502;
  code = 'SHOPIFY_ERROR';
  details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ShopifyError';
    this.details = details;
  }
}

export class RateLimitError extends Error implements AppError {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export function setupErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const requestId = request.id;
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers['user-agent'];
    const ip = request.headers['x-forwarded-for'] || request.ip;

    // Log error with context
    request.log.error({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode,
        code: error.code,
      },
      request: {
        id: requestId,
        method,
        url,
        userAgent,
        ip,
      },
    }, 'Request error occurred');

    // Handle specific error types
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        })),
        requestId,
      });
    }

    if (error instanceof ValidationError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
        details: error.details,
        requestId,
      });
    }

    if (error instanceof NotFoundError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
        requestId,
      });
    }

    if (error instanceof ShopifyError) {
      return reply.status(error.statusCode).send({
        error: 'External service error',
        code: error.code,
        requestId,
      });
    }

    if (error instanceof RateLimitError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
        requestId,
      });
    }

    // Handle Fastify built-in errors
    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code || 'FASTIFY_ERROR',
        requestId,
      });
    }

    // Generic server error
    return reply.status(500).send({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId,
    });
  });

  // Add request logging
  fastify.addHook('onRequest', async (request) => {
    request.log.info({
      method: request.method,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.headers['x-forwarded-for'] || request.ip,
    }, 'Incoming request');
  });

  // Add response logging
  fastify.addHook('onResponse', async (request, reply) => {
    request.log.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    }, 'Request completed');
  });
}
