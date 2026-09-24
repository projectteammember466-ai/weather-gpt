# WeatherGPT — Complete Project Execution Plan
## Deep-Researched, Node.js + Express Edition

**Project:** WeatherGPT — AI-Powered Conversational Weather Assistant  
**SIH Problem:** SIH-26068  
**Team Size:** 2 members  
**Primary Goal:** Build a simple, reliable, explainable weather assistant suitable for a college project and viva.

---

# 0. EXECUTION CONTRACT

This document is the new source of truth for implementation.

The project must be executed in this order:

> PLAN → FRONTEND → FRONTEND CHECKPOINT → BACKEND → DATABASE → AI → BACKEND CHECKPOINT → INTEGRATION → COMPLETE TESTING → DEPLOYMENT → DOCUMENTATION → VIVA

Do not build everything at once.

Implement one phase at a time.

For every phase:

1. Explain the objective.
2. Inspect the existing project before changing it.
3. List files to create.
4. List files to modify.
5. Implement only the current phase.
6. Run the relevant checks.
7. Fix errors.
8. Verify the expected result.
9. Record the phase as complete.
10. Move forward only when the phase is stable.

Never silently skip a phase.

Never fabricate weather values, forecasts, official warnings, API responses, database records, sources, or AI confidence.

---

# 1. DEEP-RESEARCHED TECHNOLOGY DECISIONS

## 1.1 Frontend

- React
- Vite
- JavaScript
- JSX
- CSS
- React hooks: useState, useEffect
- fetch() for HTTP communication
- Simple reusable components

The frontend remains intentionally simple and student-friendly.

---

## 1.2 Backend

### Selected backend

- Node.js
- Express.js 5.x
- JavaScript
- npm
- REST
- JSON

Express 5.x is the current Express generation and requires Node.js 18 or newer. The project should use a supported Node.js LTS release rather than a short-lived Current release. As of September 2026, Node.js 24.x is listed as LTS while Node.js 26.x is Current. Therefore:

> Recommended runtime: Node.js 24 LTS

Do not use Java, Spring Boot, or Maven in this version.

---

## 1.3 Database

- Firebase Cloud Firestore
- Firebase Admin SDK (`firebase-admin`)
- NoSQL document model
- Server-side validation
- Environment-based Firebase credentials

Firestore is the only persistent database for this version of WeatherGPT. The Node.js backend owns all Firestore operations through the Firebase Admin SDK. Do not introduce another relational database, SQL-based schema, connection-pool layer, joins, or foreign keys.

Keep the Firestore model intentionally small and student-friendly.

## 1.4 Weather Provider

### Primary weather provider

Open-Meteo is recommended for the student MVP because its public API can be used without an API key for non-commercial educational/prototyping use, provides JSON HTTP APIs, and includes geocoding and forecast capabilities.

Important:

- Free API use is for non-commercial use.
- Attribution is required by the data licence.
- The free service has published rate limits.
- The backend must still handle provider failure and rate limiting.

The application should display weather-source attribution where required.

If the project later requires commercial use, higher capacity, or a provider with a contractual SLA, replace Open-Meteo through the provider adapter without changing the frontend contract.

---

## 1.5 Official Alert Provider

For India-focused official warning data, the project should prefer the India Meteorological Department (IMD) where accessible.

IMD publishes APIs for:

- Current weather
- City forecasts
- District-wise forecasts
- District-wise warnings
- Subdivision warnings
- Nowcasts
- Rainfall information

Important distinction:

> Weather forecast data and official warning data are different data products.

Do not manufacture an official warning from ordinary weather values.

If the required official warning endpoint is unavailable or cannot be reliably integrated:

> Return "No official alert data available."

Do not replace an unavailable official warning with an AI-generated warning.

---

## 1.6 AI / LLM

The LLM is an explanation layer.

The LLM is NOT the weather source.

The flow is:

User Query
→ Query Understanding
→ Location/Time Resolution
→ Weather Retrieval
→ Data Validation
→ Deterministic Weather Reasoning
→ Grounded LLM Explanation
→ Final Response

The backend may use the official OpenAI JavaScript SDK if OpenAI is selected for the project.

The LLM must receive validated weather context and must not invent missing weather facts.

The LLM provider should remain replaceable through a service layer.

---

# 2. FINAL ARCHITECTURE

