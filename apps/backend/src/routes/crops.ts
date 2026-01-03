import { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';
import db from '../db/database.js';
import type { Crop, CreateCropInput, UpdateCropInput } from '../types/index.js';

export async function cropsRoutes(fastify: FastifyInstance) {
  // Get all crops
  fastify.get('/crops', async (request, reply) => {
    try {
      const crops = db.prepare('SELECT * FROM crops ORDER BY createdAt DESC').all();
      return { data: crops };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch crops' });
    }
  });

  // Get single crop
  fastify.get<{ Params: { id: string } }>('/crops/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const crop = db.prepare('SELECT * FROM crops WHERE id = ?').get(id);

      if (!crop) {
        return reply.code(404).send({ error: 'Crop not found' });
      }

      return { data: crop };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch crop' });
    }
  });

  // Create crop
  fastify.post<{ Body: CreateCropInput }>('/crops', async (request, reply) => {
    try {
      const {
        name,
        species,
        plantingDate,
        expectedHarvestDate,
        pruneDate,
        metadata,
        status,
        color,
        cropType,
        cropYear,
      } = request.body;

      // Validation
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return reply.code(400).send({ error: 'Name is required and must be a non-empty string' });
      }
      if (!species || typeof species !== 'string' || species.trim().length === 0) {
        return reply
          .code(400)
          .send({ error: 'Species is required and must be a non-empty string' });
      }
      if (!plantingDate || !/^(0[1-9]|1[0-2])$/.test(plantingDate)) {
        return reply.code(400).send({ error: 'Planting date must be in MM format (01-12)' });
      }
      if (!expectedHarvestDate || !/^(0[1-9]|1[0-2])$/.test(expectedHarvestDate)) {
        return reply
          .code(400)
          .send({ error: 'Expected harvest date must be in MM format (01-12)' });
      }
      if (pruneDate && !/^(0[1-9]|1[0-2])$/.test(pruneDate)) {
        return reply.code(400).send({ error: 'Prune date must be in MM format (01-12)' });
      }
      if (status && !['Planned', 'Growing', 'Harvested'].includes(status)) {
        return reply
          .code(400)
          .send({ error: 'Status must be one of: Planned, Growing, Harvested' });
      }

      const id = randomUUID();
      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO crops (id, name, species, plantingDate, expectedHarvestDate, pruneDate, metadata, status, color, cropType, cropYear, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        id,
        name,
        species,
        plantingDate,
        expectedHarvestDate,
        pruneDate || null,
        metadata || null,
        status,
        color,
        cropType,
        cropYear,
        now,
        now
      );

      const crop = db.prepare('SELECT * FROM crops WHERE id = ?').get(id);

      return reply.code(201).send({ data: crop });
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to create crop' });
    }
  });

  // Update crop
  fastify.patch<{ Params: { id: string }; Body: UpdateCropInput }>(
    '/crops/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const updates = request.body;

        // Check if crop exists
        const existing = db.prepare('SELECT * FROM crops WHERE id = ?').get(id);
        if (!existing) {
          return reply.code(404).send({ error: 'Crop not found' });
        }

        // Build dynamic update query
        const fields = Object.keys(updates);
        if (fields.length === 0) {
          return reply.code(400).send({ error: 'No fields to update' });
        }

        // Validation for provided fields
        if (
          updates.name !== undefined &&
          (typeof updates.name !== 'string' || updates.name.trim().length === 0)
        ) {
          return reply.code(400).send({ error: 'Name must be a non-empty string' });
        }
        if (
          updates.species !== undefined &&
          (typeof updates.species !== 'string' || updates.species.trim().length === 0)
        ) {
          return reply.code(400).send({ error: 'Species must be a non-empty string' });
        }
        if (updates.plantingDate !== undefined && !/^(0[1-9]|1[0-2])$/.test(updates.plantingDate)) {
          return reply.code(400).send({ error: 'Planting date must be in MM format (01-12)' });
        }
        if (
          updates.expectedHarvestDate !== undefined &&
          !/^(0[1-9]|1[0-2])$/.test(updates.expectedHarvestDate)
        ) {
          return reply
            .code(400)
            .send({ error: 'Expected harvest date must be in MM format (01-12)' });
        }
        if (
          updates.pruneDate !== undefined &&
          updates.pruneDate !== null &&
          !/^(0[1-9]|1[0-2])$/.test(updates.pruneDate)
        ) {
          return reply.code(400).send({ error: 'Prune date must be in MM format (01-12)' });
        }
        if (
          updates.status !== undefined &&
          !['Planned', 'Growing', 'Harvested'].includes(updates.status)
        ) {
          return reply
            .code(400)
            .send({ error: 'Status must be one of: Planned, Growing, Harvested' });
        }

        const setClause = fields.map((field) => `${field} = ?`).join(', ');
        const values = [...fields.map((field) => updates[field as keyof UpdateCropInput]), id];

        const stmt = db.prepare(`UPDATE crops SET ${setClause} WHERE id = ?`);
        stmt.run(...values);

        const crop = db.prepare('SELECT * FROM crops WHERE id = ?').get(id);

        return { data: crop };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to update crop' });
      }
    }
  );

  // Delete crop
  fastify.delete<{ Params: { id: string } }>('/crops/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const stmt = db.prepare('DELETE FROM crops WHERE id = ?');
      const result = stmt.run(id);

      if (result.changes === 0) {
        return reply.code(404).send({ error: 'Crop not found' });
      }

      return reply.code(204).send();
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to delete crop' });
    }
  });
}
