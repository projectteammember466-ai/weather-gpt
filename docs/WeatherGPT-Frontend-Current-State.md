# WeatherGPT — Frontend Freeze & Backend Handoff Documentation
**Version:** 1.0.0-FREEZE  
**Date:** September 2026  
**Status:** Frozen & Verified  

---

## 1. Executive Summary & Architecture Overview

WeatherGPT is an intelligent, AI-powered weather forecasting and climate analytics web application. It combines real-time meteorological data with Google's Gemini LLM to deliver conversational weather insights, multi-mode impact analysis (travel, agriculture, health, solar energy, events), interactive radar mapping, historical climate trends (ERA5 reanalysis), location comparison, and multi-language support (English, Hindi, Hinglish).

```
+-----------------------------------------------------------------------------------+
|                                 WEATHERGPT FRONTEND                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +------------------------+  +------------------------+  +---------------------+  |
|  |    UI Layer            |  |  Context & State Layer |  |  AI & Logic Engine  |  |
|  | - Hero & Details Cards |  | - WeatherContext       |  | - Intent Parser     |  |
|  | - Radar Map (Leaflet)  |  | - LanguageContext      |  | - Reasoning Pipeline|  |
|  | - AI Chat Drawer       |  | - ThemeContext         |  | - 8 Context Modes   |  |
|  | - Responsive Navbar    |  | - Speech Systems       |  | - Gemini Fallback   |  |
|  +------------------------+  +------------------------+  +---------------------+  |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  |                        Services & Data Abstraction                          |  |
|  |  - Open-Meteo REST Client (Current, Hourly, Daily, Air Quality, ERA5 Archive)  |  |
|  |  - Nominatim Reverse / Forward Geocoding Service                            |  |
|  |  - Gemini API Direct Integration (Client-Side Fallback)                      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                          |
                        [ Phase 2 Backend Handoff Interface ]
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            NODE.JS + EXPRESS BACKEND                              |
|  - API Gateway (/api/v1/weather, /api/v1/chat, /api/v1/locations)                 |
|  - Secured API Key Storage & Rate Limiting                                         |
|  - Redis Cache & Database Storage (User profiles, saved cities, conversation logs)|
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Technologies & Dependencies Map

### Frontend Stack
* **Framework:** React 18 (Vite build toolchain)
* **Styling:** Tailwind CSS with custom responsive utilities, Glassmorphism, and dark/light mode CSS variables
* **State Management:** React Context API + Custom Hooks (`useWeather`, `useLanguage`, `useTheme`, `useVoice`, `useSpeechSynthesis`)
* **Icons:** Lucide React (`lucide-react`)
* **Charts & Data Viz:** Recharts for hourly temperature, precipitation probability, wind speed, and historical climate trends
* **Mapping:** Leaflet & React-Leaflet with custom tile layers (OpenStreetMap, OpenWeather Radar overlays)
* **Testing:** Vitest + React Testing Library (34 automated unit/integration tests)
* **AI Engine:** `@google/genai` (Google Gemini 2.5 Flash SDK) with client-side rule-based fallback parser

---

## 3. Directory & File Structure Map

```text
C:\7Sem\Weather GPT\
├── backend/
│   └── .env.example                # Backend environment configuration template
├── docs/
│   └── WeatherGPT-Frontend-Current-State.md # This handoff specification document
├── frontend/
│   ├── public/                     # Static assets & web manifest
│   ├── src/
│   │   ├── assets/                 # Icons and image assets
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   └── WeatherChat.jsx # AI Chat drawer & natural language assistant
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx      # Application footer
│   │   │   │   ├── MobileNav.jsx   # Fixed bottom responsive navigation bar
│   │   │   │   └── Navbar.jsx     # Header navigation bar with search & controls
│   │   │   ├── map/
│   │   │   │   └── RadarMap.jsx    # Leaflet radar map with layer overlays
│   │   │   ├── pipeline/
│   │   │   │   └── ReasoningPipeline.jsx # Visualizer for AI intent recognition
│   │   │   ├── search/
│   │   │   │   ├── LocationButton.jsx  # Geolocation trigger button
│   │   │   │   └── SearchSuggestions.jsx # Auto-complete search dropdown
│   │   │   └── weather/
│   │   │       ├── AirQualityCard.jsx # AQI break-down card
│   │   │       ├── ClimateSummary.jsx # Multi-mode impact & climate advice card
│   │   │       ├── DailyForecast.jsx  # 7-day extended forecast card
│   │   │       ├── HourlyForecast.jsx # Interactive hourly chart & slider
│   │   │       ├── SavedLocations.jsx # Saved cities management grid
│   │   │       ├── SunMoonCard.jsx    # Astronomical sunrise/sunset & moon phases
│   │   │       ├── WeatherAlerts.jsx  # Severe weather alert banners
│   │   │       ├── WeatherDetails.jsx # Detailed metrics grid (humidity, pressure, etc.)
│   │   │       └── WeatherHero.jsx    # Main current weather showcase widget
│   │   ├── context/
│   │   │   ├── LanguageContext.jsx # i18n translation state (EN, HI, Hinglish)
│   │   │   ├── ThemeContext.jsx    # Dark / Light theme switching context
│   │   │   └── WeatherContext.jsx # Central weather, location, & search state
│   │   ├── hooks/
│   │   │   ├── useSpeechSynthesis.js # Text-to-Speech audio output hook
│   │   │   └── useVoice.js           # Web Speech API voice recognition hook
│   │   ├── pages/
│   │   │   ├── CompareWeather.jsx  # Multi-location comparison view
│   │   │   ├── HistoricalWeather.jsx# ERA5 climate trend reanalysis page
│   │   │   └── Settings.jsx        # User preference configurations
│   │   ├── services/
│   │   │   └── api.js              # Centralized data fetching abstraction
│   │   ├── utils/
│   │   │   ├── helpers.js          # Temperature/wind unit conversion helpers
│   │   │   └── translations.js     # Multilingual dictionary
│   │   ├── App.css                 # Custom application component styling
│   │   ├── App.jsx                 # Main application shell & router
│   │   ├── index.css               # Base Tailwind CSS rules & layout protection
│   │   └── main.jsx                # Application root mounting point
│   ├── test/                       # Vitest unit test suite (34 tests)
│   │   ├── setup.js
│   │   ├── WeatherChat.test.jsx
│   │   ├── WeatherContext.test.jsx
│   │   ├── WeatherHero.test.jsx
│   │   └── api.test.js
│   ├── .env.example                # Public Vite client template
│   ├── .gitignore                  # Frontend Git ignore rules
│   ├── package.json                # NPM dependency manifest
│   └── vite.config.js              # Vite bundler configuration
├── .gitignore                      # Root Git ignore rules
├── env                             # (Ignored) Local secret keys
└── README.md                       # Repository overview documentation
```

---

## 4. State Management Architecture

WeatherGPT uses React Context API to provide a decoupled, predictable global state across components without prop drilling:

1. **`WeatherContext`** (`src/context/WeatherContext.jsx`):
   - `location`: Active location object `{ name, lat, lon, country, state }`.
   - `weatherData`: Current weather payload from Open-Meteo (`temperature`, `humidity`, `windSpeed`, `condition`, `weatherCode`, etc.).
   - `forecastData`: 7-day daily forecast and 24-hour hourly forecast arrays.
   - `airQualityData`: AQI index, PM2.5, PM10, NO2, O3, SO2 values.
   - `alerts`: Array of severe weather alert objects.
   - `savedLocations`: Persisted array of user-favorite locations in `localStorage`.
   - `activeMode`: Current impact context mode (`general`, `travel`, `agriculture`, `health`, `outdoor`, `energy`, `event`, `aviation`).
   - `unitSystem`: Temperature unit preference (`celsius` or `fahrenheit`).
   - `searchHistory`: Recent search query strings array.

2. **`LanguageContext`** (`src/context/LanguageContext.jsx`):
   - `language`: Selected UI language code (`en`, `hi`, `hinglish`).
   - `t(key)`: Translation helper function accessing `src/utils/translations.js`.

3. **`ThemeContext`** (`src/context/ThemeContext.jsx`):
   - `theme`: Active color theme (`dark` or `light`). Automatically sets `dark` class on root HTML element.

---

## 5. Services Layer Analysis (`src/services/api.js`)

All external network operations are centralized inside `src/services/api.js`.

### Key Service Methods:
* **`fetchWeatherData(lat, lon)`**: Calls Open-Meteo REST API (`https://api.open-meteo.com/v1/forecast`) for current temperature, apparent temperature, humidity, surface pressure, wind speed/direction, weather code, cloud cover, and visibility.
* **`fetchForecastData(lat, lon)`**: Queries Open-Meteo for 7-day daily max/min temperatures, precipitation totals, UV max, sunrise/sunset times, and hourly breakdowns.
* **`fetchAirQualityData(lat, lon)`**: Queries Open-Meteo Air Quality API (`https://air-quality-api.open-meteo.com/v1/air-quality`).
* **`fetchHistoricalWeather(lat, lon, startDate, endDate)`**: Queries Open-Meteo ERA5 Reanalysis Archive (`https://archive-api.open-meteo.com/v1/archive`) for historical temperature and rainfall trends.
* **`searchLocations(query)`**: Interacts with Nominatim OpenStreetMap geocoding API to return location matches.
* **`reverseGeocode(lat, lon)`**: Converts coordinates to human-readable city, state, and country names.

