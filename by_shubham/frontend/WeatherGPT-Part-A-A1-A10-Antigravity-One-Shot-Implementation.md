---
commandExecutionPolicy: sandbox
description: One-shot implementation specification for WeatherGPT Part
  A. Implement A1-A10 continuously in React + Vite + JavaScript/JSX +
  CSS using dummy data only, then verify and fix the complete frontend.
mainAgent: true
model: pro
name: weathergpt-part-a-frontend
subagent: false
---

# WeatherGPT --- Part A A1--A10 Antigravity One-Shot Implementation Master Prompt

## 0. CRITICAL EXECUTION RULE

**Implement A1 through A10 as ONE continuous task.**

A1--A10 are internal checkpoints, not separate approval gates.

The execution flow is:

``` text
Inspect workspace
→ Plan complete Part A
→ A1 Setup
→ A2 Design System
→ A3 Shell + Navigation
→ A4 Dashboard + Search + Current Weather
→ A5 Forecasts + Graphs + Details
→ A6 Alerts
→ A7 AI Chat + Voice
→ A8 History + Settings + Location
→ A9 Responsive + Accessibility + Motion + Polish
→ A10 Testing + Fixes + Final Checkpoint
```

Do **not** stop after A1/A2/etc. Do **not** ask for approval between A1
and A10. If planning mode creates an implementation-plan artifact,
review/approve that plan once and then execute the complete scope.

**Do not implement Part B or Part C.**

The finished frontend must work without Node.js/Express, Firebase, real
weather APIs, or LLM APIs.

------------------------------------------------------------------------

# 1. AGENT ROLE

Act as the primary senior React frontend implementation agent, UI/UX
engineer, responsive engineer, accessibility reviewer, and testing
engineer.

You must **inspect the actual workspace, implement the code, run
verification, fix issues, and leave a runnable frontend**. Do not return
only instructions or pseudocode.

Before editing:

1.  Inspect the repository.
2.  Inspect `package.json`.
3.  Inspect `src/`, existing routes, components and CSS.
4.  Preserve useful existing work.
5.  Reuse an existing React/Vite setup when appropriate.
6.  Avoid destructive rewrites unless required.

------------------------------------------------------------------------

# 2. PROJECT CONTEXT

**Product:** WeatherGPT --- AI-Powered Conversational Weather Assistant.

Design direction locked by the team:

-   Premium
-   Futuristic AI
-   Professional weather dashboard
-   Weather-adaptive visual atmosphere
-   Light + Dark + System theme
-   Dashboard-first experience
-   Natural location/weather search
-   °C/°F
-   km/h default wind unit
-   Graph + forecast cards
-   Advanced alert center
-   Official Warning vs AI Explanation clearly separated
-   Hybrid dashboard + dedicated AI chat
-   Rich weather-oriented AI responses
-   Search + chat history
-   Browser location UI
-   Voice input UI
-   Subtle weather animation
-   Subtle motion
-   Responsive desktop/tablet/mobile
-   Adaptive information density
-   Accessibility-first behavior

The UI must feel advanced, but the architecture must remain simple
enough for a college viva.

------------------------------------------------------------------------

# 3. TECHNOLOGY CONSTRAINTS

Use:

-   React
-   Vite
-   JavaScript
-   JSX
-   CSS
-   `useState`
-   `useEffect`
-   simple custom hooks
-   `fetch()` only as future API abstraction
-   Browser Geolocation API
-   Browser Web Speech API where supported
-   localStorage for Phase-A persistence

Avoid unless genuinely necessary:

-   Redux
-   Zustand
-   TypeScript
-   Next.js
-   large UI frameworks
-   microservices
-   WebSockets
-   complex state management
-   real weather API
-   real LLM API
-   backend services
-   exposed API keys

No backend dependency is allowed in Part A.

------------------------------------------------------------------------

# 4. TARGET INFORMATION ARCHITECTURE

