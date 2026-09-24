# WeatherGPT — Part A Advanced Enhancement Master Prompt
## A11–A22 One-Shot Antigravity Implementation

### Purpose

The existing WeatherGPT Part A A1–A10 frontend is already implemented and verified. This prompt is an **extension pass**, not a rebuild.

Preserve all working A1–A10 functionality and implement A11–A22 as one continuous execution.

**A11 → A12 → A13 → A14 → A15 → A16 → A17 → A18 → A19 → A20 → A21 → A22**

Do not stop for approval between steps.

Workflow:

**Inspect → Plan → Implement → Run → Verify → Fix → Re-run → Final checkpoint**

---

## 1. Current A1–A10 Baseline

The existing frontend already contains:

- React + Vite + JavaScript/JSX + CSS
- dashboard
- smart/natural search
- current weather
- weather details
- hourly forecast
- 7-day forecast
- temperature graph
- alerts
- AI chat
- voice input/fallback
- history
- settings
- browser geolocation
- light/dark/system theme
- Celsius/Fahrenheit
- km/h/mph
- localStorage persistence
- responsive layout
- accessibility basics
- loading/error/empty/retry states
- normalized dummy data
- future API abstraction

The existing report confirms `npm test` passed 6/6 and `npm run build` passed with 0 errors/warnings.

**Do not unnecessarily rewrite stable A1–A10 code.**

---

# 2. Technology Boundary

Continue using:

- React
- Vite
- JavaScript
- JSX
- CSS
- useState/useEffect
- simple custom hooks
- localStorage
- browser Geolocation API
- Web Speech API where supported

Do NOT add:

- TypeScript
- Redux/Zustand
- Next.js
- unnecessary frameworks
- Node.js/Express
- Firebase/Firestore
- real weather APIs
- real LLM APIs
- real API keys
- production push notifications

This remains **Part A frontend-only**.

---

# 3. Critical Weather Trust Rule

Part A uses dummy/mock data only.

Never create fake real-world government warnings.

Never present demo alerts as genuine live official warnings.

Keep a strict visual distinction between:

**OFFICIAL WARNING**

and

**WEATHERGPT AI EXPLANATION**

The LLM/AI layer must be presented as an explanation layer, not as an authoritative weather source.

Future Part B will connect real weather and warning sources.

---

# A11 — Advanced Conversational Weather Experience

Upgrade the existing chatbot from a normal chat interface into a richer weather assistant.

### Query understanding UI

For:

> “Kal Jodhpur mein baarish hogi?”

show:

- Location: Jodhpur
- Time: Tomorrow
- Intent: Rain Forecast
- Topic: Rain
- Status: Understanding question...

Then:

- Checking weather context...
- WeatherGPT response

This is a **frontend demo simulation**, not real NLP.

### Supported intents

Create a reusable intent model for:

- CURRENT_WEATHER
- FORECAST
- RAIN
- TEMPERATURE
- WIND
- HUMIDITY
- AQI
- UV
- ALERT
- TRAVEL
- OUTDOOR_ACTIVITY
- FARMING
- HEALTH
- WEATHER_RISK
- COMPARISON
- HISTORICAL_WEATHER

Use simple local keyword/rule matching in Part A.

Prepare a clean interface for Part B to replace it with real NLP.

### Rich response cards

Support:

- temperature
- condition
- rain probability
- wind
- humidity
- forecast window
- high/low
- alerts
- impact
- recommendation
- source
- freshness
- uncertainty

### Contextual follow-up demo

Example:

User: “Will it rain tomorrow?”

Assistant: “Tomorrow has a 65% rain probability.”

User: “What about evening?”

The demo engine should understand that “evening” refers to the previous tomorrow/rain context.

---

# A12 — Multilingual Weather UI

Add language selection in Settings and Chat.

Initial languages:

- English
- Hindi
- Hinglish

Prepare architecture for:

- Gujarati
- Marathi
- Tamil
- Telugu
- Bengali
- Kannada
- Malayalam
- Punjabi

For Part A, provide quality demo translations for important UI labels, suggested questions, and selected sample responses.

Persist language in localStorage.

Language should affect supported:

- navigation labels
- weather labels
- suggested questions
- chatbot demo responses
- alert labels
- settings labels

Show selected language in chat.

Do not falsely claim complete translation coverage.

---

# A13 — Impact-Based Weather Alert Experience

Upgrade existing alerts.

Retain severity levels:

- INFO
- ADVISORY
- WATCH
- HIGH
- SEVERE
- EXTREME

