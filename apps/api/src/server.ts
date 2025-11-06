import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

import { registerHealthRoutes } from './routes/health.js';
import { registerPlantRoutes } from './routes/plants.js';

export interface BuildServerOptions {
  logger?: boolean;
}

export function buildServer(options: BuildServerOptions = {}): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? true,
  });

  app.register(cors, { origin: true });
  app.register(registerHealthRoutes, { prefix: '/api' });
  app.register(registerPlantRoutes, { prefix: '/api' });

  return app;
}
