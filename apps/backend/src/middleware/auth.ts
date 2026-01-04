import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, JwtPayload } from '../utils/auth.js';

// Extend FastifyRequest to include user property and cookies
declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
    cookies: { [key: string]: string | undefined };
  }
}

/**
 * Middleware to authenticate requests using JWT from cookies
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.cookies.auth_token;

    if (!token) {
      return reply.status(401).send({ error: 'Unauthorized - No token provided' });
    }

    const payload = verifyToken(token);
    request.user = payload;
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized - Invalid token' });
  }
}
