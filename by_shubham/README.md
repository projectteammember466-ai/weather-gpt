# WeatherGPT — Conversational Weather Intelligence

WeatherGPT is an AI-powered conversational weather assistant providing real-time atmospheric intelligence, interactive geospatial weather maps, confidence & uncertainty signals, meteorological explainability, and multi-language support (English, Hindi, Hinglish).

## Project Structure

```
weather-gpt/
├── frontend/                                                   # React 18 + Vite 5 Frontend Application
│   ├── src/                                                    # Components, pages, hooks, state, utilities
│   │   ├── components/                                         # UI components (alerts, chat, map, weather, etc.)
│   │   ├── data/                                               # Mock datasets & translation dictionaries
│   │   ├── hooks/                                              # Custom React hooks (useWeather, useTheme, etc.)
│   │   ├── pages/                                              # Page views (Home, MapView, Chat, Alerts, etc.)
│   │   └── services/                                           # API service abstraction layer
│   ├── test/                                                   # Node test runner regression test suite
│   ├── index.html                                              # Entry HTML
│   ├── package.json                                            # Frontend dependencies & scripts
│   ├── vite.config.js                                          # Vite build configuration
│   └── WeatherGPT-*.md                                         # Master specification documents
└── README.md                                                   # Root repository documentation
```

## Quick Start (Frontend)

### 1. Navigate to the Frontend directory
```bash
cd frontend
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
