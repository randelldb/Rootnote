# Rootnote

A plant lifecycle logger for home gardeners. Track your crops from seed to harvest with detailed lifecycle timestamps, harvest outcomes, and growing notes—building a durable record of your garden experiments over time.

## Core Features

- **Plant Base**: Maintain a catalog of crops you grow, capturing variety, cultivar, preferences, and growing notes
- **Lifecycle Tracking**: Log key moments—seeded, sprouted, transplanted, first flower, first fruit, pruned, fertilized, harvested
- **Harvest Records**: Capture yield amounts, quality notes, storage location, and free-form context to learn from each growing cycle
- **Simple Interface**: Web-based dashboard for quick logging and historical review

## Tech Stack

- **Backend**: Fastify + TypeScript with SQLite for lightweight, file-backed persistence
- **Frontend**: React + TypeScript with Vite for fast development and composable UI components
- **Shared Types**: Monorepo structure with shared type definitions across API and web

## Getting Started

```bash
npm install
npm run dev
```

This starts the Fastify server on `http://localhost:3333` and the React dev server. Test API endpoints with curl:

```bash
curl -X POST http://localhost:3333/api/plants \
  -H "Content-Type: application/json" \
  -d '{"commonName": "Tomato", "seededDate": "2025-11-01"}'
```
