# RootNote - Smart Crop Tracker

## Project Overview

RootNote is a modern full-stack monorepo application for tracking and managing crops with AI-powered gardening advice. It provides farmers and gardeners with tools to monitor their plants, schedule tasks, and receive personalized growing recommendations powered by Google's Gemini AI. The application consists of a React frontend and a Fastify backend with SQLite database.

## Tech Stack

### Frontend

- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (via utility classes)
- **AI Integration**: Google Gemini API (@google/genai v1.34.0)
- **Icons**: lucide-react v0.562.0

### Backend

- **Framework**: Fastify 5.2.0
- **Database**: SQLite (better-sqlite3 v11.8.1)
- **Language**: TypeScript 5.8.2
- **Runtime**: Node.js with tsx for development

### Monorepo

- **Package Manager**: npm workspaces
- **Structure**: apps/frontend and apps/backend

## Project Structure

```
/RootNote
├── apps/
│   ├── frontend/            # React frontend application
│   │   ├── components/
│   │   │   ├── AICropCoach.tsx    # AI-powered crop advice interface
│   │   │   ├── CropManager.tsx    # Crop management UI
│   │   │   ├── Dashboard.tsx      # Main dashboard with metrics
│   │   │   └── Settings.tsx       # User settings and preferences
│   │   ├── services/
│   │   │   ├── apiService.ts      # Backend API client
│   │   │   └── geminiService.ts   # Gemini AI integration
│   │   ├── App.tsx                # Main application component
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── index.tsx              # Application entry point
│   │   ├── vite.config.ts         # Vite configuration with proxy
│   │   ├── tsconfig.json          # TypeScript configuration
│   │   └── package.json           # Frontend dependencies
│   └── backend/             # Fastify backend API
│       ├── src/
│       │   ├── db/
│       │   │   ├── database.ts    # SQLite database connection
│       │   │   └── migrate.ts     # Database migrations script
│       │   ├── routes/
│       │   │   └── crops.ts       # Crops API routes
│       │   ├── types/
│       │   │   └── index.ts       # Backend type definitions
│       │   └── index.ts           # Fastify server entry point
│       ├── data/                  # SQLite database files (gitignored)
│       ├── tsconfig.json          # TypeScript configuration
│       └── package.json           # Backend dependencies
├── package.json                   # Root workspace configuration
├── .gitignore                     # Git ignore rules
├── README.md                      # Project documentation
└── agent.md                       # This file - AI agent documentation
```

## Core Types

### Crop

```typescript
interface Crop {
  id: string;
  name: string; // Common name (e.g., "Roma Tomatoes")
  species: string; // Botanical name (e.g., "Solanum lycopersicum")
  plantingDate: string; // ISO date format
  expectedHarvestDate: string; // ISO date format
  metadata?: string;
  status: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color: string; // Tailwind background class
}
```

### UpcomingEvent

```typescript
interface UpcomingEvent {
  id: string;
  cropId: string;
  cropName: string;
  type: 'Seeding' | 'Harvest';
  date: string;
}
```

### UserProfile

```typescript
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}
```

### NotificationSettings

```typescript
interface NotificationSettings {
  pushEnabled: boolean;
  reminderDays: number;
}
```

## Key Features

### 1. Dashboard

- Overview of all active crops
- Key metrics display (Active Plants, Watering Actions, Health Index)
- Upcoming schedule/tasks
- Recently added crops

### 2. Crop Management

- Add new crops with common and botanical names
- Track planting and harvest dates
- View crop status (Growing, Seeding, Harvested, Planned)
- Delete crops from the system

### 3. AI Crop Coach

- Select crops to receive personalized advice
- AI-powered recommendations via Gemini API
- Advice covers soil, watering, and light requirements
- Structured JSON responses for consistent formatting

### 4. Settings

- User profile management
- Notification preferences
- App customization options

## AI Integration

