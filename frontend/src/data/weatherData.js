// WeatherGPT - Normalized Mock Weather Fixtures (Enhanced for A11-A22)

export const MOCK_WEATHER_DATA = {
  jodhpur: {
    location: {
      id: "loc-jod",
      name: "Jodhpur",
      city: "Jodhpur",
      region: "Rajasthan",
      state: "Rajasthan",
      country: "India",
      lat: 26.2389,
      lon: 73.0243,
      latitude: 26.2389,
      longitude: 73.0243
    },
    current: {
      temperature: 34,
      feelsLike: 37,
      condition: "Sunny",
      icon: "Sun",
      humidity: 38,
      windSpeed: 14,
      windDirection: "NW",
      rainProbability: 5,
      highTemp: 36,
      lowTemp: 24,
      pressure: 1008,
      visibility: 10,
      uvIndex: 8,
      cloudCover: 10,
      dewPoint: 17,
      sunrise: "06:18 AM",
      sunset: "06:42 PM",
      aqi: 112,
      aqiCategory: "Moderate"
    },
    confidence: {
      level: "High",
      percentage: 90,
      forecastWindow: "Today (12:00 PM – 6:00 PM)",
      uncertaintyExplanation: "High pressure ridge provides stable conditions with high atmospheric predictability."
    },
    whyForecast: {
      topic: "Clear & Intense Heat",
      signals: [
        { name: "Atmospheric Pressure", status: "High & Steady (1008 hPa)", icon: "Gauge" },
        { name: "Relative Humidity", status: "Low (38%)", icon: "Droplets" },
        { name: "Cloud Coverage", status: "Clear Skies (10%)", icon: "Cloud" },
        { name: "Wind Trajectory", status: "Dry Northwesterly Desert Airflow", icon: "Wind" }
      ],
      reasoning: "A persistent continental anti-cyclone suppresses cloud convection over the Thar desert, allowing unobstructed solar radiation to warm the surface.",
      aiExplanation: "Expect hot, bright sunshine through the afternoon. Rain is improbable (<5%). Keep hydration steady if outdoors."
    },
    contextAdvice: {
      general: "Clear sunny weather throughout the day. Warm afternoon temperatures.",
      farmer: "High evaporation rates. Early morning or drip irrigation is recommended to prevent excessive crop water loss.",
      traveler: "Excellent road visibility (10 km). Sun protection is strongly advised for daylight travel.",
      outdoor: "High UV Index (8). Wear sunglasses, wide-brim hats, and use SPF 30+ sunscreen between 11 AM and 4 PM.",
      emergency: "Heatwave advisory in effect for surrounding western districts. Ensure potable water availability."
    },
    metadata: {
      source: "Demo Meteorological Model v2.4 (Mock)",
      updatedAt: "8 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  delhi: {
    location: {
      id: "loc-del",
      name: "Delhi",
      city: "Delhi",
      region: "NCR",
      state: "Delhi",
      country: "India",
      lat: 28.6139,
      lon: 77.2090,
      latitude: 28.6139,
      longitude: 77.2090
    },
    current: {
      temperature: 32,
      feelsLike: 36,
      condition: "Cloudy",
      icon: "Cloud",
      humidity: 55,
      windSpeed: 12,
      windDirection: "E",
      rainProbability: 30,
      highTemp: 34,
      lowTemp: 25,
      pressure: 1006,
      visibility: 7,
      uvIndex: 6,
      cloudCover: 65,
      dewPoint: 21,
      sunrise: "06:10 AM",
      sunset: "06:34 PM",
      aqi: 185,
      aqiCategory: "Unhealthy for Sensitive Groups"
    },
    confidence: {
      level: "Medium",
      percentage: 68,
      forecastWindow: "Afternoon to Late Evening",
      uncertaintyExplanation: "Isolated cloud convective towers may produce brief localized drizzle."
    },
    whyForecast: {
      topic: "Humid Overcast & Air Inversion",
      signals: [
        { name: "Surface Moisture", status: "Moderate-High (55%)", icon: "Droplets" },
        { name: "Cloud Layer", status: "Stratocumulus Deck (65%)", icon: "Cloud" },
        { name: "Wind Velocity", status: "Light Breeze (12 km/h East)", icon: "Wind" },
        { name: "PM2.5 Index", status: "Elevated (185 AQI)", icon: "Activity" }
      ],
      reasoning: "Moist easterly air masses pooling across the Gangetic basin meeting weak boundary layer winds.",
      aiExplanation: "Overcast conditions will keep daytime temperatures slightly capped, but humidity will make it feel warm."
    },
    contextAdvice: {
      general: "Cloudy and warm day with elevated air particulate levels.",
      farmer: "Moderate humidity supports seasonal vegetation; low wind speed suitable for pesticide spraying.",
      traveler: "Moderate haze in morning transit. Airport operations remain standard.",
      outdoor: "Unhealthy air quality for sensitive individuals. Consider indoor aerobic workouts.",
      emergency: "Air quality alert active. Protect vulnerable demographics."
    },
    metadata: {
      source: "National Capital Demo Service (Mock)",
      updatedAt: "18 mins ago",
      freshness: "Aging",
      dataTimestamp: new Date().toISOString()
    }
  },
  mumbai: {
    location: {
      id: "loc-mum",
      name: "Mumbai",
      city: "Mumbai",
      region: "Maharashtra",
      state: "Maharashtra",
      country: "India",
      lat: 19.0760,
      lon: 72.8777,
      latitude: 19.0760,
      longitude: 72.8777
    },
    current: {
      temperature: 29,
      feelsLike: 34,
      condition: "Rain",
      icon: "CloudRain",
      humidity: 82,
      windSpeed: 22,
      windDirection: "SW",
      rainProbability: 85,
      highTemp: 30,
      lowTemp: 26,
      pressure: 1010,
      visibility: 5,
      uvIndex: 4,
      cloudCover: 90,
      dewPoint: 25,
      sunrise: "06:28 AM",
      sunset: "06:50 PM",
      aqi: 65,
      aqiCategory: "Satisfactory"
    },
    confidence: {
      level: "High",
      percentage: 88,
      forecastWindow: "Next 12 Hours",
      uncertaintyExplanation: "Radar echoes show continuous monsoon rain bands approaching the coastline."
    },
    whyForecast: {
      topic: "Monsoonal Moisture Surge",
      signals: [
        { name: "Precipitation Probability", status: "Very High (85%)", icon: "Umbrella" },
        { name: "Arabian Sea Moisture", status: "High Humidity (82%)", icon: "Droplets" },
        { name: "Wind Gusts", status: "Southwesterly 22–38 km/h", icon: "Wind" },
        { name: "Barometric Gradient", status: "Trough Line Active", icon: "Gauge" }
      ],
      reasoning: "Strong onshore winds pumping saturated marine air directly into the Western Ghats orographic barrier.",
      aiExplanation: "Frequent moderate to heavy rainfall showers throughout the day with occasional blustery coastal squalls."
    },
    contextAdvice: {
      general: "Wet and rainy monsoon day. Carry sturdy umbrellas or raincoats.",
      farmer: "Ample soil recharge; ensure proper drainage channels in low fields to prevent root rot.",
      traveler: "Traffic delays expected along major arterial roads. Allow 30-45 minutes extra travel time.",
      outdoor: "High probability of getting drenched. Outdoor events should have waterproof marquees.",
      emergency: "High rain advisory active. Avoid parking in low-lying subways or walking near open drains."
    },
    metadata: {
      source: "Coastal Radar Network (Mock)",
      updatedAt: "4 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  jaipur: {
    location: {
      id: "loc-jai",
      name: "Jaipur",
      city: "Jaipur",
      region: "Rajasthan",
      state: "Rajasthan",
      country: "India",
      lat: 26.9124,
      lon: 75.7873,
      latitude: 26.9124,
      longitude: 75.7873
    },
    current: {
      temperature: 33,
      feelsLike: 35,
      condition: "Sunny",
      icon: "Sun",
      humidity: 42,
      windSpeed: 10,
      windDirection: "W",
      rainProbability: 10,
      highTemp: 35,
      lowTemp: 23,
      pressure: 1009,
      visibility: 9,
      uvIndex: 7,
      cloudCover: 15,
      dewPoint: 18,
      sunrise: "06:15 AM",
      sunset: "06:40 PM",
      aqi: 120,
      aqiCategory: "Moderate"
    },
    confidence: {
      level: "High",
      percentage: 85,
      forecastWindow: "Daytime",
      uncertaintyExplanation: "Stable inland atmospheric column with negligible storm probability."
    },
    whyForecast: {
      topic: "Dry Continental Sunshine",
      signals: [
        { name: "Solar Insolation", status: "Strong Unfiltered Sun", icon: "Sun" },
        { name: "Dew Point", status: "18°C Comfortable", icon: "Thermometer" },
        { name: "Convective Available Energy", status: "Low CAPE Index", icon: "Zap" }
      ],
      reasoning: "Subsidence inversion prevents cumulus growth across eastern Rajasthan.",
      aiExplanation: "Warm and bright conditions perfect for sightseeing, though midday sun is intense."
    },
    contextAdvice: {
      general: "Bright pleasant day with warm midday temperatures.",
      farmer: "Favorable dry conditions for harvesting and post-harvest drying.",
      traveler: "Ideal touring weather for forts and outdoor heritage monuments.",
      outdoor: "Great for sports, but maintain water intake in late morning.",
      emergency: "No active hazard alerts."
    },
    metadata: {
      source: "Regional Demo Weather (Mock)",
      updatedAt: "12 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  patna: {
    location: {
      id: "loc-pat",
      name: "Patna",
      city: "Patna",
      region: "Bihar",
      state: "Bihar",
      country: "India",
      lat: 25.5941,
      lon: 85.1376,
      latitude: 25.5941,
      longitude: 85.1376
    },
    current: {
      temperature: 31,
      feelsLike: 35,
      condition: "Partly Cloudy",
      icon: "CloudSun",
      humidity: 72,
      windSpeed: 14,
      windDirection: "E",
      rainProbability: 25,
      highTemp: 33,
      lowTemp: 24,
      pressure: 1010,
      visibility: 8,
      uvIndex: 6,
      cloudCover: 40,
      dewPoint: 22,
      sunrise: "05:42 AM",
      sunset: "05:58 PM",
      aqi: 95,
      aqiCategory: "Moderate"
    },
    confidence: {
      level: "High",
      percentage: 86,
      forecastWindow: "Daytime",
      uncertaintyExplanation: "Monsoon boundary layer humidity in Gangetic plain."
    },
    whyForecast: {
      topic: "Humid Gangetic Airflow",
      signals: [
        { name: "Gangetic Moisture", status: "Humid (72%)", icon: "Droplets" },
        { name: "Surface Pressure", status: "1010 hPa", icon: "Gauge" },
        { name: "Wind Velocity", status: "14 km/h East", icon: "Wind" }
      ],
      reasoning: "Moist easterly flow traversing across Bihar bringing warm humid conditions.",
      aiExplanation: "Warm and humid day in Patna with scattered clouds and mild breeze."
    },
    contextAdvice: {
      general: "Warm and humid conditions. Stay hydrated when outdoors.",
      farmer: "Moisture levels favorable for paddy; monitor field drainage.",
      traveler: "Surface visibility clear (8 km). Roads and rail transit running normally.",
      outdoor: "Moderate UV and humidity. Plan outdoor workouts in the morning.",
      emergency: "No active severe weather alerts."
    },
    metadata: {
      source: "Gangetic Basin Weather Service (Mock)",
      updatedAt: "5 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  london: {
    location: {
      id: "loc-lon",
      name: "London",
      city: "London",
      region: "Greater London",
      state: "England",
      country: "United Kingdom",
      lat: 51.5074,
      lon: -0.1278,
      latitude: 51.5074,
      longitude: -0.1278
    },
    current: {
      temperature: 16,
      feelsLike: 15,
      condition: "Rain",
      icon: "CloudRain",
      humidity: 78,
      windSpeed: 18,
      windDirection: "SW",
      rainProbability: 70,
      highTemp: 18,
      lowTemp: 11,
      pressure: 1014,
      visibility: 8,
      uvIndex: 3,
      cloudCover: 85,
      dewPoint: 12,
      sunrise: "06:45 AM",
      sunset: "07:15 PM",
      aqi: 35,
      aqiCategory: "Good"
    },
    confidence: {
      level: "Medium",
      percentage: 75,
      forecastWindow: "Afternoon Showers",
      uncertaintyExplanation: "Atlantic frontal band moving across southern England."
    },
    whyForecast: {
      topic: "Atlantic Frontal Passage",
      signals: [
        { name: "Atlantic Jet Stream", status: "Active Southern Branch", icon: "Wind" },
        { name: "Frontal Cloud", status: "85% Cirrostratus / Nimbostratus", icon: "Cloud" }
      ],
      reasoning: "Low pressure system tracking northeast across the Irish Sea brings bands of intermittent showers.",
      aiExplanation: "Cool autumnal feel with frequent spells of light to moderate drizzle."
    },
    contextAdvice: {
      general: "Brisk, cool, and damp day with periodic showers.",
      farmer: "Good soil moisture top-up for pastures.",
      traveler: "Carry an umbrella for London city walks; tubes and buses are running normally.",
      outdoor: "Light rainproof jacket needed for walks in parks.",
      emergency: "No major weather alerts."
    },
    metadata: {
      source: "European Demo Model (Mock)",
      updatedAt: "2 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  tokyo: {
    location: {
      id: "loc-tok",
      name: "Tokyo",
      city: "Tokyo",
      region: "Kanto",
      state: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lon: 139.6503,
      latitude: 35.6762,
      longitude: 139.6503
    },
    current: {
      temperature: 22,
      feelsLike: 22,
      condition: "Sunny",
      icon: "Sun",
      humidity: 60,
      windSpeed: 8,
      windDirection: "NE",
      rainProbability: 0,
      highTemp: 24,
      lowTemp: 16,
      pressure: 1018,
      visibility: 10,
      uvIndex: 5,
      cloudCover: 5,
      dewPoint: 14,
      sunrise: "05:30 AM",
      sunset: "05:50 PM",
      aqi: 42,
      aqiCategory: "Good"
    },
    confidence: {
      level: "High",
      percentage: 95,
      forecastWindow: "Full 24 Hours",
      uncertaintyExplanation: "Strong anticyclonic cell over the Sea of Japan guarantees clear skies."
    },
    whyForecast: {
      topic: "High Pressure Dominance",
      signals: [
        { name: "Barometric Pressure", status: "1018 hPa High", icon: "Gauge" },
        { name: "Dew Point", status: "14°C Crisp", icon: "Droplets" }
      ],
      reasoning: "Stable Pacific high pressure ridge keeps storms far to the south.",
      aiExplanation: "Mild, comfortable autumn weather with crisp blue skies."
    },
    contextAdvice: {
      general: "Clear, crisp, and comfortable weather all day.",
      farmer: "Excellent weather conditions for greenhouse maintenance and field crops.",
      traveler: "Ideal conditions for photography, walking tours, and rooftop dining.",
      outdoor: "Superb day for running, cycling, and outdoor recreation.",
      emergency: "No alerts."
    },
    metadata: {
      source: "East Asia Demo Sensor Network (Mock)",
      updatedAt: "25 mins ago",
      freshness: "Aging",
      dataTimestamp: new Date().toISOString()
    }
  },
  miami: {
    location: {
      id: "loc-mia",
      name: "Miami",
      city: "Miami",
      region: "Florida",
      state: "Florida",
      country: "United States",
      lat: 25.7617,
      lon: -80.1918,
      latitude: 25.7617,
      longitude: -80.1918
    },
    current: {
      temperature: 30,
      feelsLike: 36,
      condition: "Thunderstorm",
      icon: "CloudLightning",
      humidity: 88,
      windSpeed: 30,
      windDirection: "SE",
      rainProbability: 95,
      highTemp: 31,
      lowTemp: 25,
      pressure: 1002,
      visibility: 4,
      uvIndex: 2,
      cloudCover: 95,
      dewPoint: 26,
      sunrise: "07:10 AM",
      sunset: "07:25 PM",
      aqi: 40,
      aqiCategory: "Good"
    },
    confidence: {
      level: "High",
      percentage: 92,
      forecastWindow: "Next 24 Hours",
      uncertaintyExplanation: "Organized squall line verified on Doppler radar."
    },
    whyForecast: {
      topic: "Tropical Depression Convergence",
      signals: [
        { name: "Pressure Fall", status: "Rapid Drop (1002 hPa)", icon: "Gauge" },
        { name: "Marine Wind", status: "Sustained 30 km/h, Gusts 55 km/h", icon: "Wind" },
        { name: "Precipitable Water", status: "Tropical Saturation (88%)", icon: "Droplets" }
      ],
      reasoning: "Deep convective bands wrapping into an offshore tropical vortex creating widespread thunderstorms.",
      aiExplanation: "Expect heavy torrential downpours, frequent lightning strikes, and coastal storm surges."
    },
    contextAdvice: {
      general: "Dangerous stormy conditions. Remain indoors during lightning activity.",
      farmer: "Secure nursery covers; pump drainage channels.",
      traveler: "Flight cancellations and delays likely at MIA. Avoid highway driving.",
      outdoor: "All outdoor activities should be suspended immediately.",
      emergency: "Tropical storm warning active. Follow municipal emergency broadcast advice."
    },
    metadata: {
      source: "Atlantic Hurricane Demo Center (Mock)",
      updatedAt: "1 min ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  oslo: {
    location: {
      id: "loc-osl",
      name: "Oslo",
      city: "Oslo",
      region: "Ostlandet",
      state: "Ostlandet",
      country: "Norway",
      lat: 59.9139,
      lon: 10.7522,
      latitude: 59.9139,
      longitude: 10.7522
    },
    current: {
      temperature: -2,
      feelsLike: -7,
      condition: "Snow",
      icon: "Snowflake",
      humidity: 80,
      windSpeed: 16,
      windDirection: "N",
      rainProbability: 75,
      highTemp: 0,
      lowTemp: -6,
      pressure: 1020,
      visibility: 6,
      uvIndex: 1,
      cloudCover: 90,
      dewPoint: -5,
      sunrise: "07:05 AM",
      sunset: "05:15 PM",
      aqi: 22,
      aqiCategory: "Excellent"
    },
    confidence: {
      level: "High",
      percentage: 88,
      forecastWindow: "Today through Tomorrow Morning",
      uncertaintyExplanation: "Arctic front firmly established with sub-zero ground temperatures."
    },
    whyForecast: {
      topic: "Arctic Maritime Snow Squall",
      signals: [
        { name: "Surface Temperature", status: "Sub-zero (-2°C)", icon: "Thermometer" },
        { name: "Northerly Arctic Drift", status: "16 km/h Cold Flow", icon: "Wind" }
      ],
      reasoning: "Freezing air mass lifting over Scandinavian topography causes continuous dry snow flurries.",
      aiExplanation: "Snow accumulation of 5-10 cm with icy road surfaces. Dress in thermal layers."
    },
    contextAdvice: {
      general: "Freezing winter conditions with steady snowfall.",
      farmer: "Protect livestock in insulated shelters.",
      traveler: "Winter tires mandatory. Expect de-icing delays.",
      outdoor: "Dress in insulated waterproof winter garments.",
      emergency: "Freezing ice watch active."
    },
    metadata: {
      source: "Nordic Met Center Demo (Mock)",
      updatedAt: "15 mins ago",
      freshness: "Aging",
      dataTimestamp: new Date().toISOString()
    }
  },
  cairo: {
    location: {
      id: "loc-cai",
      name: "Cairo",
      city: "Cairo",
      region: "Cairo Governorate",
      state: "Cairo",
      country: "Egypt",
      lat: 30.0444,
      lon: 31.2357,
      latitude: 30.0444,
      longitude: 31.2357
    },
    current: {
      temperature: 24,
      feelsLike: 24,
      condition: "Night Clear",
      icon: "Moon",
      humidity: 45,
      windSpeed: 10,
      windDirection: "NE",
      rainProbability: 0,
      highTemp: 33,
      lowTemp: 21,
      pressure: 1012,
      visibility: 10,
      uvIndex: 0,
      cloudCover: 0,
      dewPoint: 11,
      sunrise: "05:45 AM",
      sunset: "06:05 PM",
      aqi: 95,
      aqiCategory: "Moderate"
    },
    confidence: {
      level: "High",
      percentage: 95,
      forecastWindow: "Overnight",
      uncertaintyExplanation: "Desert high pressure ensures cloudless nighttime skies."
    },
    whyForecast: {
      topic: "Nocturnal Radiative Cooling",
      signals: [
        { name: "Sky State", status: "Completely Clear", icon: "Moon" },
        { name: "Humidity", status: "Dry Air (45%)", icon: "Droplets" }
      ],
      reasoning: "Absence of clouds allows rapid daytime heat escape into upper atmosphere.",
      aiExplanation: "Cool, pleasant evening dropping to a comfortable 21°C."
    },
    contextAdvice: {
      general: "Pleasant starry night with calm breezes.",
      farmer: "Stable nocturnal conditions.",
      traveler: "Perfect for nighttime city exploration and dining.",
      outdoor: "Great weather for evening walking.",
      emergency: "No alerts."
    },
    metadata: {
      source: "North African Met Service (Mock)",
      updatedAt: "5 mins ago",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  },
  minimalCity: {
    location: {
      id: "loc-min",
      name: "Remote Outpost",
      city: "Remote Outpost",
      region: "Highlands",
      state: "Highlands",
      country: "Isolated Territory",
      lat: 0.0,
      lon: 0.0,
      latitude: 0.0,
      longitude: 0.0
    },
    current: {
      temperature: 18,
      feelsLike: 18,
      condition: "Cloudy",
      icon: "Cloud",
      humidity: 50,
      windSpeed: 15,
      windDirection: "N",
      rainProbability: 20,
      highTemp: 20,
      lowTemp: 12
    },
    confidence: {
      level: "Low",
      percentage: 35,
      forecastWindow: "Estimated Only",
      uncertaintyExplanation: "Sparse observational telemetry from remote outpost."
    },
    whyForecast: {
      topic: "Limited Telemetry Estimation",
      signals: [
        { name: "Regional Station", status: "Autonomous Sensor", icon: "Gauge" }
      ],
      reasoning: "Coarse numerical interpolation across unmonitored highland terrain.",
      aiExplanation: "Forecast is indicative due to remote sensor constraints."
    },
    contextAdvice: {
      general: "Cool cloudy conditions.",
      farmer: "Monitor localized weather changes.",
      traveler: "Self-reliance advised in remote zones.",
      outdoor: "Dress warmly.",
      emergency: "No alerts."
    },
    metadata: {
      source: "Demo Weather Data (Minimal Values Test)",
      updatedAt: "2 hours ago",
      freshness: "Stale",
      dataTimestamp: new Date().toISOString()
    }
  },
  longcity: {
    location: {
      id: "loc-long",
      name: "Thiruvananthapuram Metropolitan Area",
      city: "Thiruvananthapuram Metropolitan Area",
      region: "Southern District of Kerala State",
      state: "Kerala",
      country: "Republic of India",
      lat: 8.5241,
      lon: 76.9366,
      latitude: 8.5241,
      longitude: 76.9366
    },
    current: {
      temperature: 29,
      feelsLike: 33,
      condition: "Tropical Breeze",
      icon: "SunMedium",
      humidity: 75,
      windSpeed: 16,
      windDirection: "W",
      rainProbability: 35,
      highTemp: 31,
      lowTemp: 24,
      pressure: 1011,
      visibility: 9,
      uvIndex: 7,
      cloudCover: 40,
      dewPoint: 23,
      sunrise: "06:12 AM",
      sunset: "06:22 PM",
      aqi: 55,
      aqiCategory: "Good"
    },
    confidence: {
      level: "Medium",
      percentage: 70,
      forecastWindow: "Coastal Afternoon",
      uncertaintyExplanation: "Sea breeze interaction creates localized brief showers."
    },
    whyForecast: {
      topic: "Coastal Sea Breeze Convection",
      signals: [
        { name: "Sea-Land Gradient", status: "Active Thermal Flow", icon: "Wind" },
        { name: "Humidity", status: "75% Maritime Moisture", icon: "Droplets" }
      ],
      reasoning: "Daytime land heating pulls moist oceanic air, generating afternoon scattered clouds.",
      aiExplanation: "Warm and humid with refreshing sea winds along coastal fringes."
    },
    contextAdvice: {
      general: "Tropical humid day with pleasant sea breezes.",
      farmer: "Good humidity for plantation crops like rubber, coconut, and spices.",
      traveler: "Coastal roads are clear with scenic tropical vistas.",
      outdoor: "Pleasant in late afternoon near beaches.",
      emergency: "No major alerts."
    },
    metadata: {
      source: "Demo Weather Data (Long Name Boundary Test)",
      updatedAt: "Just now",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  }
};

export const DEFAULT_CITY = "jodhpur";

// All supported demo cities list for Map & Search
export const ALL_DEMO_CITIES = Object.keys(MOCK_WEATHER_DATA).map(key => ({
  id: MOCK_WEATHER_DATA[key].location.id || key,
  key: key,
  name: MOCK_WEATHER_DATA[key].location.name || MOCK_WEATHER_DATA[key].location.city,
  city: MOCK_WEATHER_DATA[key].location.city,
  country: MOCK_WEATHER_DATA[key].location.country,
  lat: MOCK_WEATHER_DATA[key].location.lat,
  lon: MOCK_WEATHER_DATA[key].location.lon,
  temp: MOCK_WEATHER_DATA[key].current.temperature,
  condition: MOCK_WEATHER_DATA[key].current.condition,
  rainProbability: MOCK_WEATHER_DATA[key].current.rainProbability,
  windSpeed: MOCK_WEATHER_DATA[key].current.windSpeed,
  aqi: MOCK_WEATHER_DATA[key].current.aqi,
  cloudCover: MOCK_WEATHER_DATA[key].current.cloudCover,
  hasAlert: ['jodhpur', 'mumbai', 'delhi', 'miami', 'oslo'].includes(key)
}));

export function getMockWeather(query = "") {
  const key = query.trim().toLowerCase();

  // Test error trigger
  if (key === 'error' || key === 'fail') {
    throw new Error("Weather service connection failed. Please check network connectivity and try again.");
  }

  // Test invalid city trigger
  if (key === 'invalid' || key === 'notfound' || key === 'xyz123') {
    throw new Error(`Location "${query}" was not found in weather records. Please try a valid location.`);
  }

  if (MOCK_WEATHER_DATA[key]) return MOCK_WEATHER_DATA[key];

  // Match partial name or case-insensitive key
  const matchedKey = Object.keys(MOCK_WEATHER_DATA).find(k => 
    k.toLowerCase() === key ||
    MOCK_WEATHER_DATA[k].location.city.toLowerCase().includes(key) ||
    k.toLowerCase().includes(key)
  );

  if (matchedKey) return MOCK_WEATHER_DATA[matchedKey];

  // If query is a directional station of a known mock city, calculate regional offset
  const dirMatch = key.match(/^(.*?)\s+(north-east|north-west|south-east|south-west|northeast|northwest|southeast|southwest|north|south|east|west)$/);
  if (dirMatch) {
    const base = dirMatch[1].trim();
    const dir = dirMatch[2];
    const baseMock = MOCK_WEATHER_DATA[base];
    if (baseMock) {
      const offsets = {
        'north': { dLat: 0.35, dLon: -0.20 },
        'south': { dLat: -0.40, dLon: 0.25 },
        'east': { dLat: 0.15, dLon: 0.45 },
        'west': { dLat: -0.25, dLon: -0.35 },
        'north-east': { dLat: 0.45, dLon: 0.40 },
        'northeast': { dLat: 0.45, dLon: 0.40 },
        'north-west': { dLat: 0.35, dLon: -0.35 },
        'northwest': { dLat: 0.35, dLon: -0.35 },
        'south-east': { dLat: -0.35, dLon: 0.35 },
        'southeast': { dLat: -0.35, dLon: 0.35 },
        'south-west': { dLat: -0.35, dLon: -0.35 },
        'southwest': { dLat: -0.35, dLon: -0.35 }
      };
      const off = offsets[dir] || { dLat: 0, dLon: 0 };
      const cityName = query.charAt(0).toUpperCase() + query.slice(1);
      return {
        ...baseMock,
        location: {
          ...baseMock.location,
          id: `loc-${key.replace(/\s+/g, '-')}`,
          name: cityName,
          city: cityName,
          lat: Number((baseMock.location.lat + off.dLat).toFixed(4)),
          lon: Number((baseMock.location.lon + off.dLon).toFixed(4)),
          latitude: Number((baseMock.location.lat + off.dLat).toFixed(4)),
          longitude: Number((baseMock.location.lon + off.dLon).toFixed(4))
        }
      };
    }
  }

  // Clean formatted fallback for general demo queries
  const cityName = query.charAt(0).toUpperCase() + query.slice(1);
  return {
    location: {
      id: `loc-${key}`,
      name: cityName,
      city: cityName,
      region: "Demo Region",
      state: "Demo State",
      country: "Global",
      lat: 20.0,
      lon: 77.0,
      latitude: 20.0,
      longitude: 77.0
    },
    current: {
      temperature: 28,
      feelsLike: 30,
      condition: "Partly Cloudy",
      icon: "SunMedium",
      humidity: 48,
      windSpeed: 14,
      windDirection: "NW",
      rainProbability: 15,
      highTemp: 31,
      lowTemp: 21,
      pressure: 1012,
      visibility: 10,
      uvIndex: 6,
      cloudCover: 30,
      dewPoint: 16,
      sunrise: "06:12 AM",
      sunset: "06:38 PM",
      aqi: 88,
      aqiCategory: "Moderate"
    },
    confidence: {
      level: "Medium",
      percentage: 70,
      forecastWindow: "Full Day",
      uncertaintyExplanation: "Standard demo atmospheric projection model."
    },
    whyForecast: {
      topic: "Simulated Model Interpolation",
      signals: [
        { name: "General Pressure", status: "1012 hPa", icon: "Gauge" },
        { name: "Average Humidity", status: "48%", icon: "Droplets" }
      ],
      reasoning: "Synthesized regional baseline based on geographic coordinates.",
      aiExplanation: "Moderate seasonal temperatures with intermittent clouds."
    },
    contextAdvice: {
      general: "Moderate seasonal conditions.",
      farmer: "Adequate conditions for general field work.",
      traveler: "Favorable conditions for travel.",
      outdoor: "Pleasant outdoor weather.",
      emergency: "No alerts."
    },
    metadata: {
      source: "Demo Weather Data (Generated Mock)",
      updatedAt: "Just now",
      freshness: "Fresh",
      dataTimestamp: new Date().toISOString()
    }
  };
}