```text
                         USER
                           |
                           v
                  React + Vite UI
                           |
                       REST/JSON
                           |
                           v
                  Node.js + Express
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
     Weather Service   Alert Service    Chat Service
          |                |                |
          v                v                v
    Open-Meteo API        IMD API       NLP/Reasoning
          |                                 |
          |                                 v
          |                              LLM API
          |                                 |
          +----------------+----------------+
                           |
                           v
                        Firebase Firestore
                           |
                           v
                  Grounded Response
                           |
                           v
                     React UI
```

---

# 3. CORE DESIGN PRINCIPLES

## 3.1 Reliable data first

The system must retrieve weather data before generating an explanation.

## 3.2 Validation before reasoning

Never reason over an invalid or incomplete external response.

## 3.3 Deterministic logic before LLM

Use code for simple factual transformations and thresholds.

Example:

```text
rainProbability = 80
→ rain is likely
```

The LLM can explain that conclusion but should not invent the probability.

## 3.4 Official warnings stay official

Only authoritative warning data should be labelled as an official warning.

## 3.5 Backend owns secrets

Never put weather-provider keys, LLM keys, or database credentials in React.

## 3.6 Failure isolation

If chat fails, the weather dashboard should still work.

If history fails, the current-weather dashboard should still work.

If voice fails, text chat should still work.

## 3.7 Simple architecture

Do not add:

- Microservices
- Kubernetes
- Redux
- TypeScript
- Complex ORM layers
- Complex NLP frameworks
- Unnecessary authentication
- Unnecessary message queues
- Unnecessary caching systems

unless a later requirement actually needs them.

---

# 4. FINAL PROJECT SCOPE

## Must Have

1. City search
2. Current weather
3. Forecast
4. Responsive dashboard
5. AI weather chat
6. Weather-data grounding
7. Loading states
8. Error handling
9. Source information
10. Backend validation

## Should Have

11. Official alerts
12. Browser location
13. Search history
14. Suggested questions

## Optional

15. Voice input
16. Conversation history
17. Personalization
18. Explainable "Why?" responses
19. Multi-source comparison

## Future Scope

20. Radar
21. Satellite
22. Advanced weather-data fusion
23. Agriculture intelligence
24. Advanced disaster-risk models
25. Multilingual support

Do not allow optional features to delay the MVP.

---

# 5. FINAL FOLDER STRUCTURE

## Frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── SearchBar.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── WeatherDetails.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── AlertCard.jsx
│   │   ├── ChatBox.jsx
│   │   ├── ChatMessage.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── EmptyState.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── services/
│   │   └── weatherApi.js
│   ├── data/
│   │   └── mockWeather.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
└── vite.config.js
```

## Backend

```text
backend/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── firebase.js
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── weatherController.js
│   │   ├── forecastController.js
│   │   ├── alertController.js
│   │   ├── chatController.js
│   │   └── historyController.js
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   ├── weatherRoutes.js
│   │   ├── forecastRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── chatRoutes.js
│   │   └── historyRoutes.js
│   ├── services/
│   │   ├── weatherService.js
│   │   ├── forecastService.js
│   │   ├── alertService.js
│   │   ├── geocodingService.js
│   │   ├── queryUnderstandingService.js
│   │   ├── weatherReasoningService.js
│   │   ├── llmService.js
│   │   └── historyService.js
│   ├── models/
│   │   ├── searchHistoryModel.js
│   │   └── chatHistoryModel.js
│   ├── middleware/
│   │   ├── validateRequest.js
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── httpClient.js
│   │   ├── weatherMapper.js
│   │   └── response.js
│   ├── app.js
│   └── server.js
├── tests/
├── firestore/
│   └── firestore-structure.md
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

This is a target structure, not a requirement to create every file immediately.

Create files only when their phase requires them.

---

# 6. API CONTRACT

## Health

```http
GET /api/health
```

Example:

```json
{
  "status": "OK",
  "message": "WeatherGPT backend is running"
}
```

## Weather

```http
GET /api/weather?city=Jodhpur
```

Example response:

```json
{
  "city": "Jodhpur",
  "temperature": 32,
  "feelsLike": 34,
  "condition": "Sunny",
  "humidity": 42,
  "windSpeed": 18,
  "visibility": 8,
  "pressure": 1008,
  "rainProbability": 10,
  "source": "Open-Meteo",
  "updatedAt": "2026-09-20T10:00:00"
}
```

Only return fields actually available from the provider.

## Forecast

```http
GET /api/forecast?city=Jodhpur
```

## Alerts

```http
GET /api/alerts?city=Jodhpur
```

## Chat

```http
POST /api/chat
```

Request:

```json
{
  "message": "Will it rain in Jodhpur tomorrow evening?",
  "city": "Jodhpur"
}
```

Possible normalized internal interpretation:

```json
{
  "intent": "precipitation_forecast",
  "location": "Jodhpur",
  "date": "tomorrow",
  "time": "evening",
  "variable": "precipitation"
}
```

## History

```http
GET /api/history
```

and, if implemented:

```http
POST /api/history
```

---

# 7. DATABASE DESIGN

Use **Firebase Cloud Firestore** as the only persistent database. Firestore is a NoSQL document database, so model data as collections and documents rather than relational tables.

## Collection: searchHistory

Suggested document fields:

```text
city
searchedAt
userId (optional)
```

## Collection: chatHistory

Suggested document fields:

```text
userMessage
assistantResponse
city
createdAt
userId (optional)
```

## Collection: users (optional)

Only add this if Firebase Authentication is introduced. It is not required for the core MVP.

```text
displayName
createdAt
lastSeenAt
```

## What should NOT be stored

Do not permanently store every weather API response, every forecast request, API keys, LLM keys, temporary UI state, or fake/mock weather data. Live weather remains the responsibility of the weather provider.

## Firestore rules for this project

- Use the Firebase Admin SDK from the Node.js backend.
- Keep service-account credentials only on the server.
- Validate data before every write.
- Use Firestore timestamps for `searchedAt` and `createdAt` where appropriate.
- Keep documents small; do not save large raw weather payloads unless a later requirement explicitly needs them.
- Add Firestore indexes only when an actual query requires them.
- If browser-side Firestore access is not required, let Express handle all Firestore operations.

# 8. ENVIRONMENT VARIABLES

## Backend

```env
PORT=5000

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key"

OPENAI_API_KEY=your_key
```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=weathergpt
DB_USER=root
DB_PASSWORD=your_password

OPENAI_API_KEY=your_key
OPENAI_MODEL=your_model

