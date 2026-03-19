# SafeWalk Backend Setup Guide 🛡️

Complete setup guide for the SafeWalk Node.js/Express backend with PostgreSQL and PostGIS.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Configuration](#configuration)
5. [Running the Server](#running-the-server)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (18+ recommended)
- **npm** or **yarn**
- **PostgreSQL** (13+) - [Download](https://www.postgresql.org/download/)
- **PostGIS** extension

### Verify Installation

```bash
node --version      # Should be v18 or higher
npm --version       # Should be 8 or higher
psql --version      # Should be 13 or higher
```

---

## Installation

### Step 1: Navigate to Backend Directory
```bash
cd safewalk-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express (web framework)
- typeorm (ORM)
- pg (PostgreSQL driver)
- jsonwebtoken (authentication)
- bcrypt (password hashing)
- And more...

---

## Database Setup

### Step 1: Create PostgreSQL Database

Open PostgreSQL prompt:
```bash
psql -U postgres
```

Create database:
```sql
CREATE DATABASE safewalk_db;
CREATE USER safewalk_user WITH PASSWORD 'your_secure_password';
ALTER ROLE safewalk_user SET client_encoding TO 'utf8';
ALTER ROLE safewalk_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE safewalk_user SET default_transaction_deferrable TO on;
ALTER ROLE safewalk_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE safewalk_db TO safewalk_user;
\c safewalk_db
GRANT ALL ON SCHEMA public TO safewalk_user;
\q
```

### Step 2: Enable PostGIS Extension

```bash
psql -U safewalk_user -d safewalk_db
```

Then run:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Verify installation:
```sql
SELECT postgis_version();
SELECT version FROM pg_available_extensions WHERE name = 'postgis';
\q
```

---

## Configuration

### Step 1: Create .env File

Copy the example file:
```bash
cp .env.example .env
```

### Step 2: Update .env with Your Values

Edit `.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=safewalk_user
DB_PASSWORD=your_secure_password    # Use password from Step 1
DB_NAME=safewalk_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_URL=http://localhost:3000

# CORS Configuration (for React Native Expo)
CORS_ORIGIN=http://localhost:8082,exp://localhost:8082
```

### Important Security Notes:
- ⚠️ **Never commit `.env` to git**
- 🔐 Change `JWT_SECRET` to a strong random string in production
- 🔑 Use strong database passwords
- 📋 Keep different `.env` files for development and production

---

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

You should see:
```
✓ Database connected
🛡️  SafeWalk Backend running on http://localhost:3000
📚 Health check: http://localhost:3000/health
🔌 API Base: http://localhost:3000/api
```

### Production Build

```bash
npm run build
npm start
```

### Run Database Migrations

First time setup:
```bash
npm run migration:run
```

To revert migrations:
```bash
npm run migration:revert
```

### Seed Test Data

```bash
npm run seed
```

This creates:
- **3 test users** with different roles
- **5 test incidents** with various types
- **Test emergency contacts**
- **Sample routes** with safety scores
- **Activity logs** for walk history

**Test User Credentials:**
```
Email: john@example.com
Email: jane@example.com
Email: admin@example.com
Password: password123 (for all)
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### Register New User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phoneNumber": "+1-234-567-8900"  // optional
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 201
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "statusCode": 200
}
```

#### Get User Profile
```
GET /auth/users/:id
Authorization: Bearer <token>

Response: { user details }
```

#### Update User Profile
```
PUT /auth/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phoneNumber": "+1-234-567-8901"
}
```

#### Update Location
```
POST /auth/users/:id/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.209
}
```

### Incident Endpoints

#### Report Incident
```
POST /incidents
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "THEFT",  // THEFT | HARASSMENT | POOR_LIGHTING | ASSAULT | SUSPICIOUS_ACTIVITY
  "latitude": 28.614018,
  "longitude": 77.079051,
  "severity": 4,  // 1-5
  "description": "Phone snatching reported",
  "isAnonymous": false  // optional
}
```

#### Get Nearby Incidents
```
GET /incidents/nearby?latitude=28.6139&longitude=77.209&radius=500
```

#### Get Recent Incidents
```
GET /incidents/recent?limit=50
```

#### Get Incident Details
```
GET /incidents/:id
```

#### Verify Incident
```
PUT /incidents/:id/verify
Authorization: Bearer <token>
```

#### Dispute Incident
```
PUT /incidents/:id/dispute
Authorization: Bearer <token>
```

### Route Safety Endpoints

#### Calculate Route Safety
```
POST /routes/calculate-safety
Content-Type: application/json

{
  "startLatitude": 28.6139,
  "startLongitude": 77.209,
  "endLatitude": 28.6245,
  "endLongitude": 77.1993,
  "routePoints": [  // optional
    { "latitude": 28.6180, "longitude": 77.205 }
  ]
}

Response:
{
  "safetyScore": 8.5,     // 1-10
  "safetyRating": "green" // green | yellow | red
  "incidentCount": 2,
  "nearbyIncidents": [...]
}
```

#### Save Route
```
POST /routes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Safe Route to Park",
  "startLatitude": 28.6139,
  "startLongitude": 77.209,
  "endLatitude": 28.6245,
  "endLongitude": 77.1993,
  "polylineCoordinates": [
    { "latitude": 28.6139, "longitude": 77.209 },
    { "latitude": 28.6180, "longitude": 77.205 }
  ],
  "distanceMeters": 2000,
  "estimatedMinutes": 25
}
```

### Escort Request Endpoints

#### Request Escort
```
POST /escorts/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickupLatitude": 28.6139,
  "pickupLongitude": 77.209,
  "dropoffLatitude": 28.6245,
  "dropoffLongitude": 77.1993,
  "notes": "Please arrive in 5 minutes"  // optional
}
```

#### Get Escort Requests
```
GET /escorts/requests/:userId
Authorization: Bearer <token>
```

#### Respond to Escort Request
```
PUT /escorts/requests/:requestId/respond
Authorization: Bearer <token>
Content-Type: application/json