---

## 6. Data Models & Schemas

### Location Object
```json
{
  "name": "Delhi",
  "state": "Delhi",
  "country": "India",
  "lat": 28.6139,
  "lon": 77.2090
}
```

### Weather Data Payload
```json
{
  "temperature": 28.5,
  "apparentTemperature": 30.2,
  "humidity": 65,
  "pressure": 1012,
  "windSpeed": 12.4,
  "windDirection": 180,
  "weatherCode": 1,
  "condition": "Mainly Clear",
  "cloudCover": 20,
  "visibility": 10000,
  "uvIndex": 6.5,
  "dewPoint": 21.0,
  "isDay": 1
}
```

---

## 7. AI Chat & Intent Recognition System

WeatherGPT features an intelligent conversational assistant integrated in `src/components/ai/WeatherChat.jsx`:

* **Intent Recognition Engine**: Parses user prompts to identify 8 primary intents:
  1. `CURRENT_WEATHER`: Queries immediate weather conditions.
  2. `FORECAST`: Queries multi-day outlooks.
  3. `CLIMATE_ADVICE`: Requests activity recommendations based on active context mode.
  4. `AIR_QUALITY`: Asks about AQI, PM2.5, pollution levels.
  5. `HISTORICAL`: Asks about historical climate comparisons.
  6. `COMPARE`: Requests comparative metrics between cities.
  7. `CLOTHING`: Asks what to wear based on current temperature/weather.
  8. `GENERAL_CONVERSATION`: Standard conversational greeting/query.

