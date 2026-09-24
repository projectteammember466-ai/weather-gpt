# WeatherGPT — Backend & Firebase Foundation (Phase 1 Documentation)
**Version:** 1.0.0-BACKEND-PHASE1  
**Date:** September 2026  
**Status:** Completed & Verified  

---

## 1. Backend Purpose

The WeatherGPT Backend is a production-oriented Node.js and Express REST API gateway integrated with Firebase Admin SDK (Firestore) and external meteorological telemetry providers.

It serves three core purposes:
1. **Security & Gateway Isolation:** Abstracts third-party weather API calls and LLM (Google Gemini) service keys away from browser client bundles.
2. **Data Normalization & Validation:** Enforces input validation, consistent JSON API response contracts, and error handling.
3. **Persistence Foundation:** Provides structured Firestore schemas and service functions for storing user preferences, saved locations, search histories, AI chat logs, and alert notifications.

---

## 2. Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                    |
|              (Vite Client — Current Weather Dashboard, Maps & Chat UI)            |
+-----------------------------------------------------------------------------------+
                                          │
                                HTTP REST Requests (/api/v1)
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                                NODE.JS + EXPRESS BACKEND                          |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ Middlewares: CORS, Request Validation, Security Logger, Error Handler       │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ API Routes: /health, /weather, /forecast, /historical, /locations, /chat... │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ Service Layer: Weather Service, Forecast Service, Historical Service,       │  |
|  │ Location Geocoding Service, AI Chat Engine, Firestore Service               │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
+-----------------------------------------------------------------------------------+
       │                                  │                                   │
       ▼                                  ▼                                   ▼
┌───────────────┐                  ┌───────────────┐                  ┌───────────────┐
│  Open-Meteo   │                  │   Firebase    │                  │  Google Gemini│
│ Live & Archive│                  │   Firestore   │                  │  AI / LLM API │
└───────────────┘                  └───────────────┘                  └───────────────┘
```

---

## 3. Folder Structure Map

```text
backend/
├── src/
│   ├── app.js                   # Express application setup & middleware mounting
│   ├── server.js                # Server entry point listening on PORT
│   ├── config/
│   │   ├── env.js               # Environment variables configuration & defaults
│   │   └── firebase.js          # Firebase Admin SDK initialization & Firestore export
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized Express error handler & AppErrors
│   │   └── validateRequest.js   # Input validation (coords, query, dates, chat payload)
│   ├── controllers/
│   │   ├── health.controller.js # GET /api/v1/health
│   │   ├── weather.controller.js# GET /api/v1/weather
│   │   ├── forecast.controller.js# GET /api/v1/forecast
│   │   ├── historical.controller.js# GET /api/v1/historical
│   │   ├── location.controller.js# GET /api/v1/locations/search
│   │   ├── chat.controller.js   # POST /api/v1/chat
│   │   └── user.controller.js   # User profile, search history & saved location CRUD
│   ├── services/
│   │   ├── weather.service.js   # Open-Meteo & Air Quality API normalization
│   │   ├── forecast.service.js  # Hourly & Daily forecast telemetry
│   │   ├── historical.service.js# ERA5 Reanalysis climate data archive service
│   │   ├── location.service.js  # Open-Meteo Geocoding search service
│   │   ├── chat.service.js      # AI intent recognition & Gemini LLM synthesis
│   │   └── firestore.service.js # Reusable Firestore CRUD operations with fallback
│   ├── utils/
│   │   ├── logger.utils.js      # Security log filter (redacts API keys/secrets)
│   │   └── response.utils.js    # Standard JSON response formatters
│   └── tests/
│       ├── health.test.js       # Health endpoint tests
│       ├── validation.test.js   # Coordinate & input validation tests
│       ├── weather.service.test.js # Weather & WMO code unit tests
│       ├── location.service.test.js# Geocoding location search tests
│       └── firestore.service.test.js # Firestore service & user API tests
├── package.json                 # Backend NPM manifest
├── .env.example                 # Environment template
└── .gitignore                  # Git ignore rules
```

---

## 4. Environment Variables Specification

The backend environment is configured in `backend/.env`.

Template (`backend/.env.example`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Firebase Server Credentials (Firebase Admin SDK)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"

# Optional Weather & AI Provider Keys
OPENWEATHER_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

# Security & CORS
CORS_ORIGIN=http://localhost:5173
```

