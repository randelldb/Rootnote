import { FastifyInstance } from 'fastify';
import db from '../db/database.js';
import type { Settings, UpdateSettingsInput } from '../types/index.js';

export async function settingsRoutes(fastify: FastifyInstance) {
  // Get user settings
  fastify.get('/settings', async (request, reply) => {
    try {
      const settings = db.prepare('SELECT * FROM settings LIMIT 1').get();

      if (!settings) {
        return reply.code(404).send({ error: 'Settings not found' });
      }

      // Convert SQLite integer to boolean
      const settingsData = settings as any;
      const formattedSettings: Settings = {
        ...settingsData,
        pushEnabled: Boolean(settingsData.pushEnabled),
      };

      return { data: formattedSettings };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch settings' });
    }
  });

  // Update settings
  fastify.patch<{ Body: UpdateSettingsInput }>('/settings', async (request, reply) => {
    try {
      const updates = request.body;

      // Get current settings
      const existing = db.prepare('SELECT * FROM settings LIMIT 1').get() as Settings | undefined;
      if (!existing) {
        return reply.code(404).send({ error: 'Settings not found' });
      }

      // Build dynamic update query
      const fields = Object.keys(updates);
      if (fields.length === 0) {
        return reply.code(400).send({ error: 'No fields to update' });
      }

      // Convert boolean to integer for SQLite
      const values = fields.map((field) => {
        const value = updates[field as keyof UpdateSettingsInput];
        if (field === 'pushEnabled' && typeof value === 'boolean') {
          return value ? 1 : 0;
        }
        return value;
      });

      const setClause = fields.map((field) => `${field} = ?`).join(', ');
      values.push(Number(existing.id));

      const stmt = db.prepare(`UPDATE settings SET ${setClause} WHERE id = ?`);
      stmt.run(...values);

      const updatedSettings = db
        .prepare('SELECT * FROM settings WHERE id = ?')
        .get(existing.id) as any;

      // Convert SQLite integer to boolean
      const formattedSettings: Settings = {
        ...updatedSettings,
        pushEnabled: Boolean(updatedSettings.pushEnabled),
      };

      return { data: formattedSettings };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update settings' });
    }
  });
}