The application uses Google's Gemini API (gemini-3-flash-preview model) to provide crop-specific advice.

### Service: `geminiService.ts`

```typescript
getCropAdvice(cropName: string, species: string): Promise<string[]>
```

**Input**: Crop name and botanical species
**Output**: Array of 3 advice strings covering soil, watering, and light requirements
**API Configuration**:

- Uses structured output (JSON schema validation)
- Response limited to mobile-friendly brevity
- Fallback advice if API fails

## UI/UX Design

### Design System

- **Primary Color**: `#4E7C4F` (forest green)
- **Secondary Color**: `#966F33` (brown/tan)
- **Accent Color**: `#5DA9E9` (blue)
- **Typography**: Bold, uppercase labels with tracking for emphasis
- **Border Radius**: Large rounded corners (16px-48px) for modern look
- **Shadows**: Subtle shadows with color-matched tints

### Responsive Design

- **Desktop**: Sidebar navigation with persistent header
- **Mobile**: Bottom tab navigation with floating action button
- **Breakpoint**: `lg` (1024px) for major layout changes

### Component Patterns

- Rounded cards with border and shadow
- Color-coded crop identifiers
- Animated transitions and loading states
- Modal overlays for forms

## Development

### Available Scripts (Root)

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend (http://localhost:5173)
- `npm run dev:backend` - Start only the backend (http://localhost:3000)
- `npm run build` - Build both frontend and backend
- `npm run build:frontend` - Build only the frontend
- `npm run build:backend` - Build only the backend
- `npm run migrate` - Run database migrations
- `npm install:all` - Install dependencies for all workspaces

### Frontend Scripts (apps/frontend)

- `npm run dev` - Start Vite development server on port 5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts (apps/backend)

- `npm run dev` - Start Fastify server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript
- `npm run migrate` - Run database migrations

### Environment Variables

**Frontend** (`apps/frontend/.env.local`):

- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)

**Backend** (`apps/backend/.env`):

- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: 0.0.0.0)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `LOG_LEVEL` - Fastify log level (default: info)

### Initial Data

The app includes 3 sample crops:

1. Roma Tomatoes (Solanum lycopersicum)
2. Lacinato Kale (Brassica oleracea)
3. Habanero Peppers (Capsicum chinense)

## Backend Architecture

### Database (SQLite)

**Location**: `apps/backend/data/rootnote.db`

**Schema**:

```sql
CREATE TABLE crops (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  plantingDate TEXT NOT NULL,
  expectedHarvestDate TEXT NOT NULL,
  metadata TEXT,
  status TEXT NOT NULL CHECK(status IN ('Growing', 'Seeding', 'Harvested', 'Planned')),
  color TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX idx_crops_status ON crops(status);
CREATE INDEX idx_crops_plantingDate ON crops(plantingDate);

-- Auto-update trigger
CREATE TRIGGER update_crops_timestamp
AFTER UPDATE ON crops
BEGIN
  UPDATE crops SET updatedAt = datetime('now') WHERE id = NEW.id;
END;
```

### API Endpoints

**Base URL**: `http://localhost:3000/api`

| Method | Endpoint     | Description     | Request Body      | Response                              |
| ------ | ------------ | --------------- | ----------------- | ------------------------------------- |
| GET    | `/crops`     | Get all crops   | -                 | `{ data: Crop[] }`                    |
| GET    | `/crops/:id` | Get single crop | -                 | `{ data: Crop }`                      |
| POST   | `/crops`     | Create crop     | `CreateCropInput` | `{ data: Crop }`                      |
| PATCH  | `/crops/:id` | Update crop     | `UpdateCropInput` | `{ data: Crop }`                      |
| DELETE | `/crops/:id` | Delete crop     | -                 | 204 No Content                        |
| GET    | `/health`    | Health check    | -                 | `{ status: 'ok', timestamp: string }` |

**Request Types**:

```typescript
interface CreateCropInput {
  name: string;
  species: string;
  plantingDate: string; // ISO date
  expectedHarvestDate: string; // ISO date
  metadata?: string;
  status: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color: string; // Tailwind class
}

interface UpdateCropInput {
  name?: string;
  species?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  metadata?: string;
  status?: 'Growing' | 'Seeding' | 'Harvested' | 'Planned';
  color?: string;
}
```

### Fastify Server Configuration

- **CORS**: Enabled with credentials support for frontend origin
- **Logging**: Configurable via LOG_LEVEL environment variable
- **Routes**: Modular route registration with `/api` prefix
- **Error Handling**: Automatic error logging and 500 responses

## Frontend Architecture

### API Service Layer

The frontend uses `apps/frontend/services/apiService.ts` to communicate with the backend:

```typescript
import { cropService } from './services/apiService';

// Get all crops
const crops = await cropService.getAll();

// Create a crop
const newCrop = await cropService.create({
  name: 'Tomatoes',
  species: 'Solanum lycopersicum',
  plantingDate: '2024-03-15',
  expectedHarvestDate: '2024-06-20',
  status: 'Growing',
  color: 'bg-red-500',
});

// Update a crop
await cropService.update('crop-id', { status: 'Harvested' });

// Delete a crop
await cropService.delete('crop-id');
```

### Development Proxy

Vite is configured with a proxy to forward `/api` requests to the backend during development:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### State Management

State is managed locally using React's `useState` hook:

- `activeTab`: Current view ('dashboard' | 'crops' | 'ai' | 'settings')
- `crops`: Array of Crop objects (fetched from backend)
- `isAddModalOpen`: Modal visibility state

**Note**: In production, consider adding:

- React Query for data fetching and caching
- Optimistic updates for better UX
- Error boundaries for API failures

## Navigation

The application uses tab-based navigation with 4 main sections:

1. **Dashboard** - Overview and metrics
2. **My Crops** - Crop management
3. **AI Coach** - AI-powered advice
4. **Settings** - User preferences

## Adding New Features

When extending RootNote:

### Backend Changes

1. **New Database Tables**:
   - Add schema to `apps/backend/src/db/migrate.ts`
   - Run `npm run migrate` to apply changes
   - Update types in `apps/backend/src/types/index.ts`

2. **New API Endpoints**:
   - Create route file in `apps/backend/src/routes/`
   - Register routes in `apps/backend/src/index.ts`
   - Follow RESTful naming conventions

3. **Database Queries**:
   - Use prepared statements for security
   - Add indexes for frequently queried columns
   - Use transactions for multi-step operations

### Frontend Changes

1. **New Crop Properties**:
   - Update the `Crop` interface in `apps/frontend/types.ts`
   - Update corresponding backend types
   - Add database migration for new columns

2. **New API Calls**:
   - Add methods to `apps/frontend/services/apiService.ts`
   - Follow existing error handling patterns
   - Add TypeScript types for request/response

3. **New AI Features**:
   - Extend `apps/frontend/services/geminiService.ts` with new prompt functions
   - Keep prompts concise for mobile UI
   - Use structured JSON output for consistency

4. **New Views**:
   - Add components to `apps/frontend/components/`
   - Update routing in `apps/frontend/App.tsx`
   - Follow existing component patterns

5. **Styling**:
   - Follow existing Tailwind patterns with rounded corners and color scheme
   - Maintain consistent spacing and shadows
   - Test responsive behavior on mobile and desktop

6. **State Management**:
   - Add state hooks in `App.tsx` for shared state
   - Consider React Query for server state
   - Pass props or use context for deep component trees

### Full-Stack Features

Example: Adding a "Notes" feature for crops

1. **Backend**: Add notes table and API routes
2. **Database**: Create migration for notes table
3. **Frontend**: Add notes UI component
4. **API Service**: Add notes CRUD methods
5. **Integration**: Connect UI to API service

## Known Patterns

