# WeatherGPT — Complete Part B Backend Implementation Master Prompt

## Purpose

This is the **single autonomous execution prompt for the remaining Part B backend work**.

The coding agent must execute the entire remaining backend implementation in one continuous run. It must **not stop after one phase, ask for permission, request confirmation for routine file reads/edits, or ask the user to approve the next phase**.

The agent must inspect the existing repository and the already completed Part B Phase 1 implementation before changing anything.

---

# 1. NON-NEGOTIABLE AUTONOMOUS EXECUTION RULES

- Execute all sections of this document from start to finish.
- Do not ask for permission to inspect files.
- Do not ask for permission to install dependencies.
- Do not ask for permission to create/edit/delete project files when required by this specification.
- Do not pause after each phase for confirmation.
- If an implementation error occurs, diagnose and fix it autonomously.
- Continue until all feasible requirements and automated tests are complete.
- Do not create a second frontend or second project.
- Preserve the existing frontend UI, theme, responsive behavior, routes, features, and working functionality.
- Do not redesign the frontend unless integration requires a minimal compatibility change.
- Do not introduce TypeScript, NestJS, GraphQL, Redux, an ORM, or other unnecessary architecture.
- Keep the backend understandable for a college/SIH project and viva.
- Never print, expose, hardcode, or commit real secrets.
- Never invent provider/API credentials.
- Never invent weather values.
- Never store live weather as the primary source of truth in Firestore.
- Do not push to GitHub.
- A final Git commit is allowed only after all verification passes.
- Do not modify unrelated files.
- Do not claim a feature is complete unless actually implemented and verified.
- If a provider/key is unavailable, implement a clean provider abstraction and a clear configuration/error path rather than fabricating data.
- At the end, produce a complete machine/test-backed final report.

---

# 2. CURRENT PROJECT STATE

WeatherGPT already has a mature React/Vite frontend.

Existing capabilities include:

- Dashboard
- real weather retrieval
- location search and explicit current-location flow
- hourly/daily forecast and graph
- alerts
- WeatherGPT AI
- EN / HI / Hinglish
- eight context modes
- Leaflet + OpenStreetMap map
- Open-Meteo weather/geocoding
- Air Quality
- historical weather
- saved/favorite locations
- comparison
- timeline
- smart guidance
- share card
- dashboard personalization
- Sun & Moon
- History
- Settings
- How WeatherGPT Works
- responsive layouts
- accessibility-oriented controls
- existing automated tests

The frontend was previously verified at 34/34 automated tests passing and production build passing.

Part B Phase 1 has already been completed. Treat the existing backend as the foundation.

Existing project documentation includes:

- `docs/WeatherGPT-Frontend-Current-State.md`
- `docs/WeatherGPT-Backend-Phase-1.md` (if present)

The repository already contains backend, Express, Firebase Admin/Firestore foundation, environment examples, validation/error handling, and API foundation.

Read the actual repository instead of assuming exact file names.

---

# 3. SOURCE OF TRUTH BEFORE IMPLEMENTATION

Inspect first:

1. `docs/WeatherGPT-Frontend-Current-State.md`
2. `docs/WeatherGPT-Backend-Phase-1.md` if present
3. `frontend/package.json`
4. `backend/package.json`
5. all backend source files
6. `frontend/src/services/`
7. weather/location/chat/history/saved-location/settings implementations
8. existing tests
9. root/frontend/backend `.gitignore`
10. environment examples

Determine actual providers, environment variables, data models, and contracts from the code.

Do not overwrite working code merely to match a hypothetical structure.

---

# 4. TARGET FINAL ARCHITECTURE

```text
React Frontend
      |
      | REST / JSON
      v
Node.js + Express API
      |
      +----------------+----------------+
      |                |                |
      v                v                v
Weather APIs       Firestore          AI/LLM
Live telemetry     User data          Grounded chat
      |                |                |
      +----------------+----------------+
                       |
              Validation / Normalization
                       |
                       v
                Frontend response
```

Responsibilities:

### Weather providers
Source of truth for live/forecast/historical telemetry.

### Firestore
Persistent application/user data.

### Backend
API boundary, validation, provider calls, normalization, persistence, chat orchestration, security, error handling.

### Frontend
UI, interaction, rendering, visualization, presentation state.

---

# 5. EXECUTE ALL REMAINING PART B WORK

Do not stop after individual sections. Execute everything below in one autonomous run.

---

# 6. WEATHER API BACKEND

Implement:

```text
GET /api/v1/health
GET /api/v1/weather
GET /api/v1/forecast
GET /api/v1/historical
GET /api/v1/locations/search
```

Use the actual providers already used by the frontend. Prefer the existing Open-Meteo/OpenStreetMap ecosystem unless repository inspection proves another configured provider is required.