``` text
WeatherGPT
├── Dashboard
│   ├── Navbar
│   ├── Smart Search
│   ├── Location Control
│   ├── Current Weather Hero
│   ├── Weather Details
│   ├── Hourly Forecast
│   ├── Forecast Graph
│   ├── Daily Forecast
│   ├── Weather Alerts
│   ├── AI Weather Summary
│   └── Suggested Questions
├── AI Chat
│   ├── Messages
│   ├── Rich Weather Responses
│   ├── Suggested Questions
│   ├── Voice Input
│   ├── Typing State
│   └── Error / Retry
├── History
│   ├── Search History
│   └── Chat History
├── Alerts
│   ├── Active Alerts
│   └── Alert Details
└── Settings
    ├── Theme
    ├── Temperature Unit
    ├── Wind Unit
    ├── Location
    └── Preferences
```

Use simple routing if already present or if it remains lightweight.
Otherwise use a clean view/page structure without introducing
unnecessary routing complexity.

------------------------------------------------------------------------

# 5. A1 --- PROJECT SETUP + ARCHITECTURE

Create or clean the frontend foundation.

Preferred structure:

``` text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── search/
│   │   ├── weather/
│   │   ├── alerts/
│   │   ├── chat/
│   │   ├── states/
│   │   └── common/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Chat.jsx
│   │   ├── History.jsx
│   │   ├── Alerts.jsx
│   │   └── Settings.jsx
│   ├── data/
│   │   ├── weatherData.js
│   │   ├── forecastData.js
│   │   ├── alertData.js
│   │   └── chatData.js
│   ├── hooks/
│   │   ├── useTheme.js
│   │   ├── useWeather.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── formatTemperature.js
│   │   ├── formatWind.js
│   │   └── weatherHelpers.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

Do not create empty files without purpose.

Acceptance:

-   app starts
-   build works
-   no first-load runtime errors
-   code is modular
-   no backend is required

------------------------------------------------------------------------

# 6. A2 --- DESIGN SYSTEM + GLOBAL CSS

Build the visual system before polishing individual screens.

Create centralized CSS tokens for:

-   primary/secondary text
-   surfaces
-   borders
-   weather accents
-   alert accents
-   spacing
-   radius
-   shadows
-   typography
-   focus
-   motion
-   breakpoints

Use a modern readable sans-serif stack.

## Theme

Support:

``` text
System
Light
Dark
```

Default: System.

Persist the manual selection.

## Weather-adaptive atmosphere

Support visual states:

``` text
Sunny
Cloudy
Rain
Storm
Snow
Night
```

Only subtle background/accent/atmospheric changes are allowed. Never
sacrifice contrast or readability.

## Design quality

Avoid:

-   childish UI
-   neon overload
-   excessive glassmorphism
-   giant gradients
-   excessive pills
-   decorative clutter
-   constant animation

Use Grid/Flexbox and responsive CSS. Avoid fixed heights that clip
content and avoid `!important` unless necessary.

------------------------------------------------------------------------

# 7. A3 --- APPLICATION SHELL + NAVIGATION

## Desktop

Create a compact premium navbar containing:

``` text
WeatherGPT
Dashboard
AI Chat
History
Alerts
Settings
Theme
Location
```

Clearly indicate active state without relying only on color.

## Mobile

Use a compact top bar and/or drawer plus bottom navigation:

``` text
Home
Chat
History
Alerts
```

Settings may live in the menu.

## Footer

Include:

-   WeatherGPT
-   AI weather assistant description
-   source information area
-   About
-   Privacy
-   Disclaimer

State that WeatherGPT is not an official disaster-warning authority.

------------------------------------------------------------------------

# 8. A4 --- DASHBOARD + SMART SEARCH + CURRENT WEATHER

## Dashboard principle

The application opens directly into weather utility, not a generic
marketing hero.

## Smart Search

Placeholder:

``` text
Search city or ask about weather...
```

Demo examples:

``` text
Jodhpur
Delhi
Mumbai
Weather in Jaipur tomorrow
Will it rain today?
Temperature in Jodhpur
How is the weather this evening?
```

Implement frontend-only behavior.

States:

``` text
Empty
Typing
Suggestions
Searching
Success
Invalid input
No result
Error
Retry
```

## Location

Button:

``` text
Use my location
```

States:

``` text
idle
requesting
success
denied
unavailable
error
```

Manual city search must always remain available.

## Current Weather Hero

Show:

``` text
Location
Updated time
Temperature
Condition
Feels like
Humidity
Wind
Rain probability
High / Low
```

Optional only when data exists:

``` text
Pressure
Visibility
UV
Cloud cover
Dew point
Sunrise
Sunset
AQI
```

Never invent optional values just to fill the card.

Use a normalized dummy object:

``` js
{
  location: { city, region, country },
  current: {
    temperature,
    feelsLike,
    condition,
    icon,
    humidity,
    windSpeed,
    rainProbability,
    pressure,
    visibility,
    uvIndex,
    cloudCover,
    dewPoint,
    sunrise,
    sunset,
    aqi
  },
  metadata: {
    source: "Demo Weather Data",
    updatedAt
  }
}
```

------------------------------------------------------------------------

# 9. A5 --- DETAILS + HOURLY + DAILY + GRAPH

## Weather Details

Use reusable metric cards for:

``` text
Humidity
Wind
Pressure
Visibility
UV Index
Rain Probability
Sunrise
Sunset
AQI
Cloud Cover
Dew Point
```

Render only available values.

## Hourly Forecast

Each item can show:

``` text
Time
Icon
Temperature
Rain probability
```

Use `.map()` and stable keys.

Desktop: timeline/cards + graph.

Mobile: horizontal scroll inside the forecast container.

## Daily Forecast

Each day:

``` text
Day
Condition
Icon
High
Low
Rain probability when available
```

## Graph

Implement a responsive temperature trend graph.

Prefer lightweight SVG/CSS over a heavy chart dependency if practical.

Requirements:

-   responsive
-   readable labels
-   accessible text alternative
-   dummy data only
-   no fake live claims

------------------------------------------------------------------------

# 10. A6 --- ADVANCED ALERT SYSTEM

Alerts are trust-critical.

Severity options:

``` text
INFO
ADVISORY
WATCH
HIGH
SEVERE
EXTREME
```

Do not communicate severity using color alone. Include label, icon and
text.

Alert fields:

``` text
title
severity
affected area
valid from
valid until
description
source
sourceType
aiExplanation
```

## Official vs AI

Visually separate:

``` text
OFFICIAL WARNING
Source: Official Weather Authority
```

from:

``` text
AI EXPLANATION
WeatherGPT interpretation based on available weather information.
```

Never present AI text as an official warning.

Never fabricate a government warning or official source.

Demo alert data must be explicitly marked as demo/mock data.

No-alert state:

``` text
No active weather alerts
There are currently no alerts in the demo data.
```

------------------------------------------------------------------------

# 11. A7 --- AI CHAT + RICH RESPONSES + VOICE

## Components

``` text
ChatBox
ChatMessage
SuggestedQuestions
VoiceInput
```

## Dashboard AI summary

Create a compact section:

``` text
WeatherGPT Summary