### Modal Pattern

```typescript
{isModalOpen && (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50">
    <div className="bg-white rounded-[40px] p-8">
      {/* Modal content */}
    </div>
  </div>
)}
```

### Metric Card Pattern

```typescript
<MetricCard
  icon={<Icon size={22} />}
  value="123"
  label="Label Text"
  color="text-[#4E7C4F]"
  bg="bg-white"
/>
```

### Loading State Pattern

```typescript
{loading ? (
  <Loader2 className="animate-spin" />
) : (
  {/* Content */}
)}
```

## API Integration Notes

- Gemini API key must be set as `API_KEY` environment variable
- API calls are wrapped in try-catch with fallback data
- Responses are parsed from JSON with schema validation
- Model: `gemini-3-flash-preview`

## Color Usage Guide

- **Forest Green** (`#4E7C4F`): Primary actions, branding, active states
- **Brown/Tan** (`#966F33`): Labels, secondary text, botanical names
- **Blue** (`#5DA9E9`): Water-related metrics, accent elements
- **Slate**: Neutral backgrounds, borders, inactive states

## Accessibility Considerations

- Semantic HTML structure
- Button elements for interactive components
- Proper focus states
- Color contrast for text readability
- Keyboard navigation support

## Monorepo Best Practices

### Working with Workspaces

1. **Installing Dependencies**:

   ```bash
   # Install in specific workspace
   npm install package-name --workspace=apps/frontend
   npm install package-name --workspace=apps/backend

   # Install dev dependency
   npm install -D package-name --workspace=apps/backend
   ```

2. **Running Commands**:

   ```bash
   # Run in specific workspace
   npm run dev --workspace=apps/frontend

   # Run in all workspaces
   npm run build --workspaces
   ```

3. **Shared Code**:
   - Consider creating `packages/shared` for shared types
   - Export common utilities and constants
   - Keep frontend and backend types synchronized

### Database Migrations

1. Always create migration scripts in `apps/backend/src/db/migrate.ts`
2. Run migrations before starting the server in production
3. Use version control for schema changes
4. Test migrations on a copy of production data

### CORS and Security

- Backend validates all CORS origins via `FRONTEND_URL` env var
- Use prepared statements to prevent SQL injection
- Validate all user inputs on the backend
- Add authentication/authorization as needed

## Testing Recommendations

### Backend Testing

- Use `@fastify/testing` for route testing
- Test database operations with separate test database
- Mock external services (Gemini API)
- Test error handling and edge cases

### Frontend Testing

- Use Vitest for unit tests
- Use React Testing Library for component tests
- Test API service with MSW (Mock Service Worker)
- E2E tests with Playwright or Cypress

## Deployment

### Backend Deployment

1. Build: `npm run build:backend`
2. Set environment variables
3. Run migrations: `npm run migrate`
4. Start server: `npm start --workspace=apps/backend`
5. Ensure SQLite database directory is persistent

### Frontend Deployment

1. Build: `npm run build:frontend`
2. Serve `apps/frontend/dist` with static file server
3. Configure API_URL for production backend
4. Set up CDN for better performance

### Recommended Platforms

- **Backend**: Render, Fly.io, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Database**: Consider PostgreSQL for production scale
- **Full-Stack**: Render (monorepo support), Railway

## Future Enhancement Ideas

- ✅ Persistent data storage (COMPLETED - SQLite backend)
- Photo upload for crops (with S3 or local storage)
- Weather integration (OpenWeather API)
- Task scheduling system with reminders
- Growth timeline visualization
- Export/import functionality (CSV/JSON)
- Multi-user support with authentication (JWT)
- User roles (admin, farmer, viewer)
- Mobile app wrapper (React Native or PWA)
- Offline mode support (Service Workers)
- Real-time updates (WebSockets)
- Email/SMS notifications
- Integration with IoT sensors
- Analytics dashboard
- PostgreSQL migration for scalability