> **Security Rule:** `backend/.env` is listed in `.gitignore` and must never be committed. Private key string line breaks (`\n`) are sanitized in `src/config/env.js`.

---

## 5. Firebase Admin SDK Setup

Firebase Admin SDK is initialized in `backend/src/config/firebase.js`.

* **Single Instance Initialization:** Verifies `admin.apps.length` to avoid repeated app initialization across module imports.
* **Credentials Validation:** Checks for required credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`).
* **Resilient Dev / Test Mode:** When credentials are absent (e.g., during unit tests or offline local development), the system gracefully operates using an in-memory fallback store without throwing startup errors or crashing.

---

## 6. Firestore Collections Data Model

### Collection 1: `users`
Document Path: `users/{userId}`
```json
{
  "userId": "usr_98765",
  "displayName": "Student Researcher",
  "email": "student@example.com",
  "language": "en",
  "contextMode": "travel",
  "temperatureUnit": "celsius",
  "theme": "dark",
  "createdAt": "2026-09-25T00:00:00.000Z",
  "updatedAt": "2026-09-25T00:00:00.000Z"
}
```

### Collection 2: `searchHistory`
Document Path: `searchHistory/{id}`
```json
{
  "userId": "usr_98765",
  "query": "Jodhpur",
  "location": "Jodhpur",
  "latitude": 26.2389,
  "longitude": 73.0243,
  "searchedAt": "2026-09-25T00:00:00.000Z"
}
```

### Collection 3: `chatHistory`
Document Path: `chatHistory/{id}`
```json
{
  "userId": "usr_98765",
  "sessionId": "session_123",
  "message": "Should I wear a jacket in Delhi?",
  "response": "In Delhi, current temperature is 28°C. Light clothing is sufficient.",
  "intent": "CLOTHING",
  "location": "Delhi",
  "createdAt": "2026-09-25T00:00:00.000Z"
}
```

### Collection 4: `savedLocations`
Document Path: `savedLocations/{id}`
```json
{
  "userId": "usr_98765",
  "name": "Mumbai",
  "city": "Mumbai",
  "country": "India",
  "latitude": 19.076,
  "longitude": 72.8777,
  "createdAt": "2026-09-25T00:00:00.000Z"
}
```

### Collection 5: `alertPreferences`
Document Path: `alertPreferences/{userId}`
```json
{
  "userId": "usr_98765",
  "preferences": {
    "rainAlerts": true,
    "severeStorms": true,
    "highUvIndex": false
  },
  "notificationFrequency": "immediate",
  "updatedAt": "2026-09-25T00:00:00.000Z"
}
```

---

## 7. API Endpoints Reference

| Method | Endpoint | Description | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/v1/health` | Backend status & metadata | None |
| `GET` | `/api/v1/weather` | Current weather + AQI | `lat`, `lon`, `locationName` (optional) |
| `GET` | `/api/v1/forecast` | 7-day daily & 24h hourly forecast | `lat`, `lon`, `days` (default 7) |
| `GET` | `/api/v1/historical` | ERA5 climate archive data | `lat`, `lon`, `startDate`, `endDate` |
| `GET` | `/api/v1/locations/search` | Search geocoded cities | `q` (search string) |
| `POST` | `/api/v1/chat` | AI weather assistant | `{ message, location, contextMode, language }` |
| `PUT` | `/api/v1/user/profile` | Create/update user settings | `{ userId, displayName, language, theme... }` |
| `GET` | `/api/v1/user/profile/:userId` | Retrieve user profile | `userId` |
| `POST` | `/api/v1/user/saved-locations` | Add saved location | `{ userId, name, latitude, longitude... }` |
| `GET` | `/api/v1/user/saved-locations/:userId` | Get saved locations | `userId` |
| `DELETE` | `/api/v1/user/saved-locations/:userId/:locationId` | Remove saved location | `userId`, `locationId` |

