# WeatherGPT — Viva & SIH Technical Defense Guide
**Version:** 1.0.0  
**Target Audience:** SIH Evaluators, Academic Examiners & Viva Panelists  

---

## 1. High-Yield Viva Defense Q&A

### Q1: What problem does WeatherGPT solve compared to standard weather apps?
**Answer:** Standard weather applications present raw, fragmented meteorological charts (e.g. "85% humidity, 1012 hPa pressure"). WeatherGPT combines real-time synoptic observations with an AI reasoning engine to transform technical data into actionable lifestyle advisories tailored for 8 user contexts (Farmers, Travelers, Outdoor Enthusiasts, Emergency Responders, Commuters, Event Planners, Athletes, and General Users).

---

### Q2: Why did you choose Node.js + Express for the backend API gateway?
**Answer:** Node.js offers an asynchronous, event-driven, non-blocking I/O model ideally suited for proxying lightweight HTTP requests from multiple third-party weather telemetry APIs and database services. Express provides a simple, production-tested framework that keeps backend overhead low while allowing clean middleware enforcement for CORS, input validation, rate limiting, and error handling.

---

### Q3: How do you prevent AI hallucination in weather forecasts?
**Answer:** WeatherGPT enforces strict data grounding using a `retrieve → validate → reason → generate` pipeline. Live numerical weather prediction telemetry (temperature, rain probability, wind speed, pressure, AQI) is fetched from authoritative synoptic observation networks *before* the prompt is synthesized. The exact physical metrics are injected into the Google Gemini LLM context, ensuring the AI cannot fabricate numerical weather facts.

---

### Q4: How are official severe weather warnings separated from AI advice?
**Answer:** Official meteorological severe weather alerts are retrieved via dedicated API endpoints and displayed in prominent red/yellow alert banners with official agency attribution. AI guidance is presented separately in dedicated advisory cards. This strict separation prevents AI recommendations from ever obscuring or impersonating official disaster authority warnings.

---

### Q5: How does the application handle offline operation or backend outages?
**Answer:** WeatherGPT implements a multi-tier fallback architecture. If the Express backend server or Firebase database becomes unreachable, the client-side service layer automatically falls back to direct client-side Open-Meteo REST calls and localStorage persistence. If network connectivity is lost completely, deterministic mock fixtures step in to ensure the UI never crashes or displays blank screens.

---

### Q6: How is user state managed across the frontend without Redux?
**Answer:** The frontend uses React's native Context API (`WeatherContext`, `LanguageContext`, `ThemeContext`) paired with custom hooks (`useWeather`, `useSavedLocations`, `useDashboardPreferences`). This minimizes bundle size, avoids heavy third-party state boilerplate, and ensures clean component reactivity across views.

---

### Q7: Why use Open-Meteo instead of OpenWeather as the primary data provider?
**Answer:** Open-Meteo provides free, high-resolution global meteorological forecasts and ERA5 historical reanalysis archives without daily API call restrictions or mandatory credit card requirements, making it ideal for scalable open-access web applications.

---

### Q8: How is security handled for private keys?
**Answer:** All private service account credentials (Firebase Admin SDK private key, Google Gemini API key) are stored exclusively in backend environment variables (`backend/.env`) and never exposed in static frontend client bundles (`VITE_` variables). Cross-Origin Resource Sharing (CORS) limits requests strictly to the configured frontend domain.
