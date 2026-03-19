# SafeWalk Backend 🛡️

A robust Node.js/Express backend API for the SafeWalk community-powered safety navigation app.

## Features

- 🔐 JWT-based authentication with role-based access control
- 📍 Geospatial incident reporting and queries using PostGIS
- 🗺️ Route safety scoring based on incident density
- 👥 User management with emergency contacts
- 🆘 Emergency SOS and escort request system
- 📊 Activity tracking and walk history
- 🔔 Real-time location-based incident alerts

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Database Setup

#### Create PostgreSQL Database
```bash
createdb safewalk_db
```

#### Enable PostGIS Extension
```bash
psql safewalk_db
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\q
```

### 4. Run Migrations
```bash
npm run migration:run
```

### 5. Seed Data
```bash
npm run seed
```

### 6. Start Development Server
```bash
npm run dev
```

Server will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/emergency-contacts` - Add emergency contact
- `GET /api/users/:id/emergency-contacts` - Get emergency contacts

### Incidents
- `POST /api/incidents` - Report incident
- `GET /api/incidents/nearby` - Get incidents near location (lat, lng, radius)
- `GET /api/incidents/:id` - Get incident details
- `PUT /api/incidents/:id/verify` - Verify incident (increase trust)

### Routes & Safety
- `POST /api/routes/calculate-safety` - Calculate route safety score
- `GET /api/routes/safe-alternatives` - Get nearby safer routes

### Emergency
- `POST /api/emergency/sos` - Trigger SOS alert
- `GET /api/emergency/:userId` - Get SOS history

### Escorts
- `POST /api/escorts/request` - Request escort
- `GET /api/escorts/requests/:userId` - Get escort requests
- `PUT /api/escorts/requests/:requestId/respond` - Respond to escort request

### Activity
- `POST /api/activity/walk` - Record walk activity
- `GET /api/activity/:userId` - Get user activity history

## Database Schema

### Tables
- `users` - User accounts with profiles
- `emergency_contacts` - Emergency contact information
- `incidents` - Safety incidents with geospatial data
- `routes` - Saved/calculated routes
- `escort_requests` - Escort request tracking
- `sos_alerts` - Emergency SOS events
- `activity_logs` - User walk history and tracking

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

API returns standardized error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## Development Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm run migration:run    # Run pending migrations
npm run migration:revert # Revert last migration
npm run seed         # Seed database with sample data
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Project Structure

```
src/
├── config/          # Database and app configuration
├── entities/        # TypeORM entities (database models)
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── services/        # Business logic
├── middleware/      # Express middleware
├── utils/           # Utility functions
├── migrations/      # Database migrations
├── seeds/           # Database seed scripts
└── index.ts         # Application entry point
```

## Environment Variables

See `.env.example` for all available configuration options.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
