# WeatherGPT — Complete Backend & Firebase Master Specification
**Version:** 1.0.0-COMPLETE  
**Date:** September 2026  
**Status:** Completed & Verified  

---

## 1. Executive Summary & Architecture Overview

WeatherGPT Backend is a production-grade Node.js and Express REST API gateway integrated with Firebase Admin SDK (Firestore), Open-Meteo Synoptic Meteorological APIs, and Google Gemini AI.

It acts as the single secure gateway for the WeatherGPT React frontend client, ensuring API key security, input validation, data normalization, AI synthesis grounding, and persistent user state across sessions.

```text
+-----------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                    |
|              (Vite Client — Current Weather Dashboard, Maps & Chat UI)            |
+-----------------------------------------------------------------------------------+
                                          │
                                HTTP REST Requests (/api/v1/*)
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
|                                NODE.JS + EXPRESS BACKEND                          |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ Middlewares: CORS, Request Validation, Security Logger, Error Handler       │  |
|  └─────────────────────────────────────────────────────────────────────────────┘  |
|  ┌─────────────────────────────────────────────────────────────────────────────┐  |
|  │ API Routes: /health, /weather, /forecast, /historical, /locations, /chat,   │  |
|  │ /alerts, /history, /user                                                    │  |
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

## 2. Directory & Module Map

```text
backend/
├── src/
│   ├── app.js                   # Express application setup & middleware mounting
│   ├── server.js                # Server entry point listening on PORT (5000)
│   ├── config/
│   │   ├── env.js               # Environment variables configuration & defaults
│   │   └── firebase.js          # Firebase Admin SDK initialization & Firestore export
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized Express error handler & AppErrors
│   │   └── validateRequest.js   # Input validation (coords, query, dates, chat payload)
│   ├── controllers/
│   │   ├── alert.controller.js  # GET /api/v1/alerts
│   │   ├── chat.controller.js   # POST /api/v1/chat
│   │   ├── forecast.controller.js# GET /api/v1/forecast
│   │   ├── health.controller.js # GET /api/v1/health
│   │   ├── historical.controller.js# GET /api/v1/historical
│   │   ├── history.controller.js# GET & POST /api/v1/history/search & /chat
│   │   ├── location.controller.js# GET /api/v1/locations/search & /saved
│   │   ├── user.controller.js   # User profile, settings & dashboard preferences
│   │   └── weather.controller.js# GET /api/v1/weather
│   ├── services/
│   │   ├── chat.service.js      # AI intent recognition & Gemini LLM synthesis
│   │   ├── firestore.service.js # Reusable Firestore CRUD operations with fallback
│   │   ├── forecast.service.js  # Hourly & Daily forecast telemetry
│   │   ├── historical.service.js# ERA5 Reanalysis climate data archive service
│   │   ├── location.service.js  # Open-Meteo Geocoding search service
│   │   └── weather.service.js   # Open-Meteo & Air Quality API normalization
│   ├── utils/
│   │   ├── logger.utils.js      # Security log filter (redacts API keys/secrets)
│   │   └── response.utils.js    # Standard JSON response formatters
│   └── tests/
│       ├── firestore.service.test.js
│       ├── health.test.js
│       ├── location.service.test.js
│       ├── master.routes.test.js
│       ├── validation.test.js
│       └── weather.service.test.js
├── package.json
├── .env.example
└── .gitignore
```

---

## 3. Environment Variables & Security Policy

Configured in `backend/.env` (ignored by `.gitignore`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Firebase Server Credentials
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

### Security Measures:
1. **Secrets Isolation:** No API keys baked into static frontend client JS.
2. **Key Sanitization:** Private keys parsed safely replacing escaped line breaks (`\n`).
3. **Restricted CORS:** Configured origin whitelist matching `FRONTEND_URL`.
4. **Log Filtering:** `logger.utils.js` redacts API keys and private key signatures before printing logs.

---

## 4. Firestore Database Collections Schema

1. **`users`** (`users/{userId}`): `{ userId, displayName, email, language, contextMode, temperatureUnit, theme, createdAt, updatedAt }`
2. **`searchHistory`** (`searchHistory/{id}`): `{ userId, query, location, latitude, longitude, searchedAt }`
3. **`chatHistory`** (`chatHistory/{id}`): `{ userId, sessionId, message, response, intent, location, createdAt }`
4. **`savedLocations`** (`savedLocations/{id}`): `{ userId, name, city, country, latitude, longitude, createdAt }`
5. **`alertPreferences`** (`alertPreferences/{userId}`): `{ userId, preferences, notificationFrequency, updatedAt }`
6. **`dashboardPreferences`** (`dashboardPreferences/{userId}`): `{ userId, visibleSections, sectionOrder, updatedAt }`

---

## 5. API Family Endpoints Reference

| Method | Endpoint | Purpose | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health & status metadata | None |
| `GET` | `/api/v1/weather` | Current weather telemetry & AQI | `lat`, `lon`, `locationName` |
| `GET` | `/api/v1/forecast` | 7-day daily & 24h hourly forecast | `lat`, `lon`, `days` (default 7) |
| `GET` | `/api/v1/historical` | ERA5 climate archive dataset | `lat`, `lon`, `startDate`, `endDate` |
| `GET` | `/api/v1/locations/search` | Geocoded location search | `q` (search string) |
| `GET` | `/api/v1/alerts` | Verified meteorological alerts | `lat`, `lon`, `city` |
| `POST` | `/api/v1/chat` | AI weather assistant endpoint | `{ message, location, contextMode, language }` |
| `GET` | `/api/v1/locations/saved` | Fetch saved locations | `userId` |
| `POST` | `/api/v1/locations/saved` | Add saved location | `{ userId, name, city, country, latitude, longitude }` |
| `DELETE` | `/api/v1/locations/saved/:userId/:id` | Delete saved location | `userId`, `id` |
| `GET` | `/api/v1/history/search` | Fetch search history | `userId`, `limit` |
| `POST` | `/api/v1/history/search` | Add search history entry | `{ userId, query, latitude, longitude }` |
| `GET` | `/api/v1/history/chat` | Fetch conversation history | `userId`, `limit` |
| `POST` | `/api/v1/history/chat` | Save chat message log | `{ userId, sessionId, message, response, intent }` |
| `GET` | `/api/v1/user/settings` | Get user settings | `userId` |
| `PATCH` | `/api/v1/user/settings` | Update user settings | `{ userId, language, temperatureUnit, theme, contextMode }` |
| `GET` | `/api/v1/user/dashboard-preferences` | Get dashboard layout prefs | `userId` |
| `PATCH` | `/api/v1/user/dashboard-preferences` | Update visible sections & order | `{ userId, visibleSections, sectionOrder }` |

---

## 6. AI Grounding & Weather Synthesis Pipeline

WeatherGPT enforces strict AI grounding rules:

```text
User Message
     │
     ▼