## Current weather

Support normalized data for:

- location
- temperature
- apparent temperature
- humidity
- precipitation/rain
- precipitation probability
- wind speed/direction
- pressure
- cloud cover
- UV where available
- WMO/weather condition
- AQI where available

Never fabricate missing values. Return explicit unavailable/null states.

## Forecast

Support:

- hourly forecast
- daily forecast
- temperature
- apparent temperature where available
- precipitation probability
- precipitation
- wind
- humidity
- weather code
- sunrise/sunset where available
- UV where available

Create one stable WeatherGPT schema.

---

# 7. HISTORICAL WEATHER BACKEND

Implement:

```text
GET /api/v1/historical
```

Support:

- latitude
- longitude
- start date
- end date
- optional location name

Use the existing historical provider and preserve ERA5/reanalysis semantics if that is what the frontend currently uses.

Validate ISO dates, date ordering, reasonable range, latitude and longitude.

Return:

- source
- location
- date range
- daily historical values
- useful summary statistics

Do not present reanalysis as identical to station observation.

---

# 8. LOCATION SEARCH BACKEND

Implement:

```text
GET /api/v1/locations/search?q=
```

Return normalized:

```json
{
  "name": "...",
  "country": "...",
  "admin1": "...",
  "latitude": 0,
  "longitude": 0
}
```

Requirements:

- validate query
- use existing provider
- handle empty results
- handle provider failures
- no hardcoded default city
- reusable reverse-geocoding service if current-location support needs it

---

# 9. FIRESTORE PERSISTENCE

Complete Firestore services using the Phase 1 schema where applicable.

## users

```text
users/{userId}
```

Store:

- userId
- displayName/email where available
- language
- contextMode
- temperatureUnit
- theme
- createdAt
- updatedAt

## searchHistory

```text
searchHistory/{searchId}
```

Store:

- userId
- query
- normalized location
- latitude
- longitude
- searchedAt

Implement create/list with sensible limit/order.

## savedLocations

```text
savedLocations/{locationId}
```

Store:

- userId
- name
- city
- country
- latitude
- longitude
- createdAt

Implement create/list/delete and duplicate protection.

## chatHistory

```text
chatHistory/{chatId}
```

Store:

- userId
- sessionId
- message
- response
- intent
- location
- createdAt

Do not store hidden chain-of-thought.

## alertPreferences

```text
alertPreferences/{userId}
```

Persist existing alert preferences.

## dashboardPreferences

If dashboard personalization exists in the current frontend, persist it:

```text
dashboardPreferences/{userId}
```

Store visible sections, section order, updatedAt.

Keep localStorage fallback.

Use server timestamps where appropriate.

---

# 10. AUTH-READY DESIGN

Do not build a complex authentication system unless Firebase Authentication is already configured.

All persistence services must use a clear `userId` boundary.

If Firebase Auth already exists, integrate it correctly.

If not, document the current development/demo identity limitation and do not pretend unauthenticated clients are securely authenticated.

Never allow production users to access another user's data.

---

# 11. WEATHERGPT AI BACKEND

Implement:

```text
POST /api/v1/chat
```

Support the current frontend's chat contract, including message, location, contextMode, language, and sessionId where applicable.

Pipeline:

```text
User Message
→ Validation
→ Intent Detection
→ Location Resolution
→ Weather Retrieval
→ Data Validation
→ Weather Reasoning
→ AI Explanation (if configured)
→ Grounded Response
→ Source/Freshness Metadata
```

Never expose hidden chain-of-thought.

Return concise reasoning/explanation metadata only.

If no LLM provider is configured, provide a deterministic grounded response path so the feature remains usable.

---

# 12. CHAT INTENTS

Preserve the existing advanced intent set, including:

- current weather
- forecast
- rain
- temperature
- wind
- humidity
- AQI
- UV
- alert
- travel
- outdoor activity
- farming
- health
- weather risk
- comparison
- historical weather
- saved locations
- sun/moon
- guidance
- timeline

Avoid generic keyword collisions. Specialized intents must remain distinct.

---

# 13. AI GROUNDING RULES

Enforce:

```text
retrieve → validate → reason → generate
```

Rules:

- no invented current weather
- no invented official warnings
- clear AI-generated guidance label
- official warnings remain separate
- source/freshness metadata preserved
- uncertainty not presented as certainty
- unavailable data stated explicitly
- WeatherGPT never represented as an official disaster authority

---

# 14. CONTEXT MODES

Preserve:

1. General
2. Farmer
3. Traveler
4. Outdoor
5. Emergency
6. Commuter
7. Event Planner
8. Fitness / Sports

Context changes explanation/recommendation style, not factual telemetry or official alert severity.

