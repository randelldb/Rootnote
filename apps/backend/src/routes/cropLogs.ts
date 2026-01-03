import { FastifyInstance } from 'fastify';
import db from '../db/database.js';
import { randomUUID } from 'crypto';
import type { CropLog, CreateCropLogInput, UpdateCropLogInput } from '../types/index.js';

export default async function cropLogsRoutes(fastify: FastifyInstance) {
  // Get all logs for a specific crop
  fastify.get<{ Params: { cropId: string } }>('/api/crops/:cropId/logs', async (request, reply) => {
    try {
      const { cropId } = request.params;

      const logs = db
        .prepare('SELECT * FROM crop_logs WHERE cropId = ? ORDER BY logDate DESC, createdAt DESC')
        .all(cropId) as CropLog[];

      return reply.send(logs);
    } catch (error) {
      console.error('Error fetching crop logs:', error);
      return reply.status(500).send({ error: 'Failed to fetch crop logs' });
    }
  });

  // Get a specific log
  fastify.get<{ Params: { id: string } }>('/api/crop-logs/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const log = db.prepare('SELECT * FROM crop_logs WHERE id = ?').get(id) as CropLog | undefined;

      if (!log) {
        return reply.status(404).send({ error: 'Crop log not found' });
      }

      return reply.send(log);
    } catch (error) {
      console.error('Error fetching crop log:', error);
      return reply.status(500).send({ error: 'Failed to fetch crop log' });
    }
  });

  // Create a new log
  fastify.post<{ Body: CreateCropLogInput }>('/api/crop-logs', async (request, reply) => {
    try {
      const { cropId, logDate, note } = request.body;

      // Validate required fields
      if (!cropId || !logDate || !note) {
        return reply.status(400).send({
          error: 'Missing required fields: cropId, logDate, and note are required',
        });
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(logDate)) {
        return reply.status(400).send({
          error: 'Invalid date format. Expected YYYY-MM-DD',
        });
      }

      // Verify the crop exists
      const crop = db.prepare('SELECT id FROM crops WHERE id = ?').get(cropId);
      if (!crop) {
        return reply.status(404).send({ error: 'Crop not found' });
      }

      const id = randomUUID();

      db.prepare(
        `
        INSERT INTO crop_logs (id, cropId, logDate, note)
        VALUES (?, ?, ?, ?)
      `
      ).run(id, cropId, logDate, note);

      const newLog = db.prepare('SELECT * FROM crop_logs WHERE id = ?').get(id) as CropLog;

      return reply.status(201).send(newLog);
    } catch (error) {
      console.error('Error creating crop log:', error);
      return reply.status(500).send({ error: 'Failed to create crop log' });
    }
  });

  // Update a log
  fastify.patch<{
    Params: { id: string };
    Body: UpdateCropLogInput;
  }>('/api/crop-logs/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const { logDate, note } = request.body;

      // Check if log exists
      const existingLog = db.prepare('SELECT * FROM crop_logs WHERE id = ?').get(id);
      if (!existingLog) {
        return reply.status(404).send({ error: 'Crop log not found' });
      }

      // Validate date format if provided
      if (logDate) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(logDate)) {
          return reply.status(400).send({
            error: 'Invalid date format. Expected YYYY-MM-DD',
          });
        }
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];

      if (logDate !== undefined) {
        updates.push('logDate = ?');
        values.push(logDate);
      }
      if (note !== undefined) {
        updates.push('note = ?');
        values.push(note);
      }

      if (updates.length === 0) {
        return reply.status(400).send({ error: 'No fields to update' });
      }

      values.push(id);

      db.prepare(
        `
        UPDATE crop_logs 
        SET ${updates.join(', ')}
        WHERE id = ?
      `
      ).run(...values);

      const updatedLog = db.prepare('SELECT * FROM crop_logs WHERE id = ?').get(id) as CropLog;

      return reply.send(updatedLog);
    } catch (error) {
      console.error('Error updating crop log:', error);
      return reply.status(500).send({ error: 'Failed to update crop log' });
    }
  });

  // Delete a log
  fastify.delete<{ Params: { id: string } }>('/api/crop-logs/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      // Check if log exists
      const existingLog = db.prepare('SELECT * FROM crop_logs WHERE id = ?').get(id);
      if (!existingLog) {
        return reply.status(404).send({ error: 'Crop log not found' });
      }

      db.prepare('DELETE FROM crop_logs WHERE id = ?').run(id);

      return reply.status(204).send();
    } catch (error) {
      console.error('Error deleting crop log:', error);
      return reply.status(500).send({ error: 'Failed to delete crop log' });
    }
  });
}