* **Reasoning Pipeline Visualizer** (`src/components/pipeline/ReasoningPipeline.jsx`): Shows step-by-step AI decision nodes (Intent Detection -> Data Fetching -> Context Enrichment -> LLM Synthesis -> Response Delivery) in real time.

* **Dual Engine Architecture**:
  - Primary: `@google/genai` Gemini 2.5 Flash SDK integration.
  - Fallback: Deterministic rule-based response generator operating entirely offline or when API keys are unconfigured.

---

## 8. User Context Modes & Multilingual Support

### 8 Context Modes (`activeMode`)
1. **General**: Comprehensive everyday weather summary.
2. **Travel**: Packing recommendations, flight visibility, transit advisory.
3. **Agriculture**: Soil moisture indicators, irrigation necessity, frost/heat risk.
4. **Health & UV**: Skin protection guidance, hydration advice, respiratory warnings.
5. **Outdoor Activities**: Running, cycling, hiking condition ratings.
6. **Energy / Solar**: Photovoltaic generation efficiency estimates based on cloud cover & solar irradiance.
7. **Event Planning**: Rain risk and outdoor event suitability score.
8. **Aviation & Maritime**: Crosswind advisories, sea state, visibility metrics.

### Multilingual Support
Supported languages: **English**, **Hindi**, **Hinglish**. All strings are dynamically mapped via `src/utils/translations.js` based on `LanguageContext`.

---

## 9. Responsive Design & Layout Engineering

The frontend has undergone exhaustive responsive testing across 15 target viewports (320px to 1600px+):