---

## 8. Request & Response Examples

### Example 1: `GET /api/v1/weather?lat=26.2389&lon=73.0243&locationName=Jodhpur`

**Response:**
```json
{
  "success": true,
  "data": {
    "location": {
      "id": "loc-26.24-73.02",
      "name": "Jodhpur",
      "latitude": 26.2389,
      "longitude": 73.0243
    },
    "current": {
      "temperature": 31,
      "feelsLike": 33,
      "condition": "Clear Sky",
      "icon": "Sun",
      "humidity": 45,
      "windSpeed": 12,
      "windDirection": "NW",
      "rainProbability": 5,
      "highTemp": 34,
      "lowTemp": 24,
      "pressure": 1012,
      "visibility": 10,
      "uvIndex": 6,
      "cloudCover": 15,
      "dewPoint": 18,
      "aqi": 75,
      "aqiCategory": "Moderate"
    },
    "confidence": {
      "level": "High",
      "percentage": 92,
      "source": "Open-Meteo Synoptic Telemetry"
    },
    "metadata": {
      "source": "Open-Meteo Weather API",
      "dataTimestamp": "2026-09-25T00:00:00.000Z"
    }
  }
}
```

### Example 2: `GET /api/v1/locations/search?q=Delhi`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "geo-1273294",
      "name": "Delhi",
      "city": "Delhi",
      "admin1": "Delhi",
      "country": "India",
      "countryCode": "IN",
      "latitude": 28.65195,
      "longitude": 77.23149,
      "timezone": "Asia/Kolkata",
      "population": 10927986
    }
  ]
}
```

---

## 9. Error Handling Architecture

Central error handling (`src/middleware/errorHandler.js`) enforces standard JSON error structures:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Latitude must be a valid number between -90 and 90."
  }
}
```

### Standard Error Codes:
* `VALIDATION_ERROR` (400): Malformed input parameters.
* `NOT_FOUND` (404): Route or document not found.
* `WEATHER_PROVIDER_ERROR` (502): External upstream API error.
* `INTERNAL_SERVER_ERROR` (500): Unexpected failure (stack traces hidden in production).

---

## 10. How to Run Backend

### Prerequisites
* Node.js v18.0.0 or higher

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### Step 3: Run Automated Backend Tests
```bash
npm test
```

---

## 11. How Frontend Will Connect Later (Phase 2)

During Phase 2 migration:
1. `src/services/api.js` in frontend will update its base URL from direct external API calls to:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';
   ```
2. Frontend calls to `fetchWeather`, `fetchForecast`, `searchGeocoding`, and `postChatMessage` will proxy directly through Express endpoints (`/api/v1/weather`, `/api/v1/forecast`, `/api/v1/locations/search`, `/api/v1/chat`).
3. Local storage state (saved cities, search history) will synchronize with Firestore via `/api/v1/user/*`.

---

## 12. Viva Explanation Guide

**Q1: What is the main purpose of building this Node.js/Express backend?**  
*Answer:* The backend acts as a secure API gateway. It hides API keys (like Google Gemini and OpenWeather) from public client bundles, validates request data before processing, normalizes external weather payloads into a consistent format, and connects to Firebase Firestore for user data persistence.

**Q2: How is Firebase initialized without breaking when secrets are not provided?**  
*Answer:* Firebase Admin SDK initialization in `src/config/firebase.js` checks for credentials safely. If credentials are provided, it connects to Firestore. If not, it falls back gracefully to an in-memory store so unit tests and local development can run without requiring a live cloud project.

**Q3: How does input validation work on weather coordinates and query parameters?**  
*Answer:* Middleware functions in `src/middleware/validateRequest.js` check latitude (-90 to 90), longitude (-180 to 180), non-empty search strings, valid date formats, and non-empty chat messages before reaching the controller layer. Invalid requests are immediately rejected with a `400 BAD_REQUEST` status.
