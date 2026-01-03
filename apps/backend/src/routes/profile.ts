import { FastifyInstance } from 'fastify';
import db from '../db/database.js';
import type { UserProfile, UpdateUserProfileInput } from '../types/index.js';

export async function profileRoutes(fastify: FastifyInstance) {
  // Get user profile (currently returns the default user)
  fastify.get('/profile', async (request, reply) => {
    try {
      const profile = db.prepare('SELECT * FROM user_profile LIMIT 1').get();

      if (!profile) {
        return reply.code(404).send({ error: 'User profile not found' });
      }

      return { data: profile };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch user profile' });
    }
  });

  // Update user profile
  fastify.patch<{ Body: UpdateUserProfileInput }>('/profile', async (request, reply) => {
    try {
      const updates = request.body;

      // Get current profile
      const existing = db.prepare('SELECT * FROM user_profile LIMIT 1').get() as
        | UserProfile
        | undefined;
      if (!existing) {
        return reply.code(404).send({ error: 'User profile not found' });
      }

      // Build dynamic update query
      const fields = Object.keys(updates);
      if (fields.length === 0) {
        return reply.code(400).send({ error: 'No fields to update' });
      }

      const setClause = fields.map((field) => `${field} = ?`).join(', ');
      const values = [
        ...fields.map((field) => updates[field as keyof UpdateUserProfileInput]),
        existing.id,
      ];

      const stmt = db.prepare(`UPDATE user_profile SET ${setClause} WHERE id = ?`);
      stmt.run(...values);

      const profile = db.prepare('SELECT * FROM user_profile WHERE id = ?').get(existing.id);

      return { data: profile };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update user profile' });
    }
  });
}