Today will remain hot and mostly clear.

Afternoon temperatures may reach 36°C.

Tip:
Stay hydrated during peak afternoon heat.
```

It must be clear that Phase A is simulated/demo behavior.

## Dedicated chat

Include:

-   header
-   conversation
-   user messages
-   assistant messages
-   rich weather responses
-   suggested questions
-   voice input
-   composer
-   typing/loading
-   error/retry

Rich response can contain:

``` text
Current conditions
Temperature
Rain
Later today
Tip
Data context
```

Do not build a generic chatbot unrelated to weather.

## Suggested questions

Initial:

``` text
What's the weather today?
Will it rain today?
What's the temperature?
What's the forecast?
```

Weather-aware:

``` text
How hot will it get this afternoon?
Will it cool down tonight?
Will it rain later?
Should I plan outdoor activities?
```

## Chat states

Implement:

``` text
Empty
User message
Assistant message
Typing
Loading
Error
Retry
Long response
No answer
```

Blank messages must be blocked.

## Voice

Use Web Speech API where supported.

Flow:

``` text
Tap microphone
→ Listening
→ Speech-to-text
→ Text appears in input
→ User verifies/edits
→ User sends
```

Never auto-submit recognized speech.

Unsupported state:

``` text
Voice input is not available in this browser.
You can continue using text.
```

------------------------------------------------------------------------

# 12. A8 --- HISTORY + SETTINGS + LOCATION

## Search history

Persist locally.

Each record:

``` text
location
query
timestamp
```

Actions:

-   search again
-   view entry
-   clear history
-   empty state

## Chat history

Persist recent demo conversations locally.

Do not store unnecessary sensitive information.

## Settings

Implement:

``` text
Theme: System / Light / Dark
Temperature: °C / °F
Wind: km/h default
Location: current/manual
Preferences
```

Persist non-sensitive preferences with localStorage.

## Location

Geolocation must never block manual search.

------------------------------------------------------------------------

# 13. A9 --- RESPONSIVE + ACCESSIBILITY + MOTION + POLISH

Verify at approximately:

``` text
360px
390px
430px
768px
1024px
1280px
1440px+
```

## Mobile

Ensure:

-   no page-level horizontal overflow
-   search stays accessible
-   weather hero fits
-   forecasts scroll inside their own containers
-   buttons are touch-friendly
-   chat composer works
-   cards stack correctly
-   bottom nav does not cover content
-   long city/alert names wrap
-   footer remains readable

## Adaptive information density

Desktop can show more metrics simultaneously.

Mobile priority:

``` text
Location
→ Temperature
→ Condition
→ Essential metrics
→ Forecast
→ Alerts
→ AI assistant
```

Secondary metrics may collapse/scroll.

## Accessibility

Implement:

-   semantic HTML
-   accessible labels
-   keyboard navigation
-   visible focus
-   sufficient contrast
-   `aria-live` for dynamic chat/status where appropriate
-   severity not based on color alone
-   chart text alternative
-   useful error/empty messages
-   reduced-motion support

Use:

``` css
@media (prefers-reduced-motion: reduce)
```

## Motion

Use subtle transitions for:

-   card entrance
-   hover/focus
-   button feedback
-   skeletons
-   chat messages
-   expandable sections
-   weather atmosphere

Do not create distracting animations.

------------------------------------------------------------------------

# 14. A10 --- TESTING + FIXES

Do not consider "compiles" sufficient.

Run only commands supported by the actual `package.json`.

Typical:

``` bash
npm install
npm run build
npm run dev
```

If available:

``` bash
npm run lint
npm test
```

Fix real errors before completion.

## Search tests

-   empty
-   valid demo location
-   invalid location
-   repeated search
-   long location
-   natural-language demo query
-   loading
-   error
-   retry

## Weather tests

-   normal values
-   missing optional values
-   long city name

## Forecast tests

-   hourly
-   daily
-   graph
-   mobile scroll
-   long labels

## Alert tests

-   severity
-   official/demo warning presentation
-   AI explanation
-   no-alert
-   long title/description

## Chat tests

-   empty
-   user message
-   assistant message
-   suggested question
-   typing
-   loading
-   error
-   retry
-   long message
-   blank-message blocking

## Voice tests

-   microphone button
-   listening state
-   recognized text
-   edit before send
-   unsupported browser
-   voice error

## Location tests

-   request
-   success
-   denied
-   unavailable
-   manual fallback

## History tests

-   save
-   timestamp
-   search again
-   clear
-   empty

## Settings tests

-   System
-   Light
-   Dark
-   persistence
-   °C/°F
-   wind preference

## Responsive tests

-   mobile
-   tablet
-   desktop
-   no page overflow
-   mobile nav
-   footer

------------------------------------------------------------------------

# 15. DUMMY DATA ARCHITECTURE

Create:

``` text
src/data/weatherData.js
src/data/forecastData.js
src/data/alertData.js
src/data/chatData.js
```

Provide realistic demo fixtures for:

``` text
normal weather
rainy weather
night weather
weather with alert
weather without alert
weather with missing optional values
```

These are explicitly demo/test fixtures.

Never claim dummy values are live observations.

Components should consume props/state rather than duplicate weather
values.

------------------------------------------------------------------------

# 16. API BOUNDARY FOR FUTURE PHASE C

Create:

``` text
src/services/api.js
```

It may contain clearly marked Phase-A placeholder functions.

Future contract:

``` text
GET  /api/weather?city=...
GET  /api/forecast?city=...
GET  /api/alerts?city=...
POST /api/chat
GET  /api/history
```

Phase A must not call these real endpoints.

No API keys or secrets in frontend.

The UI should be replaceable from dummy data to real backend data
without rewriting the components.

------------------------------------------------------------------------

# 17. STATE MANAGEMENT

Use React local state.

Typical:

``` js
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [messages, setMessages] = useState([]);
const [theme, setTheme] = useState("system");
```

Use `useEffect` for theme/localStorage/geolocation side effects.

Do not introduce Redux/Zustand.

Avoid a giant `App.jsx`.

------------------------------------------------------------------------

# 18. ERROR / LOADING / EMPTY UX

Never show raw technical errors.

Bad:

``` text
TypeError: Cannot read properties of undefined
```

Good:

``` text
Weather data couldn't be loaded.
Please try again.
```

Create reusable:

``` text
Loading
ErrorMessage
EmptyState
RetryButton
```

Examples:

``` text
Loading weather...
Loading forecast...
Assistant is thinking...
```

``` text
Search for a city to view weather.
```

``` text
No active weather alerts.
```

``` text
No searches yet.
```

Every empty state should tell the user what to do next.

------------------------------------------------------------------------

# 19. COMPONENT QUALITY

Each reusable component should have one clear responsibility.

Recommended major components:

``` text
Navbar
MobileNav
Footer
SearchBar
SearchSuggestions
LocationButton
WeatherHero / WeatherCard
WeatherDetails
HourlyForecast
DailyForecast
WeatherChart
AlertCard
AlertBadge
AlertDetails
ChatBox
ChatMessage
SuggestedQuestions
VoiceInput
Loading
ErrorMessage
EmptyState
RetryButton
Card
Badge
IconButton
```

Do not create giant components or meaningless abstraction.

------------------------------------------------------------------------

# 20. CSS QUALITY

Prefer:

-   CSS variables
-   Flexbox
-   CSS Grid
-   responsive media queries
-   consistent spacing
-   consistent component classes
-   focus styles
-   logical breakpoints

Avoid:

-   inline styles everywhere
-   duplicate CSS
-   excessive absolute positioning
-   fixed heights that clip content
-   unnecessary `!important`

------------------------------------------------------------------------

# 21. TRUST / DATA PRESENTATION

Keep these visually distinct:

``` text
Weather data
AI explanation
Official warning
Demo/mock data
```

The eventual architecture is:

``` text
Retrieve
→ Validate
→ Normalize
→ Reason
→ Generate
→ Attribute source/uncertainty
```

Part A implements the UI contract for this architecture only.

------------------------------------------------------------------------

# 22. FINAL ACCEPTANCE CHECKLIST

## Foundation

-   [ ] React/Vite works
-   [ ] JavaScript/JSX
-   [ ] CSS system
-   [ ] No backend dependency
-   [ ] Build succeeds

## UI

-   [ ] Premium/futuristic/professional style
-   [ ] System/light/dark theme
-   [ ] Weather-adaptive atmosphere
-   [ ] Navbar
-   [ ] Mobile navigation
-   [ ] Footer
-   [ ] Dashboard
-   [ ] Search
-   [ ] Current weather
-   [ ] Weather details
-   [ ] Hourly forecast
-   [ ] Daily forecast
-   [ ] Forecast graph
-   [ ] Alerts
-   [ ] AI summary
-   [ ] Dedicated AI chat
-   [ ] Suggested questions
-   [ ] History
-   [ ] Settings
-   [ ] Location
-   [ ] Voice/fallback

## States

-   [ ] Loading
-   [ ] Error
-   [ ] Empty
-   [ ] Retry
-   [ ] Invalid input
-   [ ] Missing optional data
-   [ ] Location denied
-   [ ] Voice unavailable
-   [ ] Chat error
-   [ ] No alerts

## Quality

-   [ ] Keyboard navigation
-   [ ] Focus states
-   [ ] Contrast
-   [ ] Reduced motion
-   [ ] Responsive
-   [ ] No major console errors
-   [ ] Dummy data separated
-   [ ] Future API boundary
-   [ ] No secrets
-   [ ] No fake live claims

------------------------------------------------------------------------

# 23. FINAL WALKTHROUGH REQUIRED FROM THE AGENT

After implementation, report:

## Phase Completed

``` text
Part A — A1 to A10 completed in one continuous implementation.
```

## Files Created

List actual files.

## Files Modified

List actual files.

## What Was Implemented

Summarize real implementation.

## Verification

Report actual results for:

-   build
-   lint if available
-   tests if available
-   runtime
-   responsive checks
-   accessibility checks

Do not claim tests were run if they were not.

## Problems Found

List actual problems.

## Fixes Applied

List actual fixes.

## Final Checkpoint

Only mark PASS after verification:

``` text
[PASS] Foundation
[PASS] Design system
[PASS] Navigation
[PASS] Dashboard
[PASS] Forecast
[PASS] Alerts
[PASS] AI Chat
[PASS] History
[PASS] Settings
[PASS] Location
[PASS] Voice fallback
[PASS] Responsive
[PASS] Accessibility
[PASS] Loading/Error/Empty
[PASS] Dummy data
[PASS] Build
```

------------------------------------------------------------------------

# 24. ABSOLUTE DO-NOT LIST

Do not:

1.  implement backend;
2.  add Express;
3.  add Firebase;
4.  add real weather API keys;
5.  add real LLM keys;
6.  call real weather APIs;
7.  depend on backend availability;
8.  skip mobile;
9.  skip loading/error/empty;
10. stop after an intermediate A step;
11. ask for approval between A1 and A10;
12. replace the project with an unrelated template;
13. turn it into a generic weather clone;
14. show AI text as an official warning;
15. fabricate official warnings/sources;
16. duplicate mock values throughout JSX;
17. add unnecessary libraries;
18. expose secrets;
19. claim unverified tests passed;
20. start Part B.

------------------------------------------------------------------------

# 25. ANTIGRAVITY START COMMAND

If using Antigravity Planning Mode:

``` text
/plan