Validation & Intent Classification
     │
     ▼
Live Weather Telemetry Retrieval (Open-Meteo)
     │
     ▼
Grounded Context Injection & Reasoning Pipeline
     │
     ▼
Google Gemini LLM Synthesis (or Telemetry Fallback)
     │
     ▼
Response Delivery with Metadata & Official Alert Separation
```

### Key AI Rules:
- **No Invented Telemetry:** Weather values originate exclusively from synoptic observations.
- **Official Warning Separation:** Official alerts are returned via separate telemetry banners and never confused with AI lifestyle guidance.
- **8 Context Modes Supported:** General, Farmer, Traveler, Outdoor, Emergency, Commuter, Event Planner, Fitness.
- **Multilingual Support:** Dynamic response generation in English, Hindi, and Hinglish.

---

## 7. Frontend-Backend Integration Layer

Connected via [`frontend/src/services/backendApi.js`](file:///c:/7Sem/weather-gpt/frontend/src/services/backendApi.js) and [`frontend/src/services/api.js`](file:///c:/7Sem/weather-gpt/frontend/src/services/api.js).

* All frontend data fetching methods query the Express backend gateway at `http://localhost:5000/api/v1`.
* **Zero Downtime Fallback:** If the backend server is unreachable or offline, the frontend falls back to direct client-side Open-Meteo API calls and local storage state, preserving 100% UI stability and test compliance.

---

## 8. Viva Presentation Defense Q&A

**Q1: What architecture does WeatherGPT use for its backend API?**  
*Answer:* WeatherGPT uses a layered REST API architecture built with Node.js and Express. Requests flow through CORS and validation middlewares into specialized controllers (`weather`, `forecast`, `historical`, `location`, `chat`, `user`), which delegate to service modules connected to Open-Meteo REST APIs and Firebase Admin SDK (Firestore).

**Q2: How does the system handle database persistence without requiring live credentials for dev/test?**  
*Answer:* `src/config/firebase.js` inspects environmental variables safely. If Firebase Admin credentials are set, it connects to Firestore. If omitted (such as in local dev or automated unit testing), it uses an in-memory fallback store so all APIs and tests run smoothly without cloud credential dependencies.

**Q3: How is AI hallucination prevented in weather queries?**  
*Answer:* WeatherGPT implements strict data grounding. Before generating a response, live numerical weather prediction telemetry is fetched for the target location. The exact weather metrics are injected into the prompt context for Google Gemini, ensuring responses rely strictly on real-world observations.
