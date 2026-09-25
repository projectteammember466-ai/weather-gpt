# WeatherGPT — Final Production Architecture Specification
**Version:** 1.0.0-FINAL  
**Date:** September 2026  
**Status:** Integrated & Documented  

---

## 1. System Topology & Data Flow

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT LAYER                                    │
│  React 18 + Vite SPA Client                                                       │
│  ├── React Context API (WeatherContext, LanguageContext, ThemeContext)            │
│  ├── Custom Hooks (useWeather, useSavedLocations, useDashboardPreferences)        │
│  ├── Interactive Maps (Leaflet + OpenStreetMap + Weather Layer Overlays)          │
│  └── AI Chat Drawer & Reasoning Pipeline Visualizer                               │
└───────────────────────────────────────────────────────────────────────────────────┘
                                          │
                          HTTP / REST API Requests (/api/v1/*)
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                 BACKEND GATEWAY                                   │
│  Node.js + Express REST API                                                       │
│  ├── Security Middlewares (CORS, Rate Limiter, Security Headers, Input Validator) │
│  ├── Route Gateway (/health, /weather, /forecast, /historical, /locations, /chat) │
│  ├── Service Abstraction Layer                                                    │
│  └── Central Error & Exception Handler                                            │
└───────────────────────────────────────────────────────────────────────────────────┘
       │                                  │                                   │
       ▼                                  ▼                                   ▼
┌───────────────┐                  ┌───────────────┐                  ┌───────────────┐
│  Open-Meteo   │                  │   Firebase    │                  │  Google Gemini│
│ Telemetry Grid│                  │   Firestore   │                  │  AI / LLM API │
└───────────────┘                  └───────────────┘                  └───────────────┘
```

---

## 2. Core Subsystems

### 1. Meteorological Telemetry Gateway (`backend/src/services/weather.service.js`)
- Interfaces with Open-Meteo Synoptic Forecast API (`api.open-meteo.com/v1/forecast`) and Air Quality API (`air-quality-api.open-meteo.com/v1/air-quality`).
- Converts WMO weather codes into human-readable condition descriptions and UI icon identifiers.
- Calculates derived indices (apparent temperature, dew point, wind vectors, AQI health categories).

### 2. Geocoding & Location Search Gateway (`backend/src/services/location.service.js`)
- Interfaces with Open-Meteo Geocoding API (`geocoding-api.open-meteo.com/v1/search`).
- Normalizes city, regional subdivision, country, coordinates, and timezone boundaries.

### 3. Historical Climate Archive Gateway (`backend/src/services/historical.service.js`)
- Interfaces with Open-Meteo ERA5 Reanalysis Archive (`archive-api.open-meteo.com/v1/archive`).
- Computes aggregate metrics (mean/max/min temperatures, precipitation sums, rainy days, max wind speeds).

### 4. Firestore Database Persistence Gateway (`backend/src/services/firestore.service.js`)
- Initializes Firebase Admin SDK with credentials parsing.
- Manages 6 collections (`users`, `savedLocations`, `searchHistory`, `chatHistory`, `alertPreferences`, `dashboardPreferences`).
- Operates in a resilient in-memory mode when cloud credentials are unconfigured during local dev or unit tests.

### 5. AI Reasoning & Grounding Pipeline (`backend/src/services/chat.service.js`)
- Classifies user intent across 20+ query patterns.
- Fetches live synoptic observations before invoking LLM synthesis.
- Formats contextually tailored advice across 8 user perspective modes in English, Hindi, and Hinglish.

---

## 3. Resilience & Failure Recovery Architecture

```text
                               Client Request
                                     │
                                     ▼
                        Try Express Backend Gateway
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
             Backend Success                    Backend Error / Offline
                    │                                 │
                    ▼                                 ▼
         Use Normalized Response             Try Client-Side API
                                                      │
                                     ┌────────────────┴────────────────┐
                                     │                                 │
                             Open-Meteo Success                 Open-Meteo Error
                                     │                                 │
                                     ▼                                 ▼
                         Use Client Telemetry                Use Local Fixture
```

---

## 4. Security Architecture

1. **Secret Isolation:** API keys remain strictly server-side in `backend/.env`.
2. **CORS Protection:** Configured origin whitelist prevents unauthorized domain access.
3. **Rate Limiting:** Protects `/api/v1/chat` and API endpoints against request flooding.
4. **Input Boundaries:** Bounds search string lengths (max 100 chars) and chat message sizes (max 1000 chars).
5. **Log Filtering:** Redacts API keys and signatures before writing log streams.