WEATHER_BASE_URL=https://api.open-meteo.com
GEOCODING_BASE_URL=https://geocoding-api.open-meteo.com
IMD_API_BASE_URL=https://api.imd.gov.in
```

Do not commit real values.

## Frontend

```env
VITE_API_BASE_URL=http://localhost:5000
```

Only public frontend configuration belongs in VITE variables.

Never place secret keys in VITE variables.

---

# 9. PHASE-BY-PHASE EXECUTION

# PHASE A — COMPLETE FRONTEND

## Phase 1 — Project Setup

Create the React + Vite application.

Tasks:

- Verify Node.js installation.
- Create frontend project.
- Install dependencies.
- Run development server.
- Confirm browser rendering.

Expected:

```text
Frontend starts successfully.
```

---

## Phase 2 — Frontend Folder Structure

Create:

- components
- pages
- services
- data

Create App.jsx and Home.jsx.

Do not create backend files.

---

## Phase 3 — Navbar

Implement:

- WeatherGPT branding
- Navigation placeholder
- Responsive layout

Test desktop and mobile.

---

## Phase 4 — Search Bar

Implement:

- City input
- Search button
- Enter-key support
- Basic validation

Use dummy data.

---

## Phase 5 — Current Weather Card

Display:

- City
- Temperature
- Condition
- Feels-like temperature

Use mock data.

---

## Phase 6 — Weather Details

Display:

- Humidity
- Wind
- Visibility
- Pressure
- Sunrise
- Sunset

If a value is unavailable, show N/A or hide that item.

Never invent data.

---

## Phase 7 — Forecast UI

Create:

- Daily forecast
- Optional hourly forecast

Use dummy data.

---

## Phase 8 — Alert UI

Create AlertCard.

Clearly distinguish:

```text
Official Warning
```

from:

```text
AI Explanation
```

During frontend-only development, use clearly marked mock data.

---

## Phase 9 — Chat UI

Create:

- ChatBox
- ChatMessage
- User messages
- Assistant messages
- Input
- Send button

Use dummy AI responses.

---

## Phase 10 — Suggested Questions

Examples:

- Will it rain today?
- What will the temperature be tomorrow?
- Is it windy?
- What is the forecast this weekend?

Suggested questions must use the same chat flow later.

---

## Phase 11 — Loading State

Create reusable Loading component.

Test:

- Weather loading
- Forecast loading
- Chat loading

---

## Phase 12 — Error State

Create ErrorMessage.

Display understandable errors.

Never expose stack traces to users.

---

## Phase 13 — Empty State

Handle:

- No weather data
- No forecast
- No alerts
- No history
- Empty chat

---

## Phase 14 — Retry

Implement retry behavior.

Do not duplicate API logic inside components.

---

## Phase 15 — Dummy Data Integration

Create:

```text
src/data/mockWeather.js
```

Use realistic but clearly mock/sample values.

The UI must operate without a backend.

---

## Phase 16 — Search State

Use useState.

Flow:

```text
Search city
→ update selected city
→ update mock weather
→ update forecast
→ update alerts
```

---

## Phase 17 — Chat State

Use:

- useState
- event handlers
- map()
- conditional rendering

Avoid advanced state management.

---

## Phase 18 — Responsive Design

Test:

- Desktop
- Laptop
- Tablet
- Mobile

Use CSS media queries.

---

## Phase 19 — Visual Consistency

Check:

- spacing
- typography
- buttons
- cards
- layout
- empty states

Do not redesign unnecessarily.

---

## Phase 20 — Frontend Accessibility Basics

Check:

- labels
- button text
- keyboard interaction
- readable contrast
- form semantics
- useful error messages

---

## Phase 21 — Frontend Cleanup

Remove:

- unused imports
- unused components
- unused dependencies
- console errors
- dead code

---

## Phase 22 — FRONTEND CHECKPOINT

Verify:

- project runs
- all components render
- search works
- weather works
- forecast works
- alerts work
- chat works
- loading works
- errors work
- empty state works
- retry works
- responsive design works
- no console errors

Only after this:

> FRONTEND = COMPLETE

Do not start backend integration before this checkpoint.

---

# PHASE B — NODE.JS + EXPRESS BACKEND

## Phase 23 — Backend Environment

Install/use:

- Node.js 24 LTS
- npm
- Express 5.x

Initialize:

```bash
npm init -y
```

Install the minimum required packages.

Initial package set:

```text
express
cors
dotenv
helmet
firebase-admin
```

Add other dependencies only when a later phase requires them.

---

## Phase 24 — Backend Basic Server

Create:

```text
src/app.js
src/server.js
```

Implement:

- Express application
- JSON parser
- CORS
- basic route
- server startup

Expected:

```text
Server starts successfully.
```

---

## Phase 25 — Health API

Implement:

```http
GET /api/health
```

Expected:

```json
{
  "status": "OK",
  "message": "WeatherGPT backend is running"
}
```

Test with browser/Postman.

---

## Phase 26 — Backend Configuration

Create:

```text
.env
.env.example
src/config/env.js
```

Load environment variables centrally.

Do not read secrets throughout random files.

---

## Phase 27 — Backend Security Foundation

Add appropriate:

- Helmet
- CORS configuration
- input validation
- safe error responses
- request-size limits
- dependency auditing

Do not expose stack traces in production.

Use npm audit regularly.

---

## Phase 28 — HTTP Client Utility

Create a reusable HTTP utility.

Requirements:

- timeout
- external API error detection
- JSON parsing
- consistent error behavior

Do not duplicate external HTTP logic everywhere.

---

## Phase 29 — Geocoding

Implement city → coordinates.

Preferred provider:

```text
Open-Meteo Geocoding API
```

Flow:

```text
City
→ Geocoding
→ latitude
→ longitude
→ resolved location
```

If multiple cities match:

- prefer a clear match
- otherwise ask for clarification
- do not silently choose an important wrong location

---

## Phase 30 — Weather Provider Integration

Implement:

```text
weatherService.js
```

Call Open-Meteo from the backend.

Frontend must never call the weather provider directly.

Flow:

```text
React
→ Express
→ Weather Service
→ Open-Meteo
→ Weather Mapper
→ React
```

---

## Phase 31 — Weather Data Mapping

Normalize provider data to the internal WeatherGPT format.

Do not expose unnecessary provider-specific fields.

Handle:

- missing values
- invalid values
- unexpected response
- timeout
- provider failure
- rate limiting

---

## Phase 32 — Weather Controller + Route

Implement:

```http
GET /api/weather?city=Jodhpur
```

Controller should:

1. validate city
2. call service
3. return normalized JSON

Business logic remains in the service.

---

## Phase 33 — Forecast Service

Implement daily/hourly forecast using provider capabilities.

Keep the response frontend-friendly.

---

## Phase 34 — Forecast Controller + Route

Implement:

```http
GET /api/forecast?city=Jodhpur
```

Test:

- valid city
- unknown city
- provider failure
- missing fields

---

## Phase 35 — Official Alert Strategy

Integrate IMD warning data where the required API/data access is available.

Do not label ordinary forecast data as an official warning.

Response should contain source information.

If official warning data cannot be retrieved:

```text
No official alert data available.
```

---

## Phase 36 — Alert Service

Create:

```text
alertService.js
```

Responsibilities:

- resolve location
- retrieve official warning information
- normalize warning data
- preserve source
- preserve issue/validity information where available

---

## Phase 37 — Alert Controller + Route

Implement:

```http
GET /api/alerts?city=Jodhpur
```

Test success and unavailable-data behavior.

---

## Phase 38 — Request Validation

Validate:

- city required
- city length
- chat message required
- chat message maximum length
- request body type
- supported query parameters

Return structured errors.

Example:

```json
{
  "error": {
    "code": "INVALID_CITY",
    "message": "Please provide a valid city."
  }
}
```

---

## Phase 39 — Global Error Handling

Create:

```text
notFound.js
errorHandler.js
```

Handle:

- validation error
- weather API error
- alert API error
- database error
- LLM error
- timeout
- unexpected error

Do not expose secrets or stack traces.

---

## Phase 40 — Firebase Firestore Setup

Create a Firebase project and enable **Cloud Firestore**.

Install the Admin SDK:

```bash
npm install firebase-admin
```

Create:

```text
src/config/firebase.js
```

Configure Firebase using backend environment variables. Do not commit a service-account JSON file or private key.

Create:

```text
firestore/firestore-structure.md
```

Document the two initial collections:

```text
searchHistory
chatHistory
```

Do not create unnecessary collections or a relational schema.

## Phase 41 — Firebase Admin Initialization

Create the Firebase Admin initialization module in `src/config/firebase.js`. Initialize the Admin SDK once and expose the Firestore client to backend services.

Test Firestore connectivity with a minimal development read/write or a controlled initialization check. Remove any temporary test document if it is not needed.

The React frontend must never receive Firebase service-account credentials.

## Phase 42 — Search History

Implement model/service logic for:

```text
POST /api/history
GET /api/history
```

Only store required data.

---

## Phase 43 — Chat History

Implement storage for:

- user message
- assistant response
- city
- timestamp

Do not store unnecessary personal data.

---

# PHASE B AI

## Phase 44 — Query Understanding

Start with simple keyword/rule matching.

Example:

```text
"Will it rain in Jodhpur tomorrow evening?"
```

Extract:

```text
intent = precipitation forecast
location = Jodhpur
date = tomorrow
time = evening
variable = precipitation
```

Do not introduce a complex NLP framework unless needed.

---

## Phase 45 — Location and Time Resolution

Support:

- Today
- Tonight
- Tomorrow
- This weekend
- City names

Use the selected city when safe.

Ask for clarification when location is materially ambiguous.

---

## Phase 46 — Weather Reasoning

Create deterministic reasoning rules.

Examples:

```text
High rain probability
→ rain is likely

