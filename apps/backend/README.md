# RootNote Backend

Fastify-based REST API for the RootNote crop tracking application.

## Tech Stack

- **Framework**: Fastify 5.2.0
- **Database**: SQLite (better-sqlite3)
- **Language**: TypeScript 5.8.2
- **Dev Runtime**: tsx (TypeScript execution)

## Project Structure

```
apps/backend/
├── src/
│   ├── db/
│   │   ├── database.ts      # SQLite connection
│   │   └── migrate.ts       # Migration script
│   ├── routes/
│   │   └── crops.ts         # Crops CRUD endpoints
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── index.ts             # Server entry point
├── data/                    # SQLite database files (created on first run)
├── package.json
├── tsconfig.json
└── .env.example
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Run migrations:

   ```bash
   npm run migrate
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```env
PORT=3000                                    # Server port
HOST=0.0.0.0                                 # Server host
FRONTEND_URL=http://localhost:5173          # CORS origin
LOG_LEVEL=info                               # Logging level (trace, debug, info, warn, error)
```

## API Endpoints

### Health Check

```
GET /health
Response: { status: 'ok', timestamp: '2024-...' }
```

### Crops

**Get All Crops**

```
GET /api/crops
Response: { data: Crop[] }
```

**Get Single Crop**

```
GET /api/crops/:id
Response: { data: Crop }
Error: 404 if not found
```

**Create Crop**

```
POST /api/crops
Body: {
  name: string
  species: string
  plantingDate: string (ISO date)
  expectedHarvestDate: string (ISO date)
  metadata?: string
  status: 'Growing' | 'Seeding' | 'Harvested' | 'Planned'
  color: string
}
Response: { data: Crop }
```

**Update Crop**

```
PATCH /api/crops/:id
Body: Partial<CreateCropInput>
Response: { data: Crop }
Error: 404 if not found
```

**Delete Crop**

```
DELETE /api/crops/:id
Response: 204 No Content
Error: 404 if not found
```

## Database Schema

### Crops Table

```sql
CREATE TABLE crops (
  id TEXT PRIMARY KEY,                    -- UUID
  name TEXT NOT NULL,                     -- Common name
  species TEXT NOT NULL,                  -- Botanical name
  plantingDate TEXT NOT NULL,             -- ISO date
  expectedHarvestDate TEXT NOT NULL,      -- ISO date
  metadata TEXT,                          -- Optional JSON
  status TEXT NOT NULL,                   -- Enum: Growing, Seeding, Harvested, Planned
  color TEXT NOT NULL,                    -- Tailwind CSS class
  createdAt TEXT NOT NULL,                -- Auto-set timestamp
  updatedAt TEXT NOT NULL                 -- Auto-updated timestamp
);

CREATE INDEX idx_crops_status ON crops(status);
CREATE INDEX idx_crops_plantingDate ON crops(plantingDate);
```

### Triggers

- `update_crops_timestamp`: Automatically updates `updatedAt` on row update

## Development

### Hot Reload

The dev server uses `tsx watch` for automatic TypeScript compilation and server restart on file changes.

### Adding New Routes

1. Create route file in `src/routes/`
2. Export async function that registers routes:
   ```typescript
   export async function myRoutes(fastify: FastifyInstance) {
     fastify.get('/my-endpoint', async (request, reply) => {
       // Handler logic
     });
   }
   ```
3. Register in `src/index.ts`:
   ```typescript
   await fastify.register(myRoutes, { prefix: '/api' });
   ```

### Database Migrations

Add new tables or modify schema in `src/db/migrate.ts`:

```typescript
db.exec(`
  CREATE TABLE IF NOT EXISTS my_table (
    id TEXT PRIMARY KEY,
    ...
  );
`);
```

Run migrations:

```bash
npm run migrate
```

## Production Build

1. Compile TypeScript:

   ```bash
   npm run build
   ```

2. Run compiled code:
   ```bash
   npm start
   ```

## Error Handling

All routes include try-catch blocks with:

- Automatic error logging via Fastify logger
- 500 status code for server errors
- 404 for resource not found
- 400 for invalid input

## Security

- CORS configured to accept requests only from `FRONTEND_URL`
- SQL injection prevention via prepared statements
- Input validation should be added for production use

## Performance

- Database connection pooling (single connection for SQLite)
- Prepared statements for repeated queries
- Indexes on frequently queried columns

## Troubleshooting

**Port already in use:**

```bash
# Change PORT in .env or kill existing process
lsof -ti:3000 | xargs kill -9
```

**Database locked:**

- Ensure no other process is accessing the database
- Check for stale lock files in `data/`

**CORS errors:**

- Verify `FRONTEND_URL` matches your frontend dev server
- Check for trailing slashes

## Testing

Recommended testing setup:

- **Framework**: Vitest or Jest
- **HTTP Testing**: `@fastify/testing` or Supertest
- **Database**: Separate test database file

Example test:

```typescript
import { test } from 'node:test';
import { build } from './app';

test('GET /health returns ok', async (t) => {
  const app = await build();
  const response = await app.inject({
    method: 'GET',
    url: '/health',
  });

  t.assert.strictEqual(response.statusCode, 200);
  t.assert.strictEqual(response.json().status, 'ok');

  await app.close();
});
```

## License

MIT