Add impact-oriented presentation.

Example:

**Heavy Rain**

Expected:
80–120 mm

Potential impacts:
- waterlogging possible
- low-lying roads may be affected
- travel delays possible

Recommended:
Consider avoiding unnecessary travel during peak rainfall.

Clearly separate:

**Official Warning**

from

**WeatherGPT AI Explanation**

Use demo data only.

---

# A14 — Forecast Confidence and Uncertainty

Add:

- rain probability
- confidence level
- forecast window
- uncertainty explanation

Example:

Rain probability: 70%

Confidence: High

Forecast window: 3 PM–6 PM

Example language:

“The likelihood of rain is high, but the exact timing may change.”

Use demo confidence values and do not imply they are statistically validated.

---

# A15 — “Why This Forecast?”

Add a reusable **Why this forecast?** interaction.

Example:

Why is rain expected?

Possible demo signals:

- increasing humidity
- high cloud coverage
- precipitation signal
- wind pattern

Structure:

**Signals → Weather reasoning → AI explanation**

Clearly label simulated content where appropriate.

Do not expose hidden chain-of-thought.

---

# A16 — Source + Data Freshness + Trust

Create reusable components for:

- source
- update time
- freshness
- AI explanation label
- official-warning attribution

Freshness states:

- Fresh
- Aging
- Stale

Example:

`Updated 8 minutes ago • Fresh`

For mock data, clearly indicate demo/mock status when needed.

In chat show:

**Sources used**

✓ Current weather  
✓ Forecast  
✓ Active alerts

**AI explanation:** WeatherGPT

Do not claim live verification in Part A.

---

# A17 — User Context Modes

Add:

- General
- Farmer
- Traveler
- Outdoor
- Emergency / Disaster

Each mode changes the information emphasis.

### General
Current weather, forecast, alerts.

### Farmer
Rain, humidity, temperature, wind.

### Traveler
Rain, visibility, wind, travel impact.

### Outdoor
UV, rain, heat, wind, AQI.

### Emergency / Disaster
Active alerts, severity, impact, official warning prominence.

Persist selected mode.

Recommendations must be clearly presented as general/demo guidance.

---

# A18 — Location-Aware Interactive Weather Map

This is a major advanced feature.

Create a reusable `WeatherMap` component.

## Core behavior

Show:

- selected location
- current-location marker
- temperature
- weather condition
- humidity
- rain probability
- wind
- alerts
- nearby locations

Part A must not require a real map API key.

If no live map provider is configured, create a polished simulated/map-style experience using local data and clear visual geography.

## Search → Map

Searching:

`Jodhpur`

must:

1. resolve the mock location
2. center/select Jodhpur
3. show Jodhpur marker
4. update dashboard context
5. update forecast context
6. update alert context
7. update chat context

## Map → Dashboard

Clicking a marker must update:

- selected location
- dashboard
- forecast
- alerts
- chat context

## Use My Location

Integrate existing browser geolocation.

Success:

`coordinates → mock nearest supported city → map → dashboard`

Denied/unavailable:

“Location unavailable. Search a city to view weather on the map.”

Do not unnecessarily expose raw coordinates.

## Map layers

Add layer controls:

- Temperature
- Rain
- Wind
- Clouds
- Alerts
- AQI

Use simulated local datasets in Part A.

## Accessibility

Provide:

- keyboard controls
- labels
- accessible markers
- selected-location text
- non-map alternative location list
- mobile-friendly controls

Users must never be forced to use the map to access weather information.

---

# A19 — Climate / Historical Weather

Add a climate/history UI using demo data:

- average temperature
- historical rainfall
- monthly pattern
- temperature trend
- rainfall trend

Clearly label demo data.

Prepare clean interface for future backend historical data.

---

# A20 — Smart Alert Preferences

Add preferences for:

Alert types:

- Heavy Rain
- Thunderstorm
- Extreme Heat
- Strong Wind
- Poor Air Quality
- Extreme Cold

Notification preference:

- Immediately
- Important only
- Daily summary

Persist with localStorage.

Do not implement real push notifications.

---

# A21 — Advanced Voice Experience

Improve existing Web Speech functionality.

States:

- Idle
- Listening
- Processing
- Success
- Unsupported
- Error

Example:

Listening...

“Kal Jodhpur mein baarish hogi?”

Then:

✓ Location detected  
✓ Time detected  
✓ Weather intent detected

Searching weather...

If unsupported:

“Voice input unavailable. You can type your question instead.”

If speech synthesis is supported, optionally add:

**Read response aloud**

Voice must remain optional.

---

# A22 — Trust / Reasoning Pipeline Demo

Add an optional **How WeatherGPT Works / Reasoning Pipeline** view.

Show only high-level user-safe stages:

**User Question**
↓
**Intent Detection**
↓
**Location Resolution**
↓
**Weather Retrieval**
↓
**Data Validation**
↓
**Weather Reasoning**
↓
**AI Explanation**
↓
**Answer + Sources + Uncertainty**

Do not expose hidden model chain-of-thought.

This feature is intended for user trust, demonstration and viva explanation.

---

# 4. Recommended Reusable Components

Create or refactor only where useful:

- ChatIntentCard
- ChatContextCard
- WeatherResponseCard
- ForecastResponseCard
- RainProbabilityCard
- AlertResponseCard
- SourceInfo
- FreshnessBadge
- ConfidenceBadge
- WhyForecastPanel
- RecommendationCard
- ReasoningPipeline
- LanguageSelector
- WeatherMap
- MapLayerSelector
- LocationContextCard
- UserContextModeSelector
- ClimateSummary

Reuse existing A1-A10 components whenever possible.

Avoid duplicate components.

---

# 5. Location State Model

Support:

- no-location
- searching
- selected-city
- current-location
- permission-requesting
- permission-denied
- unavailable
- error

Every state must have a usable UI.

---

# 6. Design Requirements

Maintain the existing:

- premium
- futuristic
- professional
- weather-adaptive
- light/dark/system
- subtle motion
- modern cards
- readable typography

Do not over-animate.

Do not reduce accessibility for visual effects.

Do not use color as the only indicator of:

- alert severity
- confidence
- freshness
- weather condition

---

# 7. Responsive Requirements

Verify:

- 360px mobile
- 390px mobile
- tablet
- desktop
- large desktop

Special attention:

- map
- chat
- language selector
- context mode selector
- alerts
- charts
- forecast scrolling
- bottom navigation
- panels/modals

No unwanted horizontal page overflow.

---

# 8. Accessibility

Verify:

- semantic HTML
- keyboard navigation
- visible focus
- ARIA labels
- ARIA live status where appropriate
- accessible dialogs
- accessible map controls
- non-color-only severity
- reduced-motion support
- readable contrast
- screen-reader-friendly status messages

---

# 9. Loading / Error / Empty / Retry

All advanced features need appropriate states.

Map:
- loading
- unavailable
- no location

Chat:
- processing
- error
- retry

Forecast:
- no data

Alerts:
- no active alerts

Location:
- denied
- unavailable
- error

Climate:
- no historical data

Language:
- fallback

---

# 10. Future API Boundary

Keep/improve the frontend API abstraction for Part B.

Prepare functions such as:

- `getWeather(location)`
- `getForecast(location)`
- `getAlerts(location)`
- `sendChatMessage(message, context)`
- `getHistory()`
- `getClimate(location)`
- `getMapWeather(location, layers)`

For Part A these return mock data only.

Part B will replace implementations without redesigning the UI.

---

# 11. Mock Data Model

Extend normalized deterministic mock data.

Location:

```js
{
  id,
  name,
  city,
  state,
  country,
  latitude,
  longitude
}
```

Weather:

```js
{
  location,
  temperature,
  condition,
  feelsLike,
  humidity,
  wind,
  rainProbability,
  pressure,
  visibility,
  uvIndex,
  cloudCover,
  dewPoint,
  aqi,
  sunrise,
  sunset,
  updatedAt,
  source
}
```

Alert:

```js
{
  id,
  severity,
  title,
  affectedArea,
  validFrom,
  validUntil,
  official,
  source,
  explanation,
  impact,
  guidance
}
```

Chat context:

```js
{
  location,
  intent,
  timeRange,
  language,
  mode
}
```

Confidence:

```js
{
  level,
  explanation
}
```

Keep fixtures deterministic and testable.

---

# 12. Testing

Run actual:

```bash
npm test
npm run build
```

Run lint if available.

Run the app if practical.

Manually verify:

1. Dashboard
2. Search
3. Search → map
4. Map → dashboard
5. Use my location → map
6. Permission denied
7. Advanced chat
8. Intent UI
9. Contextual follow-up
10. Multilingual UI
11. Impact alerts
12. Confidence
13. Why forecast
14. Sources/freshness
15. User modes
16. Climate
17. Alert preferences
18. Voice states
19. History
20. Settings
21. Theme
22. Units
23. Mobile
24. Keyboard accessibility
25. Loading/error/empty/retry
26. A1-A10 regression