{
  "accept": true  // true to accept, false to decline
}
```

#### Start Escort
```
PUT /escorts/requests/:requestId/start
Authorization: Bearer <token>
```

#### Complete Escort
```
PUT /escorts/requests/:requestId/complete
Authorization: Bearer <token>
```

### Emergency Endpoints

#### Create SOS Alert
```
POST /emergency/sos
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 28.6139,
  "longitude": 77.209,
  "description": "Need immediate help"  // optional
}
```

#### Get SOS Alerts for User
```
GET /emergency/:userId
Authorization: Bearer <token>
```

#### Resolve SOS Alert
```
PUT /emergency/:alertId/resolve
Authorization: Bearer <token>
```

#### Get Active SOS Alerts (Admin/Moderator only)
```
GET /emergency/active/all
Authorization: Bearer <token>
```

### Activity Endpoints

#### Log Walk Activity
```
POST /activity/walk
Authorization: Bearer <token>
Content-Type: application/json

{
  "startLatitude": 28.6139,
  "startLongitude": 77.209,
  "endLatitude": 28.6245,
  "endLongitude": 77.1993,
  "distanceMeters": 1200,
  "durationSeconds": 1200,
  "incidentsEncountered": 0,
  "averageSafetyScore": 8.5,
  "notes": "Morning walk"  // optional
}
```

#### Get Activity History
```
GET /activity/:userId?limit=50
Authorization: Bearer <token>
```

#### Get Activity Details
```
GET /activity/detail/:activityId
Authorization: Bearer <token>
```

---

## Testing

### Test with cURL

```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Get nearby incidents (using token from login response)
curl http://localhost:3000/api/incidents/nearby \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  "?latitude=28.6139&longitude=77.209&radius=500"
```

### Test with Postman

1. Import the API collection into Postman
2. Set `{{BASE_URL}}` variable to `http://localhost:3000/api`
3. Set `{{TOKEN}}` variable after login response
4. Run requests with auth header: `Authorization: Bearer {{TOKEN}}`

---

## Troubleshooting

### Error: Cannot find module 'typeorm'

```bash
npm install
npm run build
```

### Error: Database connection failed

Check your `.env` file:
```bash
# Verify PostgreSQL is running
psql -U postgres -h localhost

# Test connection
psql -U safewalk_user -d safewalk_db -h localhost
```

### Error: Extension postgis does not exist

```bash
psql -U postgres -d safewalk_db
CREATE EXTENSION postgis;
\q
```

### Port 3000 already in use

Kill the process using port 3000:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

Or use a different port in `.env`:
```env
PORT=3001
```

### Migration errors

Reset migrations:
```bash
npm run migration:revert
npm run migration:run
```

### Seed data not showing up

```bash
npm run migration:run
npm run seed
```

---

## Database Schema

### Tables

#### Users
- id (UUID, PK)
- name, email, passwordHash
- phoneNumber, profilePhoto
- role (user/moderator/admin)
- isPremium, premiumExpiresAt
- lastLatitude, lastLongitude, lastLocationUpdate
- isActive, createdAt, updatedAt

#### Incidents
- id (UUID, PK)
- type (THEFT, HARASSMENT, POOR_LIGHTING, ASSAULT, SUSPICIOUS_ACTIVITY)
- latitude, longitude
- severity (1-5)
- description, reporterId
- verificationCount, disputeCount
- isAnonymous, isActive
- createdAt, updatedAt

#### Routes
- id (UUID, PK)
- name
- startLatitude, startLongitude
- endLatitude, endLongitude
- polylineCoordinates (JSON)
- distanceMeters, estimatedMinutes
- safetyScore, safetyRating
- incidentCount
- createdAt

#### EscortRequests
- id (UUID, PK)
- requesterId, escortId (both UUID FK)
- pickupLatitude, pickupLongitude
- dropoffLatitude, dropoffLongitude
- status (PENDING/ACCEPTED/IN_PROGRESS/COMPLETED/CANCELLED)
- additionalNotes
- acceptedAt, completedAt
- createdAt, updatedAt

#### SOSAlerts
- id (UUID, PK)
- userId (UUID FK)
- latitude, longitude
- description
- isActive
- createdAt, resolvedAt

#### ActivityLogs
- id (UUID, PK)
- userId (UUID FK)
- activityType
- startLatitude, startLongitude
- endLatitude, endLongitude
- distanceMeters, durationSeconds
- incidentsEncountered
- averageSafetyScore
- polylineCoordinates (JSON)
- notes
- createdAt

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_USERNAME | safewalk_user | Database user |
| DB_PASSWORD | - | Database password |
| DB_NAME | safewalk_db | Database name |
| JWT_SECRET | secret-key | JWT signing key |
| JWT_EXPIRES_IN | 7d | Token expiration (ms or string) |
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment (development/production/test) |
| API_URL | http://localhost:3000 | API base URL |
| CORS_ORIGIN | http://localhost:3000 | Allowed CORS origins (comma-separated) |

---

## Next Steps

1. ✅ Set up PostgreSQL and PostGIS
2. ✅ Configure `.env` file
3. ✅ Run migrations
4. ✅ Seed test data
5. ✅ Start development server
6. Connect your React Native frontend to this backend
7. Test all endpoints with the Expo app
8. Deploy to production server (AWS, Azure, Heroku, etc.)

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the database schema
3. Verify your `.env` configuration
4. Check logs in the terminal

Happy coding! 🚀