* **Horizontal Overflow Safeguard**: Root containers enforce strict overflow prevention (`index.css` and `App.css`) ensuring `document.documentElement.scrollWidth === window.innerWidth`.
* **Mobile Navigation**: Bottom fixed navigation bar (`src/components/layout/MobileNav.jsx`) on screens under 768px for single-thumb touch operation.
* **Flexible Grids**: Tailored Tailwind CSS grid structures (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with container query fallbacks.

---

## 10. LocalStorage Schema Dictionary

| Key | Format | Description |
|---|---|---|
| `weathergpt_saved_locations` | JSON Array | Array of user saved location objects |
| `weathergpt_unit` | String | `"celsius"` or `"fahrenheit"` |
| `weathergpt_language` | String | `"en"`, `"hi"`, or `"hinglish"` |
| `weathergpt_theme` | String | `"dark"` or `"light"` |
| `weathergpt_active_mode` | String | Active context mode (e.g. `"travel"`) |
| `weathergpt_recent_searches` | JSON Array | History of up to 10 recent search queries |

---

## 11. Security & Environment Variable Policy

### Key Distinction: Frontend `VITE_*` vs Backend Secrets

* **Vite Environment Policy**: Any variable starting with `VITE_` is baked directly into the static JavaScript client bundle compiled by Vite. **Never place private database credentials, secret service keys, or admin keys in `VITE_` variables.**
* **Public Client Keys**: `VITE_OPENWEATHER_API_KEY` and `VITE_GOOGLE_MAPS_API_KEY` are used for browser-rendered tile overlays and map scripts.
* **Backend Handoff Requirement**: In Phase 2, LLM calls (Gemini API) and third-party API proxying will migrate to the Node.js/Express backend (`backend/.env`).

### Environment Templates Created:
1. `frontend/.env.example`: Public Vite client template.
2. `backend/.env.example`: Backend environment variable template containing `PORT`, `NODE_ENV`, `FRONTEND_URL`, `OPENWEATHER_API_KEY`, `GOOGLE_MAPS_API_KEY`, and `GEMINI_API_KEY`.

---

## 12. Backend Handoff Specification: Planned Express API Contract

In Phase 2, the Node.js + Express backend will act as the single secure gateway for the WeatherGPT frontend. Below is the API specification:

### Base URL: `/api/v1`

#### 1. `GET /api/v1/weather`
* **Query Parameters:** `lat` (number), `lon` (number), `units` (`metric`|`imperial`)
* **Response Payload:** Current weather metrics + Air Quality + Severe alerts array.

#### 2. `GET /api/v1/forecast`
* **Query Parameters:** `lat` (number), `lon` (number), `days` (number, default: 7)
* **Response Payload:** Daily forecast objects array + 24-hour breakdown array.

#### 3. `GET /api/v1/historical`
* **Query Parameters:** `lat` (number), `lon` (number), `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD)
* **Response Payload:** ERA5 historical reanalysis dataset.

#### 4. `POST /api/v1/chat`
* **Request Body:**
  ```json
  {
    "message": "Should I carry an umbrella in Delhi today?",
    "location": { "name": "Delhi", "lat": 28.6139, "lon": 77.2090 },
    "contextMode": "travel",
    "language": "en"
  }
  ```
* **Response Payload:**
  ```json
  {
    "reply": "Yes, Delhi has a 75% chance of afternoon rain. Carrying an umbrella is recommended.",
    "intent": "CLOTHING",
    "reasoningSteps": [
      "Detected intent: CLOTHING",
      "Retrieved current humidity (65%) and rain probability (75%)",
      "Synthesized response via Gemini 2.5 Flash model"
    ]
  }
  ```

#### 5. `GET /api/v1/locations/search`
* **Query Parameters:** `q` (string query)
* **Response Payload:** Array of matched geocoded location objects.

#### 6. `GET /api/v1/health`
* **Response Payload:** `{ "status": "ok", "timestamp": "2026-09-24T23:42:00Z" }`

---

## 13. Frontend-to-Backend Integration Migration Strategy

To connect the frozen frontend to the Express backend in Phase 2:

1. Update `src/services/api.js` to replace direct third-party REST URLs with backend endpoint calls:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';
   ```
2. Replace direct client-side Gemini LLM calls with `fetch(`${API_BASE_URL}/chat`, ...)` in `src/components/ai/WeatherChat.jsx`.
3. Keep local fallback mechanisms in `api.js` active so the app functions seamlessly during backend maintenance.

---

## 14. Testing & Verification Summary

* **Automated Unit Tests:** 34 / 34 tests passing (`Vitest`).
* **Production Build:** `npm run build` compiled successfully (0 errors, 0 warnings).
* **Responsive Layout Audits:** Passed 100% across 15 viewports (320px to 1600px+).

---

## 15. Viva & Project Presentation Defense Q&A

**Q1: Why use Open-Meteo alongside OpenWeather?**  
*Answer:* Open-Meteo provides free, high-resolution meteorological data and ERA5 historical reanalysis archives without restrictive daily API call limits, while OpenWeather can be optionally utilized for satellite radar tile overlays.

**Q2: How does WeatherGPT process natural language weather queries?**  
*Answer:* WeatherGPT uses a two-tier intent recognition architecture. First, a lightweight intent classifier maps user queries to structured intent schemas (e.g. `CLOTHING`, `TRAVEL`, `AGRICULTURE`). Then, live meteorological context is injected into a structured prompt sent to Google Gemini LLM to generate actionable, context-aware advice.

**Q3: How is state managed across the application without third-party heavy state tools like Redux?**  
*Answer:* WeatherGPT uses React's native Context API combined with custom hooks (`useWeather`, `useLanguage`, `useTheme`). This keeps the bundle lightweight, minimizes boilerplate, and ensures clean component reactivity across views.

**Q4: How does the application handle offline or API key failures?**  
*Answer:* The application implements a deterministic client-side fallback engine. If network requests or Gemini API calls fail, fallback weather synthesis and local rule-based response generators take over, ensuring zero app crashes or blank screens.