Implement WeatherGPT Part A A1-A10 as ONE continuous frontend deliverable according to the provided WeatherGPT Part A A1-A10 Antigravity Master Prompt.

First inspect the existing workspace and preserve useful work. Plan the complete frontend architecture, files, components, state, dummy data, responsive behavior, accessibility, testing, and verification.

After the implementation plan is approved, execute ALL A1-A10 continuously. Do not pause for intermediate approval between A1 and A10. Run the application/build/lint/tests that actually exist, fix issues, and finish at the complete Phase-A checkpoint.

Do NOT implement Part B, Part C, backend, Firebase, real weather APIs, or real LLM integration.
```

After approving the implementation plan:

``` text
Proceed with the COMPLETE A1-A10 implementation now.

Execute continuously:
Inspect → Implement → Run → Verify → Fix → Re-run → Final checkpoint.

Do not stop at intermediate A steps. Do not start Part B.
```

------------------------------------------------------------------------

# 26. FINAL PRINCIPLE

Build:

``` text
Advanced UI
+
Simple architecture
+
Realistic demo data
+
Strong UX
+
Responsive design
+
Accessibility
+
Clear trust boundaries
+
Backend-ready data contracts
+
Easy viva explanation
```

Do not optimize for maximum complexity.

Optimize for a frontend that is:

-   impressive in demonstration,
-   reliable,
-   responsive,
-   maintainable,
-   explainable,
-   ready for later backend integration.

# END --- WEATHERGPT PART A A1-A10 ONE-SHOT IMPLEMENTATION MASTER PROMPT