Fix all discovered issues.

Never claim tests passed unless actually executed.

---

# 13. Regression Protection

A11-A22 must not break:

- A1-A10 search
- weather dashboard
- forecast
- alerts
- chat
- voice fallback
- history
- settings
- theme
- units
- geolocation
- mobile navigation
- accessibility
- loading/error/empty/retry
- build

Preserve stable behavior when integrating enhancements.

---

# 14. STRICTLY DO NOT START PART B/C

Do NOT implement:

- Node.js
- Express
- Firebase
- Firestore
- real weather APIs
- real alert APIs
- real LLM
- API keys
- server authentication
- production notifications
- backend persistence

These belong to Part B/C.

---

# 15. Final Acceptance Criteria

Only mark the advanced frontend complete after actual verification:

[PASS] A1-A10 preserved
[PASS] A11 Advanced Chat
[PASS] A12 Multilingual
[PASS] A13 Impact-Based Alerts
[PASS] A14 Confidence/Uncertainty
[PASS] A15 Why Forecast
[PASS] A16 Sources/Freshness/Trust
[PASS] A17 User Context Modes
[PASS] A18 Location-Aware Interactive Map
[PASS] Search → Map
[PASS] Map → Dashboard
[PASS] Geolocation → Map
[PASS] Map Layers
[PASS] A19 Climate/Historical UI
[PASS] A20 Alert Preferences
[PASS] A21 Advanced Voice
[PASS] A22 Trust/Reasoning Pipeline
[PASS] Responsive
[PASS] Accessibility
[PASS] Loading/Error/Empty/Retry
[PASS] Mock data only
[PASS] Future API boundary
[PASS] npm test
[PASS] npm run build
[PASS] No new runtime/console errors
[PASS] No Part B/C code

Final status:

**PART A ADVANCED — READY FOR PART B**

Only use this status after actual verification.

---

# 16. ANTIGRAVITY /plan COMMAND

```text
/plan

Read this WeatherGPT Part-A Advanced A11-A22 Master Prompt and inspect the complete existing A1-A10 workspace.

A1-A10 is already implemented and verified.

Do not rebuild stable A1-A10 functionality unnecessarily.

Create ONE complete implementation plan for A11-A22.

The plan must cover:
- existing files to reuse
- files to modify
- files to create
- advanced chatbot architecture
- intent/context UI
- multilingual architecture
- impact-based alert UI
- confidence/uncertainty
- why-forecast explanation
- source/freshness/trust
- user context modes
- location-aware interactive map
- search/map/dashboard synchronization
- geolocation/map synchronization
- climate/history UI
- alert preferences
- advanced voice
- high-level reasoning pipeline
- mock data
- future API boundary
- responsive/accessibility
- regression testing

Do NOT implement Part B or Part C.

After creating the plan, wait for approval.
```

---

# 17. EXECUTION COMMAND AFTER PLAN APPROVAL

```text
Proceed with the COMPLETE A11-A22 implementation now.

Implement:

A11 → A12 → A13 → A14 → A15 → A16 → A17 → A18 → A19 → A20 → A21 → A22

as ONE continuous execution.

Do not stop between A11-A22.
Do not ask for intermediate confirmation.

Workflow:

Inspect
→ Implement
→ Run
→ Verify
→ Fix
→ Re-run
→ Final checkpoint

Important:

- Preserve A1-A10.
- React + Vite + JavaScript/JSX + CSS.
- Dummy/mock data only.
- No backend.
- No Express.
- No Firebase.
- No Firestore.
- No real weather API.
- No real LLM.
- No API keys.
- No Part B.
- No Part C.
- Do not claim tests passed unless actually executed.

After implementation:

1. Run npm test if available.
2. Run npm run build.
3. Run lint if available.
4. Run the application if practical.
5. Inspect console/runtime errors.
6. Fix discovered issues.
7. Verify search ↔ map ↔ dashboard synchronization.
8. Verify geolocation states.
9. Verify advanced chatbot.
10. Verify multilingual UI.
11. Verify alert trust separation.
12. Verify responsive behavior.
13. Verify accessibility.
14. Verify A1-A10 regression.
15. Provide the final A11-A22 checkpoint.

Do not merely explain what should be implemented.

Actually modify the workspace and complete the implementation.
```

# END OF MASTER PROMPT