Very high temperature
→ hot conditions

Strong wind
→ windy conditions
```

The exact thresholds should be defined from actual project requirements and documented.

Do not make safety-critical claims from invented thresholds.

---

## Phase 47 — LLM Service

Implement:

```text
llmService.js
```

If OpenAI is selected:

- use the official server-side JavaScript SDK
- keep API key in environment variables
- send validated weather context
- return generated explanation

---

## Phase 48 — Grounded AI Prompt

System behavior:

```text
Use only supplied weather data.

Do not invent:
- temperature
- forecast
- rain probability
- official warnings
- observations
- source information

If data is missing, say it is unavailable.

Communicate uncertainty.

Distinguish official warnings from AI explanations.

Give concise, useful answers.
```

---

## Phase 49 — Chat Pipeline

Implement:

```text
POST /api/chat

User message
→ Query Understanding
→ Location/Time Resolution
→ Weather Retrieval
→ Validation
→ Weather Reasoning
→ LLM
→ Grounded Response
```

---

## Phase 50 — Chat Controller

Request:

```json
{
  "message": "Will it rain in Jodhpur tomorrow?",
  "city": "Jodhpur"
}
```

Response should contain at least:

```json
{
  "message": "Generated grounded response",
  "city": "Jodhpur",
  "source": "Open-Meteo"
}
```

Add uncertainty/source information where appropriate.

---

## Phase 51 — AI Failure Isolation

If LLM fails:

```text
Weather dashboard continues working.
```

Chat should return a clear error.

If possible, the backend can return a deterministic weather-data answer without LLM rather than failing the entire weather system.

---

# PHASE B CHECKPOINT

## Phase 52 — Backend API Testing

Use Postman.

Test:

```text
GET /api/health
GET /api/weather
GET /api/forecast
GET /api/alerts
POST /api/chat
GET /api/history
POST /api/history
```

Test:

- success
- invalid input
- unknown city
- external API failure
- timeout
- database failure
- LLM failure
- missing data

---

## Phase 53 — Backend Security Testing

Verify:

- no secrets in source
- no secrets in frontend
- .env ignored
- Firestore server-side validation
- validation
- safe errors
- CORS restrictions
- Helmet
- dependency audit

OWASP API Security Top 10 should be used as a security review checklist.

---

## Phase 54 — BACKEND CHECKPOINT

Only after all required APIs and failure cases work:

> BACKEND = COMPLETE

---

# PHASE C — FRONTEND + BACKEND INTEGRATION

## Phase 55 — Frontend API Service

Create/update:

```text
src/services/weatherApi.js
```

Functions:

```text
getWeather(city)
getForecast(city)
getAlerts(city)
sendChatMessage(message, city)
getHistory()
```

Keep network calls outside UI components.

---

## Phase 56 — Environment-Based API URL

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Production uses the production backend URL.

Do not hardcode URLs throughout components.

---

## Phase 57 — Connect Current Weather

Replace dummy data with:

```text
React
→ weatherApi.js
→ GET /api/weather
→ WeatherCard
```

Preserve the existing UI.

---

## Phase 58 — Connect Forecast

Replace dummy forecast.

Handle:

- loading
- success
- error
- empty

---

## Phase 59 — Connect Details

Connect:

- humidity
- wind
- pressure
- visibility
- sunrise
- sunset
- rain probability

Never display fake values for missing fields.

---

## Phase 60 — Connect Alerts

Connect AlertCard to:

```http
GET /api/alerts
```

Show:

- warning type
- source
- issue/validity information when available
- no-data state

---

## Phase 61 — Connect AI Chat

Connect:

```text
ChatBox
→ POST /api/chat
→ backend reasoning
→ LLM
→ ChatBox
```

Show:

- user message
- loading
- response
- error
- source/uncertainty where available

---

## Phase 62 — Suggested Questions

Use the same chat endpoint.

Do not create separate logic for suggested questions.

---

## Phase 63 — Browser Location

Optional/Should Have.

Flow:

```text
Browser Geolocation
→ latitude/longitude
→ backend location resolution
→ weather
```

If permission is denied:

```text
Manual city search remains available.
```

Never make location permission mandatory.

---

## Phase 64 — History

Connect:

```text
Frontend
→ Backend
→ Firebase Firestore
```

If history is unavailable:

```text
Core weather dashboard still works.
```

---

## Phase 65 — Loading and Error Mapping

Map backend errors to user-friendly frontend messages.

Never show:

```text
Error: AxiosError...
```

or raw stack traces.

---

## Phase 66 — Empty Data Handling

Examples:

```text
No forecast data available.
No official alert data available.
No history found.
Weather information unavailable.
```

Do not render broken cards.

---

## Phase 67 — API Contract Verification

Check exact field names.

Example:

```text
temperature
feelsLike
humidity
windSpeed
rainProbability
```

Frontend and backend must agree.

---

# PHASE C — COMPLETE SYSTEM TESTING

## Phase 68 — End-to-End Testing

Test:

1. Open application
2. Search Jodhpur
3. Receive current weather
4. Receive forecast
5. View official alert status
6. Ask weather question
7. Receive grounded answer
8. Search another city
9. Search invalid city
10. Simulate weather API failure
11. Simulate LLM failure
12. Simulate database failure
13. Test history
14. Test browser location
15. Test mobile
16. Test desktop
17. Refresh page
18. Repeat search
19. Test empty states
20. Test retry

---

## Phase 69 — Security + Reliability Review

Use the OWASP API Security Top 10 as a review framework.

Pay special attention to:

- broken authorization if accounts are introduced
- unrestricted resource consumption
- security misconfiguration
- improper API inventory
- unsafe third-party API consumption
- SSRF risks if arbitrary URLs ever become user-controlled

For this MVP, do not accept arbitrary provider URLs from users.

---

## Phase 70 — Production Readiness

Check:

- production environment variables
- database configuration
- HTTPS/TLS at deployment
- secure CORS
- Helmet
- dependency audit
- logging
- no debug stack traces
- frontend production build
- backend startup
- database connectivity
- provider availability

---

# 10. DEPLOYMENT EXECUTION

Deployment order:

```text
1. Create/configure the production Firebase project and Firestore database
2. Configure backend environment variables
3. Deploy Node.js + Express backend
4. Configure weather provider
5. Configure IMD integration
6. Configure LLM provider
7. Test production backend
8. Obtain backend URL
9. Set VITE_API_BASE_URL
10. Build React frontend
11. Deploy frontend
12. Test complete application
```

For Vite:

```bash
npm run build
```

The production build is suitable for static hosting.

For the Node backend:

```bash
npm start
```

Use a deployment environment that supports Node.js and configure the Firebase project and Firestore through secure backend environment variables.

Do not commit `.env`.

---

# 11. GIT STRATEGY

Branches:

```text
main
frontend-development
backend-development
```

Example commits:

```text
Create WeatherGPT React project
Add navbar
Add search bar
Add weather card
Add forecast UI
Add chat UI
Add loading and error states
Complete frontend checkpoint
Create Node Express backend
Add health API
Add weather service
Add forecast API
Add Firebase Firestore configuration
Add chat pipeline
Add LLM integration
Complete backend checkpoint
Connect frontend weather API
Connect forecast
Connect alerts
Connect chat
Complete integration testing
Prepare production deployment
```

Never merge untested work into main.

---

# 12. TWO-MEMBER TEAM DIVISION

## Member 1 — Frontend / Integration

Responsible for:

- React
- Vite
- UI components
- CSS
- responsive design
- dummy frontend
- frontend testing
- API service
- frontend/backend integration
- final UI testing

## Member 2 — Backend / AI / Database

Responsible for:

- Node.js
- Express
- REST APIs
- weather provider
- IMD alert integration
- Firebase Firestore
- query understanding
- weather reasoning
- LLM integration
- backend testing
- security

Both members should understand the complete architecture for viva.

---

# 13. 14-DAY EXECUTION SCHEDULE

## Day 1

Phases 1–4

- React/Vite
- structure
- navbar
- search

## Day 2

Phases 5–7

- weather card
- details
- forecast

## Day 3

Phases 8–10

- alerts
- chat
- suggested questions

## Day 4

Phases 11–14

- loading
- errors
- empty state
- retry

## Day 5

Phases 15–18

- mock data
- state
- chat state
- responsive design

## Day 6

Phases 19–21

- UI cleanup
- accessibility basics
- frontend cleanup

## Day 7

Phase 22

> FRONTEND CHECKPOINT

Do not proceed until passed.

## Day 8

Phases 23–27

- Node.js
- Express
- server
- health
- security foundation

## Day 9

Phases 28–34

- HTTP client
- geocoding
- weather
- forecast

## Day 10

Phases 35–43

- alerts
- validation
- error handling
- Firebase Firestore
- history

## Day 11

Phases 44–51

- query understanding
- location/time
- reasoning
- LLM
- chat

## Day 12

Phases 52–54

> BACKEND TESTING + BACKEND CHECKPOINT

## Day 13

Phases 55–67

- frontend API service
- weather
- forecast
- alerts
- chat
- history
- errors
- contracts

## Day 14

Phases 68–70

- complete testing
- security
- production readiness
- deployment preparation

Then documentation and viva preparation.

---

# 14. FINAL TEST MATRIX

| Area | Test |
|---|---|
| Frontend | Loads |
| Search | Valid city |
| Search | Invalid city |
| Weather | Current data |
| Forecast | Daily/hourly |
| Alerts | Official source |
| Chat | Basic question |
| Chat | Forecast question |
| Chat | Location question |
| Chat | Missing data |
| Chat | LLM failure |
| Database | Connection |
| Database | Insert |
| Database | Read |
| API | 400 errors |
| API | 404 errors |
| API | 500 errors |
| Weather API | Timeout |
| Weather API | Rate limit |
| Responsive | Desktop |
| Responsive | Tablet |
| Responsive | Mobile |
| Security | Secrets hidden |
| Security | Firestore server-side validation |
| Security | CORS |
| Security | Helmet |
| Production | Build |
| Production | Deployment |

---

# 15. FINAL VIVA ARCHITECTURE EXPLANATION

A simple answer:

> WeatherGPT is a conversational weather assistant. The React frontend provides the user interface. The Node.js and Express backend receives requests and communicates with external weather services, official warning sources, Firebase Firestore, and the LLM. Weather data is retrieved and validated first. Simple deterministic reasoning is then applied, and the LLM converts the validated information into a natural-language explanation. The LLM is not treated as the source of weather facts. This architecture reduces hallucination and keeps API keys and Firebase credentials on the server.

---

# 16. IMPORTANT VIVA QUESTIONS

## Why React?

Because it provides reusable UI components and simple state management for an interactive dashboard.

## Why Node.js?

Because the project already uses JavaScript on the frontend, so Node.js allows the team to use JavaScript for backend development as well.

## Why Express?

Express provides a simple REST API framework without unnecessary enterprise complexity.

## Why Firebase Firestore?

It provides a managed NoSQL document database that is simple for a student MVP, avoids running a separate database server, and fits small search-history and chat-history documents.

## Why is the weather API called from the backend?

To keep provider credentials and integration logic away from the browser.

## Why not let the LLM predict weather?

Because an LLM should explain validated weather data, not replace a real weather-data provider.

## What is grounding?

Grounding means giving the LLM validated external facts and restricting its answer to that supplied context.

## What happens if the weather API fails?

The backend returns a controlled error and the frontend displays a user-friendly message.

## What happens if the LLM fails?

The weather dashboard remains available. Chat can return a controlled error or a deterministic weather-data response when appropriate.

## What happens if browser location permission is denied?

Manual city search remains available.

## Why use deterministic reasoning?

Simple weather conclusions can be calculated directly from real data instead of relying on probabilistic LLM generation.

---

# 17. FINAL PROJECT CHECKLIST

## Frontend

- [ ] React/Vite setup
- [ ] Navbar
- [ ] Search
- [ ] Current weather
- [ ] Details
- [ ] Forecast
- [ ] Alerts
- [ ] Chat
- [ ] Suggested questions
- [ ] Loading
- [ ] Error
- [ ] Empty state
- [ ] Retry
- [ ] Responsive layout
- [ ] No console errors

## Backend

- [ ] Node.js 24 LTS
- [ ] Express 5
- [ ] Health API
- [ ] Weather API
- [ ] Forecast API
- [ ] Alert API
- [ ] Chat API
- [ ] Validation
- [ ] Error handling
- [ ] CORS
- [ ] Helmet
- [ ] External API timeout
- [ ] Provider failure handling

## Database

- [ ] Firebase Firestore
- [ ] firebase-admin
- [ ] Firebase Admin initialization
- [ ] Firestore collection/document design
- [ ] Search history
- [ ] Chat history
- [ ] Server-side Firestore document validation

## AI

- [ ] Query understanding
- [ ] Location resolution
- [ ] Time resolution
- [ ] Weather reasoning
- [ ] LLM service
- [ ] Grounded prompt
- [ ] No fabricated weather facts
- [ ] Uncertainty handling

## Integration

- [ ] Frontend API service
- [ ] Environment-based URL
- [ ] Weather connected
- [ ] Forecast connected
- [ ] Alerts connected
- [ ] Chat connected
- [ ] History connected
- [ ] Errors mapped
- [ ] Loading mapped
- [ ] Empty data handled

## Security

- [ ] No API keys in React
- [ ] No secrets in Git
- [ ] `.env` ignored
- [ ] Firestore server-side validation
- [ ] Input validation
- [ ] CORS restricted
- [ ] Helmet
- [ ] Dependency audit
- [ ] No raw stack traces
- [ ] HTTPS in production

## Deployment

- [ ] Production Firebase project and Firestore
- [ ] Backend deployed
- [ ] Environment variables configured
- [ ] Weather provider tested
- [ ] IMD integration tested
- [ ] LLM tested
- [ ] Frontend built
- [ ] Frontend deployed
- [ ] End-to-end production test

## Documentation

- [ ] README
- [ ] Architecture diagram
- [ ] ER diagram
- [ ] API documentation
- [ ] Screenshots
- [ ] Testing report
- [ ] Project report
- [ ] Presentation
- [ ] Viva notes

---

# 18. FINAL GOLDEN RULE

The project is not successful because it contains the most technologies.

It is successful when:

```text
Reliable Weather Data
        ↓
Correct Location + Time
        ↓
Validation
        ↓
Simple Weather Reasoning
        ↓
Grounded AI Explanation
        ↓
Clear React Interface
```

The final system must be:

- simple
- functional
- reliable
- explainable
- secure
- student-friendly
- testable
- deployable
- easy to demonstrate in a viva

> COMPLETE FRONTEND FIRST
>
> COMPLETE NODE.JS + EXPRESS BACKEND + DATABASE SECOND
>
> CONNECT EVERYTHING THIRD
>
> TEST EVERYTHING
>
> DEPLOY LAST