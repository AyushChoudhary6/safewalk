# SafeWalk API Reference

Quick reference for all API endpoints.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Auth endpoints don't require a token. Other endpoints require:
```
Authorization: Bearer <jwt-token>
```

---

## Endpoints

### AUTH ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/logout` | ✅ | Logout user |
| GET | `/auth/users/:id` | ✅ | Get user profile |
| PUT | `/auth/users/:id` | ✅ | Update user profile |
| POST | `/auth/users/:id/location` | ✅ | Update user location |

### INCIDENT ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/incidents` | ✅ | Report incident |
| GET | `/incidents/nearby` | ⚪ | Get incidents in radius |
| GET | `/incidents/recent` | ⚪ | Get recent incidents |
| GET | `/incidents/:id` | ⚪ | Get incident details |
| PUT | `/incidents/:id/verify` | ✅ | Verify incident |
| PUT | `/incidents/:id/dispute` | ✅ | Dispute incident |

### ROUTE ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/routes/calculate-safety` | ⚪ | Calculate route safety |
| POST | `/routes` | ✅ | Save route |
| GET | `/routes/:id` | ⚪ | Get route details |

### ESCORT ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/escorts/request` | ✅ | Request escort |
| GET | `/escorts/requests/:userId` | ✅ | Get user's requests |
| PUT | `/escorts/requests/:requestId/respond` | ✅ | Accept/decline request |
| PUT | `/escorts/requests/:requestId/start` | ✅ | Start escort |
| PUT | `/escorts/requests/:requestId/complete` | ✅ | Complete escort |

### EMERGENCY ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/emergency/sos` | ✅ | Create SOS alert |
| GET | `/emergency/:userId` | ✅ | Get user's SOS alerts |
| PUT | `/emergency/:alertId/resolve` | ✅ | Resolve SOS alert |
| GET | `/emergency/active/all` | ✅ | Get all active SOS (admin only) |

### ACTIVITY ENDPOINTS

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/activity/walk` | ✅ | Log walk activity |
| GET | `/activity/:userId` | ✅ | Get activity history |
| GET | `/activity/detail/:activityId` | ✅ | Get activity details |

---

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

---

## Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_INPUT | 400 | Missing or invalid required fields |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| NO_TOKEN | 401 | No authorization token provided |
| INVALID_TOKEN | 401 | Token is invalid or expired |
| FORBIDDEN | 403 | User doesn't have permission |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_RESOURCE | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

---

## Incident Types
```
THEFT
HARASSMENT
POOR_LIGHTING
ASSAULT
SUSPICIOUS_ACTIVITY
```

## Severity Levels
```
1 = Low
2 = Moderate
3 = Medium
4 = High
5 = Critical
```

## Safety Ratings
```
green  (score 7-10)  = Safe
yellow (score 4-7)   = Moderate risk
red    (score 1-4)   = High risk
```

## Escort Request Status
```
PENDING      = Waiting for acceptance
ACCEPTED     = Escort accepted the request
IN_PROGRESS  = Escort is on the way/with user
COMPLETED    = Escort completed the journey
CANCELLED    = Request was cancelled
```

---

## User Roles
```
user      = Regular user
moderator = Can view all SOS alerts
admin     = Full access
```

---

## Example Requests

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123",
    "phoneNumber": "+1-234-567-8900"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }'
```

### Report Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "THEFT",
    "latitude": 28.614018,
    "longitude": 77.079051,
    "severity": 4,
    "description": "Phone snatching reported",
    "isAnonymous": false\n  }'
```

### Get Nearby Incidents
```bash
curl "http://localhost:3000/api/incidents/nearby?latitude=28.6139&longitude=77.209&radius=500"
```

### Calculate Route Safety
```bash
curl -X POST http://localhost:3000/api/routes/calculate-safety \
  -H "Content-Type: application/json" \
  -d '{
    "startLatitude": 28.6139,
    "startLongitude": 77.209,
    "endLatitude": 28.6245,
    "endLongitude": 77.1993
  }'
```

### Request Escort
```bash
curl -X POST http://localhost:3000/api/escorts/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "pickupLatitude": 28.6139,
    "pickupLongitude": 77.209,
    "dropoffLatitude": 28.6245,
    "dropoffLongitude": 77.1993,
    "notes": "Please help me get home safely"
  }'
```

### Create SOS Alert
```bash
curl -X POST http://localhost:3000/api/emergency/sos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "latitude": 28.6139,
    "longitude": 77.209,
    "description": "Need immediate help"
  }'
```

### Log Walk Activity
```bash
curl -X POST http://localhost:3000/api/activity/walk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "startLatitude": 28.6139,
    "startLongitude": 77.209,
    "endLatitude": 28.6245,
    "endLongitude": 77.1993,
    "distanceMeters": 1200,
    "durationSeconds": 1200,
    "incidentsEncountered": 0,
    "averageSafetyScore": 8.5,
    "notes": "Morning walk to coffee"
  }'
```

---

## Query Parameters

### Get Nearby Incidents
- `latitude` (required): User latitude
- `longitude` (required): User longitude
- `radius` (optional): Search radius in meters (default: 500)

### Get Recent Incidents
- `limit` (optional): Number of incidents to return (default: 50)

### Get Activity History
- `limit` (optional): Number of activities to return (default: 50)

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (successful GET/PUT) |
| 201 | Created (successful POST) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

---

## Token Format

JWT tokens have three parts separated by dots:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1dWlkIiwifgImFpbCIiOiJlbWFpbEBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk5NTcwMDAwLCJleHAiOjE3MDA0ODgwMDB9.signature
```

Token payload contains:
- `userId`: User UUID
- `email`: User email
- `role`: User role (user/moderator/admin)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

---

## Rate Limiting

Currently no rate limiting implemented. Add in production!

---

## Pagination

Currently using `limit` parameter. Implement full pagination (skip/take) in production.

---

## Filtering

Limited filtering support. Consider implementing:
- Incident type filter
- Date range filter
- Safety score filter

---

## For Frontend Developers

1. Store JWT token from login/register in persistent storage (AsyncStorage)
2. Include token in every request header: `Authorization: Bearer {token}`
3. If token expires (401), refresh or ask user to login again
4. Handle all error codes appropriately in UI
5. Use HTTP status codes to show appropriate messages to users

---

Generated: March 2026
Last Updated: Version 1.0.0