---

# 15. MULTILINGUAL SUPPORT

Preserve:

- English
- Hindi
- Hinglish

Accept language in relevant backend requests. Keep the architecture extensible for future Indian languages.

Do not duplicate frontend translation data unnecessarily.

---

# 16. ALERT BACKEND

Implement backend support for existing alert behavior.

Use:

```text
GET /api/v1/alerts
```

or integrate alerts into an existing weather response if that is cleaner.

Never invent official alerts.

If verified official alert data is unavailable, return a clear unavailable/no-verified-alert state and keep AI guidance separate.

Persist alert preferences in Firestore.

---

# 17. SAVED LOCATIONS API

Implement:

```text
GET    /api/v1/locations/saved
POST   /api/v1/locations/saved
DELETE /api/v1/locations/saved/:id
```

Support validation, duplicate protection, save/list/delete, and user scoping.

Keep localStorage fallback until authenticated persistence is fully established.

---

# 18. SEARCH HISTORY API

Implement:

```text
GET  /api/v1/history/search
POST /api/v1/history/search
```

Support recent history, limits, ordering, validation, and user scoping.

---

# 19. CHAT HISTORY API

Implement:

```text
GET  /api/v1/history/chat
POST /api/v1/history/chat
```

Support sessionId, limits/pagination, ordering, validation, and user scoping.

Never expose hidden reasoning.

---

# 20. USER SETTINGS API

Implement where compatible:

```text
GET   /api/v1/user/settings
PATCH /api/v1/user/settings
```

Support existing:

- language
- temperature unit
- theme
- context mode
- dashboard preferences
- alert preferences

Keep localStorage fallback.

---

# 21. FRONTEND INTEGRATION

After backend verification, integrate the existing frontend with Express.

Create/update one backend API boundary, e.g.:

```text
frontend/src/services/backendApi.js
```

or extend the existing service layer.

Move appropriate flows behind Express:

- current weather
- forecast
- historical weather
- location search
- saved locations
- search history
- chat
- settings
- alert preferences

Do not move purely visual calculations unnecessarily.

Do not break the current frontend data model.

---

# 22. FALLBACK AND ERROR UX

If backend is unavailable:

- show clear unavailable/error state
- preserve existing retry behavior
- do not silently show fake live weather
- use existing provider fallback only where already intentionally designed

A backend failure must never look like successful live telemetry.

---

# 23. SECURITY

Implement:

- environment-only secrets
- restricted CORS
- request validation
- safe errors
- no secret logging
- Firestore user scoping
- sensible request limits/timeouts
- no private keys in frontend

Verify `.env` and secret files are ignored while `.env.example` remains trackable.

---

# 24. PERFORMANCE

Use reasonable safeguards:

- external API timeout
- avoid duplicate provider calls
- avoid unnecessary Firestore writes
- query limits
- no full collection reads for history
- singleton Firebase initialization
- no unnecessary blocking during startup

Do not add complex caching unless clearly justified by the current implementation.

---

# 25. COMPLETE AUTOMATED QA

Run all available tests automatically.

## Backend

Test:

- health
- routes
- validation
- weather normalization
- forecast normalization
- historical validation
- location search
- Firestore service boundaries
- saved locations
- history
- chat validation
- chat grounding
- settings
- error handling
- unknown routes
- CORS where practical

## Frontend

Run all existing tests and ensure no regression.

## Build

Run frontend production build and backend startup validation.

## Integration

Where practical verify:

- health
- weather
- forecast
- location search
- historical
- saved locations
- search history
- chat
- settings

Use mocks/test doubles where real credentials are unavailable. Never make tests depend on real secrets.

---

# 26. BROWSER/E2E VERIFICATION

If existing browser automation is available, run it.

Verify:

- Dashboard loads and weather works
- Search works
- explicit location flow works
- map works and stays synchronized
- WeatherGPT AI opens/submits/renders
- context mode works
- language works
- saved locations work
- historical page works
- settings work
- no runtime console exceptions
- no major horizontal overflow

Representative widths:

- 320
- 360
- 390
- 768
- 1280

---

# 27. REGRESSION PROTECTION

Preserve all existing:

- routes
- sidebar/mobile navigation
- WeatherGPT AI naming
- theme
- responsive CSS
- dashboard hierarchy
- map
- historical
- comparison
- timeline
- smart guidance
- saved locations
- share card
- personalization
- Sun & Moon
- How WeatherGPT Works
- language switching
- context synchronization

Do not remove working functionality because backend integration exists.

---

# 28. DOCUMENTATION

Create/update:

```text
docs/WeatherGPT-Backend-Complete.md
docs/WeatherGPT-Part-B-Final-Report.md
```

Document:

- final architecture
- backend structure
- environment variables
- providers
- Firestore collections
- schemas
- every implemented API
- request/response examples
- errors
- chat pipeline
- AI grounding
- security
- frontend integration
- local development
- tests
- deployment preparation
- limitations
- future authentication path
- viva explanation

Update `docs/WeatherGPT-Frontend-Current-State.md` only where needed for final integration.

---

# 29. FINAL API FAMILY

Aim for this final family, adapting to existing clean routes if needed:

```text
GET    /api/v1/health

GET    /api/v1/weather
GET    /api/v1/forecast
GET    /api/v1/historical
GET    /api/v1/locations/search
GET    /api/v1/alerts

POST   /api/v1/chat

GET    /api/v1/locations/saved
POST   /api/v1/locations/saved
DELETE /api/v1/locations/saved/:id

GET    /api/v1/history/search
POST   /api/v1/history/search

GET    /api/v1/history/chat
POST   /api/v1/history/chat

GET    /api/v1/user/settings
PATCH  /api/v1/user/settings
```

Document the actual final routes implemented.

---

# 30. DATABASE RULE

Do not put all frontend state into Firestore.

Firestore stores meaningful persistent user/application information only.

Do not store:

- every weather response
- every map render
- temporary UI state
- temporary chart state
- loading state

---

# 31. DEPLOYMENT READINESS

Prepare, but do not deploy.

Verify:

- production start command
- environment documentation
- configurable frontend URL
- no hardcoded localhost
- safe errors
- health endpoint
- hosting-compatible server binding

---

# 32. FINAL GIT CHECKPOINT

Only after all verification passes:

1. inspect `git status`
2. inspect `git diff`
3. confirm no secrets are tracked
4. confirm only relevant Part B files changed
5. create ONE commit:

```text
feat: complete WeatherGPT backend integration
```

Do not push.

---

# 33. FINAL REPORT

Create:

```text
docs/WeatherGPT-Part-B-Final-Report.md
```

Include actual results:

```text
Backend tests: XX/XX
Frontend tests: XX/XX
Integration tests: XX/XX
E2E/browser tests: XX/XX or NOT AVAILABLE
Frontend build: PASS/FAIL
Backend startup: PASS/FAIL
Health endpoint: PASS/FAIL
```

Also report:

- implemented modules
- routes
- Firestore collections
- chat/AI grounding
- security
- regression checks
- responsive checks
- known limitations
- exact final status

Use:

```text
PART B COMPLETE
```

only if acceptance criteria genuinely pass.

Otherwise use:

```text
PART B PARTIALLY COMPLETE
```

and list verified blockers.

---

# 34. FINAL ACCEPTANCE CRITERIA

Part B is complete only when:

[ ] Express backend works
[ ] Weather API works
[ ] Forecast works
[ ] Historical weather works
[ ] Location search works
[ ] Alerts work or provider limitation is documented
[ ] Firebase Admin works
[ ] Firestore persistence works
[ ] Saved locations work
[ ] Search history works
[ ] Chat history works
[ ] User settings persistence works
[ ] Dashboard preferences persistence works where applicable
[ ] Chat backend works
[ ] Intent/context handling is preserved
[ ] AI grounding is enforced
[ ] Official warning vs AI guidance separation is preserved
[ ] Validation works
[ ] Error handling works
[ ] CORS works
[ ] Secrets remain private
[ ] Frontend integration works
[ ] Existing frontend tests pass
[ ] Backend tests pass
[ ] Integration tests pass where available
[ ] Browser/E2E tests pass where available
[ ] Frontend production build passes
[ ] Backend starts successfully
[ ] No major runtime console errors
[ ] No major horizontal overflow regression
[ ] Documentation is complete
[ ] Final QA report is generated
[ ] Git checkpoint is created
[ ] No GitHub push is performed

---

# 35. CRITICAL EXECUTION BEHAVIOR

This is a **single master execution**.

Never stop with:

> "Phase complete. Shall I continue?"

Never ask:

> "Can I install dependencies?"

Never ask:

> "Should I modify the frontend?"

Never stop after creating only the backend foundation.

Continue automatically through:

```text
Backend
→ Weather APIs
→ Firestore
→ Chat
→ Persistence
→ Frontend integration
→ Security
→ Testing
→ Browser verification
→ Documentation
→ Final report
→ Git checkpoint
```

If a real external credential is unavailable:

1. never fabricate it;
2. implement everything else;
3. use safe mocks/test doubles for automated tests;
4. document the exact credential-dependent limitation;
5. continue all remaining work;
6. run every available test;
7. issue the final report.

Make reasonable engineering decisions autonomously.

## START THE COMPLETE REMAINING PART B IMPLEMENTATION NOW.
