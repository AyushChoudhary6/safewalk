# Safewalk Project Guidelines

This project is a monorepo containing a React Native app (frontend) and an Express server (backend). Follow the boundaries and architectural guidelines outlined below to remain productive.

## Architecture

- **Frontend (React Native/Expo)**: Routing is managed by React Navigation. Business logic resides in `src/services/` and UI definitions are split between `src/components/`, `src/screens/`, and strict design defaults in `src/theme/`.
- **Backend (Node.js/Express)**: Classic service layer architecture (`routes` -> `controllers` -> `services` -> `entities`). Driven by TypeORM connected to **PostgreSQL**.
- **Geospatial Focus**: SafeWalk relies heavily on map operations. The backend uses **PostGIS** for native database geographic queries (density maps, route scoring).
- Detailed mapping is covered in the root `ARCHITECTURE.md`. For specific database implementations and flow, check `safewalk-backend/IMPLEMENTATION_SUMMARY.md`.

## Build and Test Commands

### Frontend (Root Directory)

- Start Expo bundler: `npm start`
- Run OS-specific targets: `npm run android`, `npm run ios`, `npm run web`
- Lint code: `npm run lint`

### Backend (`safewalk-backend/`)

- Start Dev Server: `npm run dev`
- Database Migrations: `npm run migration:run`, `npm run migration:revert` (seed via `npm run seed`)
- Build to JS: `npm run build`
- Lint & Format: `npm run lint` / `npm run format`

## Conventions

- **Strict TypeScript**: Ensure strict type definitions across the entire stack.
- **Service Dependency Layer**: Keep external integrations wrapped in individual service files (e.g., `apiService.ts`, `firebaseService.ts`). Ensure native vs. web abstractions strictly use Expo's platform extensions (`.native.ts` vs `.web.ts`).
- **RESTful Endpoints & Auth**: Express uses custom JWT middleware distinguishing roles. Refer to `safewalk-backend/API_REFERENCE.md` when modifying endpoints.
- **Design System Isolation**: Use constants defined in `src/theme/` (e.g., `colors.ts`, `typography.ts`) directly instead of hardcoded hex values.

## Common Pitfalls

- **PostGIS Crash**: The TypeORM setup **will crash** on migrations if `CREATE EXTENSION postgis;` hasn't been run on the PostgreSQL database instances.
- **Map Library Conflicts**: Native uses standard maps while Web uses Leaflet. Editing native map behaviors without platform abstraction will break the web build. Respect cross-platform override files.
- **Entity Migration De-syncing**: `database.ts` will not auto-synchronize in production configurations. Schema tweaks in `src/entities/` must be paired with TypeORM database migrations (`npm run migration:create`).

## Documentation Index

- **Frontend Architecture & Components**: Root `ARCHITECTURE.md`
- **Frontend Setup Guide**: Root `SETUP.md`
- **Backend Setup & DB Init**: `safewalk-backend/README.md` and `safewalk-backend/SETUP_GUIDE.md`
- **Backend REST Endpoints**: `safewalk-backend/API_REFERENCE.md`
- **Business Logic Summary**: `safewalk-backend/IMPLEMENTATION_SUMMARY.md`
