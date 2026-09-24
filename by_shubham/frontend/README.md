# WeatherGPT — Conversational Weather Intelligence

WeatherGPT is an AI-powered conversational weather assistant built with React 18, Vite 5, JavaScript (JSX), and CSS Custom Properties. It provides real-time atmospheric intelligence, interactive geospatial weather maps, confidence & uncertainty signals, meteorological explainability, and multi-language support (English, Hindi, Hinglish).

## Features

- **Conversational Weather Assistant (AI Chat)**: Natural language query parsing across 16 meteorological intents with contextual follow-up recognition and voice input/output.
- **Geospatial Weather Radar & Map**: Interactive weather overlays with layer switching (`Temperature`, `Precipitation/Rain`, `Wind`, `Clouds`, `Alerts`, `Air Quality`).
- **Impact-Based Official Weather Alerts**: Clear separation between official meteorological warnings and AI contextual impact guidance.
- **Explainability & Transparency**:
  - **Confidence Badges**: Uncertainty quantification for current and forecasted intervals.
  - **Why This Forecast?**: Detailed meteorological reasoning without hallucinated extrapolation.
  - **8-Stage Reasoning Pipeline**: Architectural walkthrough explaining data ingest, verification, and AI synthesis.
- **Climate & Historical Normals**: 30-year climatological comparisons and monthly trend visualizations.
- **Context Modes**: Tailored guidance modes for `General`, `Farmer`, `Traveler`, `Outdoor`, and `Emergency`.
- **Multilingual Support**: Real-time language switching across English, Hindi (हिंदी), and Hinglish.

## Tech Stack

- **Frontend**: React 18, Vite 5
- **Icons**: Lucide React
- **Architecture**: Modular service abstraction (`src/services/api.js`) ready for backend ingestion.
- **Testing**: Native Node.js test runner (`node --test test/weathergpt.test.js`)

## Getting Started

### 1. Install Dependencies
```bash
npm install
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
