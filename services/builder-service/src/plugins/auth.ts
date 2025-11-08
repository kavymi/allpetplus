import fp from 'fastify-plugin';
import { clerkPlugin, getAuth } from '@clerk/fastify';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    sessionId?: string;
    userEmail?: string;
  }
}

export const authPlugin = fp(async (server) => {
  // Register Clerk plugin
  await server.register(clerkPlugin, {
    secretKey: process.env.CLERK_SECRET_KEY || '',
  });

  // Auth verification decorator
  server.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    const auth = getAuth(request);
    
    if (!auth.userId) {
      return reply.status(401).send({
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Attach user info to request
    request.userId = auth.userId;
    request.sessionId = auth.sessionId || undefined;
    
    // Optionally fetch user profile from database
    const userProfile = await server.db.userProfile.findUnique({
      where: { clerkId: auth.userId },
      select: {
        id: true,
        email: true,
        preferences: true,
      },
    });

    if (userProfile?.email) {
      request.userEmail = userProfile.email;
    }
  });

  // Optional auth decorator (doesn't fail if not authenticated)
  server.decorate('optionalAuth', async function(request: FastifyRequest, _reply: FastifyReply) {
    const auth = getAuth(request);
    
    if (auth.userId) {
      request.userId = auth.userId;
      request.sessionId = auth.sessionId || undefined;
      
      const userProfile = await server.db.userProfile.findUnique({
        where: { clerkId: auth.userId },
        select: {
          id: true,
          email: true,
        },
      });

      if (userProfile?.email) {
        request.userEmail = userProfile.email;
      }
    }
  });
});

// Type augmentation for decorators
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

