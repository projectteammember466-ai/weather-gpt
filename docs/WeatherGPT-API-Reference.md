# WeatherGPT — REST API Specification & Reference
**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Content-Type:** `application/json`  

---

## 1. Overview

The WeatherGPT REST API gateway exposes normalized meteorological telemetry, historical ERA5 reanalysis datasets, geocoding search, severe weather alerts, AI conversational synthesis, and persistent user application state.

---

## 2. Standard Response Schemas

### Success Response (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response (HTTP 400 / 404 / 429 / 500 / 502)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Latitude must be a valid number between -90 and 90."
  }
}
```

---

## 3. API Endpoints

### 1. Health Status (`GET /api/v1/health`)
* **Description:** Returns server health, version, environment, and Firebase SDK status.
* **Query Parameters:** None.
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "service": "WeatherGPT Backend",
    "status": "healthy",
    "timestamp": "2026-09-25T12:00:00.000Z",
    "environment": "development",
    "version": "1.0.0",
    "firebase": {
      "configured": false,
      "status": "unconfigured"
    }
  }
}
```

---

### 2. Current Weather (`GET /api/v1/weather`)
* **Description:** Retrieves live synoptic weather metrics and air quality index for coordinates.
* **Query Parameters:**
  - `lat` (required, number): Latitude (-90 to 90)
  - `lon` (required, number): Longitude (-180 to 180)
  - `locationName` (optional, string): Human-readable location label
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "location": {
      "id": "loc-26.24-73.02",
      "name": "Jodhpur",
      "latitude": 26.2389,
      "longitude": 73.0243
    },
    "current": {
      "temperature": 31,
      "feelsLike": 33,
      "condition": "Clear Sky",
      "icon": "Sun",
      "humidity": 45,
      "windSpeed": 12,
      "windDirection": "NW",
      "rainProbability": 5,
      "highTemp": 34,
      "lowTemp": 24,
      "pressure": 1012,
      "visibility": 10,
      "uvIndex": 6,
      "cloudCover": 15,
      "dewPoint": 18,
      "aqi": 75,
      "aqiCategory": "Moderate"
    },
    "confidence": {
      "level": "High",
      "percentage": 92,
      "source": "Open-Meteo Synoptic Telemetry"
    },
    "metadata": {
      "source": "Open-Meteo Weather API",
      "dataTimestamp": "2026-09-25T12:00:00.000Z"
    }
  }
}
```

---

### 3. Weather Forecast (`GET /api/v1/forecast`)
* **Description:** Retrieves extended daily outlooks and 24-hour hourly progression.
* **Query Parameters:**
  - `lat` (required, number): Latitude
  - `lon` (required, number): Longitude
  - `days` (optional, number, default: 7): Days count (1 to 16)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "location": { "latitude": 26.2389, "longitude": 73.0243 },
    "forecastDays": 7,
    "daily": [
      {
        "date": "2026-09-25",
        "maxTemp": 34,
        "minTemp": 24,
        "condition": "Clear Sky",
        "icon": "Sun",
        "rainProbability": 10,
        "uvIndexMax": 6,
        "sunrise": "06:15",
        "sunset": "18:45"
      }
    ],
    "hourly": [
      {
        "time": "12:00",
        "temperature": 32,
        "humidity": 40,
        "rainProbability": 5,
        "windSpeed": 12,
        "condition": "Clear Sky",
        "icon": "Sun"
      }
    ]
  }
}
```

---

### 4. Historical Climate Data (`GET /api/v1/historical`)
* **Description:** Fetches ERA5 Reanalysis historical temperature and rainfall data.
* **Query Parameters:**
  - `lat` (required, number)
  - `lon` (required, number)
  - `startDate` (optional, YYYY-MM-DD)
  - `endDate` (optional, YYYY-MM-DD)
  - `locationName` (optional, string)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "location": { "name": "Jodhpur", "latitude": 26.2389, "longitude": 73.0243 },
    "startDate": "2026-09-15",
    "endDate": "2026-09-22",
    "daysCount": 8,
    "daily": [ ... ],
    "summary": {
      "avgTemp": 28,
      "maxTemp": 33,
      "minTemp": 22,
      "totalPrecipitation": 4.2,
      "rainyDays": 1,
      "maxWindSpeed": 16
    }
  }
}
```

---

### 5. Location Search (`GET /api/v1/locations/search`)
* **Description:** Searches geocoded worldwide locations via Open-Meteo Geocoding.
* **Query Parameters:**
  - `q` (required, string, max 100 chars): City or region name
* **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "geo-1273294",
      "name": "Delhi",
      "city": "Delhi",
      "admin1": "Delhi",
      "country": "India",
      "countryCode": "IN",
      "latitude": 28.65195,
      "longitude": 77.23149,
      "timezone": "Asia/Kolkata",
      "population": 10927986
    }
  ]
}
```

---

### 6. Weather Alerts (`GET /api/v1/alerts`)
* **Description:** Retrieves verified meteorological severe weather advisories.
* **Query Parameters:**
  - `lat` (optional, number)
  - `lon` (optional, number)
  - `city` (optional, string)
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "location": "Jodhpur",
    "alertsCount": 0,
    "alerts": [],
    "officialStatus": "No Active Severe Weather Warnings",
    "timestamp": "2026-09-25T12:00:00.000Z"
  }
}
```

---

### 7. AI Weather Assistant (`POST /api/v1/chat`)
* **Description:** Processes natural language queries with grounded weather context.
* **Request Body:**
```json
{
  "message": "Should I wear a jacket in Delhi?",
  "location": { "name": "Delhi", "latitude": 28.6139, "longitude": 77.2090 },
  "contextMode": "traveler",
  "language": "en",
  "userId": "usr_123"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reply": "In Delhi, current temperature is 28°C with Clear Sky. Light clothing is recommended.",
    "intent": "CLOTHING",
    "location": "Delhi",
    "contextMode": "traveler",
    "reasoningSteps": [
      "Detected user intent: CLOTHING",
      "Target location: Delhi",
      "Active context mode: traveler"
    ]
  }
}
```

---

### 8. Saved Locations CRUD
* `GET /api/v1/locations/saved?userId=...`
* `POST /api/v1/locations/saved` (Body: `{ userId, name, city, country, latitude, longitude }`)
* `DELETE /api/v1/locations/saved/:userId/:id`

---

### 9. User Settings CRUD
* `GET /api/v1/user/settings?userId=...`
* `PATCH /api/v1/user/settings` (Body: `{ userId, language, temperatureUnit, theme, contextMode }`)
* `GET /api/v1/user/dashboard-preferences?userId=...`
* `PATCH /api/v1/user/dashboard-preferences` (Body: `{ userId, visibleSections, sectionOrder }`)
