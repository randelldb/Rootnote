import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import db from '../db/database.js';
import { hashPassword, verifyPassword, generateToken } from '../utils/auth.js';
import { authenticate } from '../middleware/auth.js';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string;
      password: string;
      name: string;
    };

    // Validate input
    if (!email || !password || !name) {
      return reply.status(400).send({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return reply.status(400).send({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as
      | User
      | undefined;

    if (existingUser) {
      return reply.status(409).send({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = randomUUID();
    db.prepare(`INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)`).run(
      userId,
      email,
      hashedPassword,
      name
    );

    // Generate token
    const token = generateToken({ userId, email });

    // Set HTTP-only cookie
    reply.setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return reply.send({
      user: {
        id: userId,
        email,
        name,
      },
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Validate input
    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Set HTTP-only cookie
    reply.setCookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  });

  // Logout
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('auth_token', { path: '/' });
    return reply.send({ message: 'Logged out successfully' });
  });

  // Get current user
  fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
    const user = db
      .prepare('SELECT id, email, name, createdAt FROM users WHERE id = ?')
      .get(request.user!.userId) as Omit<User, 'password'> | undefined;

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send({ user });
  });

  // Change password
  fastify.post('/change-password', { preHandler: authenticate }, async (request, reply) => {
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string;
      newPassword: string;
    };

    // Validate input
    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return reply.status(400).send({ error: 'New password must be at least 6 characters' });
    }

    // Get user
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(request.user!.userId) as
      | User
      | undefined;

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      return reply.status(401).send({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);

    return reply.send({ message: 'Password changed successfully' });
  });
}
