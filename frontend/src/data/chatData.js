// AI Weather Chat Mock Generator, Intent Detection & Multilingual Responses (A11, A12, A16, Context Modes)

import { CONTEXT_MODES, getContextMode, getContextAdvisory, getContextSuggestedQuestions } from './contextModes.js';
import { localizeCondition } from './translations.js';
import { getMockWeather } from './weatherData.js';
import { calculateMoonPhase, calculateSunMetrics } from '../utils/astronomy.js';

export const INITIAL_SUGGESTED_QUESTIONS = [
  "What's the weather today?",
  "Will it rain today?",
  "What should I wear today?",
  "When is sunset & what's the moon phase?",
  "What's the best time to go outside today?",
  "Compare Jodhpur and Jaipur",
  "Kal Jodhpur mein baarish hogi?",
  "Should I carry an umbrella?"
];

export const WEATHER_AWARE_QUESTIONS = [
  "How hot will it get this afternoon?",
  "Will it cool down tonight?",
  "Will it rain later today?",
  "What are the farming recommendations today?",
  "How is the air quality (AQI) today?",
  "What should I wear today?",
  "What are my saved locations?",
  "When is sunset today?"
];

// 20 Standard WeatherGPT Intents
export const INTENT_DEFINITIONS = {
  CURRENT_WEATHER: { label: "Current Weather", topic: "Current Conditions" },
  FORECAST: { label: "Forecast Inquiry", topic: "Multi-day Forecast" },
  RAIN: { label: "Precipitation & Rain", topic: "Rain Probability" },
  TEMPERATURE: { label: "Temperature & Heat", topic: "Thermal Profile" },
  WIND: { label: "Wind & Gusts", topic: "Atmospheric Flow" },
  HUMIDITY: { label: "Humidity & Moisture", topic: "Moisture Levels" },
  AQI: { label: "Air Quality Index", topic: "Particulate Pollution" },
  UV: { label: "UV Index & Sun", topic: "Solar Radiation" },
  ALERT: { label: "Weather Warning Check", topic: "Hazard Alerts" },
  TRAVEL: { label: "Travel & Transit Impact", topic: "Commute Advisory" },
  OUTDOOR_ACTIVITY: { label: "Outdoor Suitability", topic: "Sports & Recreation" },
  FARMING: { label: "Agricultural Weather", topic: "Crop & Soil Impact" },
  HEALTH: { label: "Health & Sensitivity", topic: "Biometeorology" },
  WEATHER_RISK: { label: "Severe Weather Risk", topic: "Storm & Flood Risk" },
  COMPARISON: { label: "City Weather Comparison", topic: "Comparative Analysis" },
  HISTORICAL_WEATHER: { label: "Climate & History", topic: "Long-term Climate" },
  SAVED_LOCATIONS: { label: "Saved Locations", topic: "Saved Cities List" },
  SUN_MOON: { label: "Sun & Moon Ephemeris", topic: "Astronomical Telemetry" },
  GUIDANCE: { label: "Smart Weather Guidance", topic: "Preparation Advice" },
  TIMELINE: { label: "Weather Timeline & Windows", topic: "Hourly Activity Window" }
};

/**
 * Dynamically extract one or more city names from user query (supporting Hindi, Hinglish, English)
 */
export function extractCitiesFromQuery(userQuery) {
  if (!userQuery || typeof userQuery !== 'string') return [];
  const qLower = userQuery.toLowerCase().trim();
  const matched = [];

  const commonCities = [
    "jodhpur", "delhi", "mumbai", "jaipur", "london", "tokyo", "miami", "oslo", "cairo", 
    "kolkata", "bengaluru", "bangalore", "chennai", "hyderabad", "ahmedabad", "pune", 
    "ajmer", "patna", "lucknow", "kanpur", "nagpur", "indore", "thane", "bhopal", 
    "visakhapatnam", "vadodara", "ghaziabad", "ludhiana", "agra", "nashik", "faridabad", 
    "meerut", "rajkot", "varanasi", "srinagar", "aurangabad", "dhanbad", "amritsar", 
    "allahabad", "prayagraj", "ranchi", "howrah", "coimbatore", "jabalpur", "gwalior", 
    "vijayawada", "madurai", "guwahati", "chandigarh", "hubli", "mysore", "bareilly", 
    "aligarh", "moradabad", "jalandhar", "bhubaneswar", "salem", "warangal", "guntur", 
    "bikaner", "noida", "jamshedpur", "bhilai", "cuttack", "firozabad", "kochi", 
    "dehradun", "udaipur", "kota", "shimla", "manali", "new york", "los angeles", 
    "chicago", "paris", "berlin", "rome", "madrid", "dubai", "singapore", "sydney", 
    "toronto", "san francisco", "bangkok", "seoul", "moscow", "beijing", "shanghai"
  ];

  // 1. Check known cities
  for (const c of commonCities) {
    const regex = new RegExp(`\\b${c}\\b`, 'i');
    if (regex.test(qLower) && !matched.map(m => m.toLowerCase()).includes(c)) {
      matched.push(c.charAt(0).toUpperCase() + c.slice(1));
    }
  }

  if (matched.length > 0) {
    matched.sort((a, b) => qLower.indexOf(a.toLowerCase()) - qLower.indexOf(b.toLowerCase()));
    return matched;
  }

  // 2. Non-city vocabulary filter (weather terms, times, intents, verbs)
  const nonCityWords = new Set([
    'what', 'is', 'the', 'weather', 'report', 'forecast', 'temperature', 'temp', 'mausam', 
    'do', 'dijiye', 'batao', 'bataiye', 'kaisa', 'kaise', 'kese', 'hai', 'h', 'tha', 'hoga', 
    'tell', 'me', 'about', 'in', 'of', 'for', 'at', 'a', 'an', 'ka', 'ke', 'ki', 'mein', 'me', 
    'ko', 'se', 'kya', 'show', 'fetch', 'get', 'give', 'please', 'pls', 'today', 'aaj', 'kal', 
    'tomorrow', 'live', 'update', 'currently', 'check', 'details', 'overview', 'status',
    'wind', 'hawa', 'storm', 'rain', 'baarish', 'barsaat', 'umbrella', 'cloud', 'clouds',
    'hot', 'cold', 'garmi', 'thand', 'evening', 'morning', 'shaam', 'subah', 'afternoon',
    'dophar', 'night', 'raat', 'tonight', 'travel', 'safe', 'driving', 'drive', 'highway',
    'road', 'safar', 'flight', 'sun', 'moon', 'sunrise', 'sunset', 'chand', 'suraj',
    'humidity', 'moisture', 'nammi', 'aqi', 'air', 'quality', 'pollution', 'uv', 'sunscreen',
    'farmer', 'kisan', 'crop', 'fasal', 'farming', 'irrigation', 'sinchai', 'khet',
    'saved', 'favorite', 'favourite', 'bookmark', 'locations', 'my', 'alert', 'warning',
    'khatra', 'chetwani', 'risk', 'flood', 'cyclone', 'best', 'time', 'when', 'kab',
    'activity', 'window', 'guidance', 'clothes', 'kapde', 'jacket', 'wear', 'outdoor',
    'run', 'jog', 'cycle', 'gym', 'fitness', 'match', 'cricket', 'and', 'aur', 'vs', 'versus'
  ]);

  // Extract from prepositional patterns like 'in <City>', '<City> ka', '<City> mein'
  const cityPatterns = [
    /\b(?:in|at|for|around)\s+([a-zA-Z]{3,20})/i,
    /([a-zA-Z]{3,20})\s+(?:ka|ke|ki|mein|me|se|city|weather|mausam)/i
  ];

  for (const pat of cityPatterns) {
    const match = qLower.match(pat);
    if (match && match[1]) {
      const cand = match[1].toLowerCase().trim();
      if (!nonCityWords.has(cand)) {
        matched.push(cand.charAt(0).toUpperCase() + cand.slice(1));
      }
    }
  }

  return matched;
}

/**
 * Extracts intent, entities (location, time, topic), and context from query
 */
export function extractQueryUnderstanding(userQuery, priorContext = {}) {
  const query = (userQuery || '').toLowerCase().trim();

  // 1. Time extraction
  let time = "Today";
  if (query.includes("kal") || query.includes("tomorrow") || query.includes("कल") || query.includes("aane wala kal")) {
    time = "Tomorrow";
  } else if (query.includes("tonight") || query.includes("aaj raat") || query.includes("raat") || query.includes("आज रात")) {
    time = "Tonight";
  } else if (query.includes("evening") || query.includes("shaam") || query.includes("शाम")) {
    time = priorContext.time && priorContext.time.includes("Tomorrow") ? "Tomorrow Evening" : "This Evening";
  } else if (query.includes("afternoon") || query.includes("dophar") || query.includes("दोपहर")) {
    time = priorContext.time && priorContext.time.includes("Tomorrow") ? "Tomorrow Afternoon" : "This Afternoon";
  } else if (query.includes("morning") || query.includes("subah") || query.includes("सुबह")) {
    time = priorContext.time && priorContext.time.includes("Tomorrow") ? "Tomorrow Morning" : "This Morning";
  } else if (query.includes("week") || query.includes("hafte") || query.includes("हफ्ते") || query.includes("सप्ताह")) {
    time = "This Week";
  } else if (priorContext.time) {
    time = priorContext.time;
  }

  // 2. Dynamic Location extraction & Multi-city pairs
  const matchedCities = extractCitiesFromQuery(query);

  let location = null;
  let locationA = null;
  let locationB = null;

  if (matchedCities.length >= 2) {
    locationA = matchedCities[0];
    locationB = matchedCities[1];
    location = matchedCities[0];
  } else if (matchedCities.length === 1) {
    location = matchedCities[0];
  }

  if (!location) {
    location = priorContext.location || "Current Location";
  }

  // 3. Intent & Topic detection
  let intentKey = "CURRENT_WEATHER";

  const isComparison = query.includes("compare") || query.includes("versus") || query.includes(" vs ") || 
    query.includes(" vs. ") || query.includes("tulna") || query.includes("तुलना") || 
    (matchedCities.length >= 2 && (query.includes("and") || query.includes("aur") || query.includes("और")));

  const isSavedLocations = query.includes("saved") || query.includes("favorite") || query.includes("favourite") || 
    query.includes("bookmark") || query.includes("सहेजे") || query.includes("पसंदीदा") || query.includes("my locations");

  const isSunMoon = query.includes("sunset") || query.includes("sunrise") || query.includes("moon") || 
    query.includes("lunar") || query.includes("solar noon") || query.includes("chand") || query.includes("सूरज") || 
    query.includes("सूर्यास्त") || query.includes("सूर्योदय") || query.includes("चांद") || query.includes("chandra");

  const isTimeline = query.includes("best time") || query.includes("timeline") || query.includes("kab jau") || 
    query.includes("kab bahar") || query.includes("activity window") || query.includes("schedule") || 
    query.includes("सर्वश्रेष्ठ समय") || query.includes("घंटेवार");

  const isGuidance = query.includes("what should i wear") || query.includes("what to wear") || query.includes("clothes") || 
    query.includes("jacket") || query.includes("clothing") || query.includes("kapde") || query.includes("kya pehnu") || 
    query.includes("कपड़े") || query.includes("recommendation") || query.includes("guidance") || query.includes("सलाह");

  const isFarming = query.includes("kisan") || query.includes("किसान") || query.includes("farm") || query.includes("crop") || query.includes("fasal") || query.includes("फसल") || query.includes("irrigation") || query.includes("sinchai") || query.includes("सिंचाई") || query.includes("khet") || query.includes("खेत");

  if (isComparison) {
    intentKey = "COMPARISON";
    if (!locationA) locationA = location;
    if (!locationB) locationB = locationA.toLowerCase() === 'jaipur' ? 'Delhi' : 'Jaipur';
  } else if (isSavedLocations) {
    intentKey = "SAVED_LOCATIONS";
  } else if (isSunMoon) {
    intentKey = "SUN_MOON";
  } else if (isTimeline) {
    intentKey = "TIMELINE";
  } else if (isFarming) {
    intentKey = "FARMING";
  } else if (isGuidance) {
    intentKey = "GUIDANCE";
  } else if (query.includes("rain") || query.includes("baarish") || query.includes("बारिश") || query.includes("वर्षा") || query.includes("umbrella") || query.includes("chhatri") || query.includes("छाता") || query.includes("barsaat") || query.includes("drizzle")) {
    intentKey = "RAIN";
  } else if (query.includes("hot") || query.includes("garmi") || query.includes("गर्मी") || query.includes("temperature") || query.includes("temp") || query.includes("taapmaan") || query.includes("तापमान") || query.includes("cold") || query.includes("thand") || query.includes("ठंड")) {
    intentKey = "TEMPERATURE";
  } else if (query.includes("risk") || query.includes("cyclone") || query.includes("flood") || query.includes("disaster") || query.includes("jokhim") || query.includes("जोखिम") || query.includes("बाढ़") || query.includes("aapat")) {
    intentKey = "WEATHER_RISK";
  } else if (query.includes("alert") || query.includes("warning") || query.includes("khatra") || query.includes("chetwani") || query.includes("चेतावनी") || query.includes("खतरा") || query.includes("emergency") || query.includes("आपातकाल")) {
    intentKey = "ALERT";
  } else if (query.includes("wind") || query.includes("hawa") || query.includes("हवा") || query.includes("storm") || query.includes("gust") || query.includes("aandhi") || query.includes("तूफान")) {
    intentKey = "WIND";
  } else if (query.includes("humidity") || query.includes("moisture") || query.includes("nammi") || query.includes("नमी")) {
    intentKey = "HUMIDITY";
  } else if (query.includes("travel") || query.includes("flight") || query.includes("road") || query.includes("drive") || query.includes("safar") || query.includes("सफ़र") || query.includes("journey") || query.includes("highway") || query.includes("यात्रा")) {
    intentKey = "TRAVEL";
  } else if (query.includes("outdoor") || query.includes("run") || query.includes("jog") || query.includes("walk") || query.includes("cycle") || query.includes("match") || query.includes("cricket") || query.includes("दौड़") || query.includes("कसरत")) {
    intentKey = "OUTDOOR_ACTIVITY";
  } else if (query.includes("health") || query.includes("asthma") || query.includes("allergy") || query.includes("allergies") || query.includes("swasthya") || query.includes("स्वास्थ्य") || query.includes("sehat") || query.includes("सेहत") || query.includes("bimar") || query.includes("illness")) {
    intentKey = "HEALTH";
  } else if (query.includes("aqi") || query.includes("air quality") || query.includes("pollution") || query.includes("smog") || query.includes("hawa ki quality") || query.includes("प्रदूषण") || query.includes("pm2.5") || query.includes("pm10")) {
    intentKey = "AQI";
  } else if (query.includes("uv") || query.includes("sunscreen") || query.includes("dhoop") || query.includes("धूप")) {
    intentKey = "UV";
  } else if (query.includes("forecast") || query.includes("next days") || query.includes("agla") || query.includes("hafta") || query.includes("पूर्वानुमान")) {
    intentKey = "FORECAST";
  } else if (query.includes("history") || query.includes("climate") || query.includes("annual") || query.includes("purana") || query.includes("इतिहास")) {
    intentKey = "HISTORICAL_WEATHER";
  } else if (priorContext.intent && (query.includes("what about") || query.includes("aur") || query.includes("and") || query.includes("और"))) {
    // Contextual follow-up inheritance
    intentKey = priorContext.intent;
  }

  const intentDef = INTENT_DEFINITIONS[intentKey] || INTENT_DEFINITIONS.CURRENT_WEATHER;

  return {
    location,
    locationA,
    locationB,
    locations: matchedCities.length > 0 ? matchedCities : [location],
    time,
    intent: intentKey,
    intentLabel: intentDef.label,
    topic: intentDef.topic,
    status: "Analyzed"
  };
}

/**
 * Generates an AI response incorporating rich cards, intent metadata, context mode, and language
 */
export function generateAIChatResponse(userQuery, weatherData, lang = 'en', priorContext = {}) {
  const understanding = extractQueryUnderstanding(userQuery, priorContext);
  const city = weatherData?.location?.city || understanding.location || "your location";
  const temp = weatherData?.current?.temperature ?? 30;
  const rawCondition = weatherData?.current?.condition || "Clear Sky";
  const condition = localizeCondition(rawCondition, lang);
  const rainProb = weatherData?.current?.rainProbability ?? 10;
  const humidity = weatherData?.current?.humidity ?? 45;
  const windSpeed = weatherData?.current?.windSpeed ?? 14;
  const aqi = weatherData?.current?.aqi ?? 85;
  const uvIndex = weatherData?.current?.uvIndex ?? 6;
  const highTemp = weatherData?.current?.highTemp ?? (temp + 3);
  const lowTemp = weatherData?.current?.lowTemp ?? (temp - 7);

  // Active Context Mode resolution
  const userMode = priorContext?.userMode || weatherData?.userMode || 'general';
  const modeObj = getContextMode(userMode);
  const modeLabel = modeObj?.names?.[lang] || modeObj?.names?.en || modeObj?.defaultName || 'General';

  // Strict separation of official warnings from AI guidance
  let officialWarning = null;
  if (weatherData?.alerts && weatherData.alerts.length > 0) {
    officialWarning = weatherData.alerts[0].headline || weatherData.alerts[0].event;
  } else if (rainProb >= 70) {
    officialWarning = lang === 'hi'
      ? `मौसम विभाग सतर्कता: ${city} में भारी बारिश की उच्च संभावना (${rainProb}%)।`
      : lang === 'hinglish'
      ? `Weather Dept Advisory: ${city} mein heavy rain ka high chance (${rainProb}%) hai.`
      : `Official Advisory: High precipitation probability (${rainProb}%) for ${city}.`;
  } else if (temp >= 42) {
    officialWarning = lang === 'hi'
      ? `लू (हीटवेव) चेतावनी: अधिकतम तापमान ${temp}°C पहुंच रहा है। दोपहर में बाहर जाने से बचें।`
      : lang === 'hinglish'
      ? `Heatwave Advisory: Temperature ${temp}°C cross ho raha hai. Afternoon mein direct sun se bachein.`
      : `Heatwave Advisory: Temperatures reaching ${temp}°C. Hydrate frequently and avoid direct midday sun.`;
  } else if (windSpeed >= 40) {
    officialWarning = lang === 'hi'
      ? `तेज़ हवा चेतावनी: हवा की गति ${windSpeed} km/h तक पहुंच रही है। पेड़ और ढीले ढांचों से दूर रहें।`
      : lang === 'hinglish'
      ? `High Wind Alert: Winds reaching ${windSpeed} km/h. Loose structures aur trees se safe distance maintain karein.`
      : `High Wind Advisory: Wind gusts up to ${windSpeed} km/h expected. Exercise caution with lightweight structures.`;
  }

  let summaryText = "";
  let tip = "";
  let impact = "";
  let extraCard = null;

  // Intent Handlers
  if (understanding.intent === "COMPARISON") {
    const locA = understanding.locationA || city;
    const locB = understanding.locationB || (locA.toLowerCase() === 'jaipur' ? 'Delhi' : 'Jaipur');
    let dataA = null;
    let dataB = null;
    try { dataA = getMockWeather(locA); } catch(e) { dataA = { location: { city: locA }, current: { temperature: temp, condition: rawCondition, rainProbability: rainProb, humidity } }; }
    try { dataB = getMockWeather(locB); } catch(e) { dataB = { location: { city: locB }, current: { temperature: 28, condition: 'Partly Cloudy', rainProbability: 20, humidity: 55 } }; }

    const tempA = dataA.current.temperature;
    const tempB = dataB.current.temperature;
    const condA = localizeCondition(dataA.current.condition, lang);
    const condB = localizeCondition(dataB.current.condition, lang);
    const rainA = dataA.current.rainProbability ?? 10;
    const rainB = dataB.current.rainProbability ?? 15;

    if (lang === 'hi') {
      summaryText = `${locA} और ${locB} की मौसम तुलना: ${locA} में तापमान ${tempA}°C (${condA}) और बारिश की संभावना ${rainA}% है। जबकि ${locB} में तापमान ${tempB}°C (${condB}) और बारिश की संभावना ${rainB}% है।`;
      tip = `दोनों स्थानों में ${Math.abs(tempA - tempB)}°C का तापांतर है। अपनी यात्रा या योजना के अनुसार तैयारी करें।`;
      impact = "तुलनात्मक मौसम विश्लेषण (दोनों शहरों का वास्तविक अवलोकन)।";
    } else if (lang === 'hinglish') {
      summaryText = `${locA} vs ${locB} comparison: ${locA} mein temp ${tempA}°C (${condA}) aur rain chance ${rainA}% hai. Wahi ${locB} mein temp ${tempB}°C (${condB}) aur rain chance ${rainB}% hai.`;
      tip = `Dono locations mein ${Math.abs(tempA - tempB)}°C ka temperature difference hai.`;
      impact = "Objective comparative telemetry.";
    } else {
      summaryText = `Weather comparison between ${locA} and ${locB}: In ${locA}, it is ${tempA}°C with ${condA} and a ${rainA}% chance of rain. In ${locB}, it is ${tempB}°C with ${condB} and a ${rainB}% chance of rain.`;
      tip = `There is a ${Math.abs(tempA - tempB)}°C temperature difference between both cities. Consider this when planning travel or activities.`;
      impact = "Side-by-side comparative atmospheric telemetry.";
    }

    extraCard = {
      type: 'comparison',
      locationA: { city: locA, temp: tempA, condition: condA, rain: rainA },
      locationB: { city: locB, temp: tempB, condition: condB, rain: rainB }
    };
  } else if (understanding.intent === "SAVED_LOCATIONS") {
    const savedList = priorContext?.savedLocations || [];
    if (savedList.length > 0) {
      const names = savedList.map(s => s.name || s.city).join(', ');
      if (lang === 'hi') {
        summaryText = `आपके सहेजे गए स्थान (${savedList.length}): ${names}। आप किसी भी शहर पर क्लिक करके तुरंत उसका मौसम देख सकते हैं।`;
        tip = "पसंदीदा शहरों को जोड़ने या हटाने के लिए स्टार आइकन का उपयोग करें।";
      } else if (lang === 'hinglish') {
        summaryText = `Aapke saved locations (${savedList.length}): ${names}. Kisi bhi city pe click karke live weather switch kar sakte hain.`;
        tip = "Locations add ya remove karne ke liye star icon ya Settings use karein.";
      } else {
        summaryText = `Your saved locations (${savedList.length}): ${names}. You can click on any saved city across the app to switch instantly.`;
        tip = "Use the star icon next to the search bar or Settings to manage your favorite cities.";
      }
    } else {
      if (lang === 'hi') {
        summaryText = "आपके पास अभी कोई सहेजा गया स्थान नहीं है। अपने पसंदीदा शहरों को सहेजने के लिए सर्च बार के पास स्टार आइकन पर क्लिक करें!";
        tip = "सहेजे गए स्थान आपको एक क्लिक में मौसम ट्रैक करने की सुविधा देते हैं।";
      } else if (lang === 'hinglish') {
        summaryText = "Abhi aapka koi saved location nahi hai. Search bar ke paas star icon click karke favorite cities save karein!";
        tip = "Saved cities se aap one click mein live weather dekh sakte hain.";
      } else {
        summaryText = "You don't have any saved locations yet. Click the star icon next to the search bar to save your favorite cities for one-click access!";
        tip = "Saved locations persist across sessions and allow instant 1-click weather tracking.";
      }
    }
    impact = "Quick-access location memory.";
  } else if (understanding.intent === "SUN_MOON") {
    const sunriseStr = weatherData?.current?.sunrise || "06:15 AM";
    const sunsetStr = weatherData?.current?.sunset || "06:45 PM";
    const sunMetrics = calculateSunMetrics(sunriseStr, sunsetStr);
    const moon = calculateMoonPhase();

    if (lang === 'hi') {
      summaryText = `${city} में सूर्योदय ${sunMetrics.sunrise} और सूर्यास्त ${sunMetrics.sunset} पर होगा (कुल दिन की अवधि: ${sunMetrics.daylightDuration}, सौर दोपहर: ${sunMetrics.solarNoon})। आज की चंद्र कला ${moon.name} (${moon.emoji}) है, जिसकी चमक ${moon.illumination}% है।`;
      tip = "सौर एवं चंद्र गणना खगोलीय एल्गोरिदम द्वारा सटीक रूप से निर्धारित की गई है।";
      impact = "सौर एवं चंद्र खगोलीय अवलोकन।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein sunrise ${sunMetrics.sunrise} aur sunset ${sunMetrics.sunset} par hoga (daylight: ${sunMetrics.daylightDuration}, solar noon: ${sunMetrics.solarNoon}). Current moon phase ${moon.name} (${moon.emoji}) hai with ${moon.illumination}% illumination.`;
      tip = "Astronomical calculations deterministic synodic formulas par based hain.";
      impact = "Solar & lunar ephemeris.";
    } else {
      summaryText = `In ${city}, sunrise is at ${sunMetrics.sunrise} and sunset is at ${sunMetrics.sunset}, offering ${sunMetrics.daylightDuration} of daylight (solar noon at ${sunMetrics.solarNoon}). The current moon phase is ${moon.name} (${moon.emoji}) with ${moon.illumination}% illumination.`;
      tip = "Solar and lunar data are computed using deterministic astronomical algorithms.";
      impact = "Astronomical solar and lunar ephemeris.";
    }
  } else if (understanding.intent === "TIMELINE") {
    const morningWindow = "7:00 AM - 10:00 AM";
    const middayWindow = "12:00 PM - 3:00 PM";

    if (lang === 'hi') {
      summaryText = `${city} में आज का सर्वश्रेष्ठ गतिविधि समय: सुबह ${morningWindow} सबसे अनुकूल है (तापमान लगभग ${temp - 4}°C, कम यूवी)। दोपहर ${middayWindow} सबसे गर्म रहेगी (${highTemp}°C)। बारिश की संभावना ${rainProb}% है।`;
      tip = userMode === 'fitness' ? "सुबह या शाम के समय ही रनिंग/कसरत शेड्यूल करें।" : "दोपहर के पीक आवर्स में कड़ी धूप से बचें।";
      impact = "घंटेवार वायुमंडलीय प्रगति।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} ke liye aaj ki optimal outdoor window subah ${morningWindow} hai (temp around ${temp - 4}°C). Afternoon ${middayWindow} sabse garam rahega (${highTemp}°C). Rain probability ${rainProb}% hai.`;
      tip = userMode === 'fitness' ? "Early morning ya post-sunset workouts choose karein." : "Midday direct sun exposure limit karein.";
      impact = "Hourly progression analysis.";
    } else {
      summaryText = `Based on today's timeline for ${city}, the optimal window for outdoor activity is ${morningWindow} with comfortable temperatures (~${temp - 4}°C) and low UV. Midday heat peaks between ${middayWindow} reaching ${highTemp}°C. Precipitation probability remains at ${rainProb}%.`;
      tip = userMode === 'fitness' ? "Schedule cardio workouts during the morning or evening windows." : "Plan errands during morning or late afternoon to avoid peak solar heat.";
      impact = "Hourly atmospheric progression and window optimization.";
    }
  } else if (understanding.intent === "GUIDANCE") {
    let clothingEn = temp > 30 ? "Light, breathable cotton garments and sunglasses" : temp < 18 ? "A jacket or warm layer" : "Comfortable casual attire";
    let gearEn = rainProb > 40 ? "along with a compact umbrella or raincoat" : "with sunscreen protection";

    let clothingHi = temp > 30 ? "हल्के सूती कपड़े और धूप का चश्मा" : temp < 18 ? "हल्की जैकेट या स्वेटर" : "आरामदायक सामान्य कपड़े";
    let gearHi = rainProb > 40 ? "और साथ में एक छाता या रेनकोट" : "और धूप से बचाव हेतु सनस्क्रीन";

    let clothingHing = temp > 30 ? "Light, breathable cotton clothes aur sunglasses" : temp < 18 ? "Jacket ya warm layers" : "Comfortable casual clothes";
    let gearHing = rainProb > 40 ? "aur compact umbrella ya raincoat sath rakhein" : "aur UV protection ka dhyan rakhein";

    if (lang === 'hi') {
      summaryText = `${city} के लिए मौसम सलाह: आज ${clothingHi} पहनना बेहतर रहेगा, ${gearHi}। वर्तमान तापमान ${temp}°C और बारिश की संभावना ${rainProb}% है।`;
      tip = getContextAdvisory(userMode, lang) || "दिनभर के मौसम के अनुसार हाइड्रेटेड रहें।";
      impact = "दैनिक तैयारी एवं व्यावहारिक मार्गदर्शन।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} smart guidance: Aaj ${clothingHing} recommend kiya jata hai, ${gearHing}. Current temp ${temp}°C aur rain chance ${rainProb}% hai.`;
      tip = getContextAdvisory(userMode, lang) || "Day ke schedule ke hisaab se ready rahein.";
      impact = "Practical preparation guidance.";
    } else {
      summaryText = `Smart preparation guidance for ${city}: Today we recommend ${clothingEn}, ${gearEn}. The current temperature is ${temp}°C and rain chance is ${rainProb}%.`;
      tip = getContextAdvisory(userMode, lang) || "Stay well-hydrated throughout the day.";
      impact = "Data-grounded practical preparation.";
    }
  } else if (understanding.intent === "RAIN") {
    if (lang === 'hi') {
      summaryText = rainProb > 40
        ? `${understanding.time} ${city} में ${rainProb}% बारिश की संभावना है। स्थिति: ${condition}।`
        : `${city} में ${understanding.time} बारिश की संभावना केवल ${rainProb}% है। मौसम सूखा और ${condition} रहने का अनुमान है।`;
      
      if (userMode === 'farmer') {
        tip = rainProb > 40 
          ? "बारिश की संभावना अच्छी है; आज अतिरिक्त सिंचाई रोकें और जल निकासी नाली साफ रखें।" 
          : "बारिश की संभावना कम है; फसलों में सामान्य ड्रिप या स्प्रिंकलर सिंचाई जारी रखें।";
        impact = rainProb > 40 ? "खेतों में प्राकृतिक नमी मिलेगी।" : "मृदा नमी में गिरावट संभव है।";
      } else if (userMode === 'traveler') {
        tip = rainProb > 40 ? "छाता साथ रखें और हाईवे पर फिसलने से बचने हेतु गति नियंत्रित रखें।" : "यात्रा के लिए अनुकूल स्थिति; कोई बड़ा व्यवधान नहीं।";
        impact = rainProb > 40 ? "सड़क यातायात में 15-20 मिनट की देरी संभव।" : "यातायात सुगम रहेगा।";
      } else if (userMode === 'commuter') {
        tip = rainProb > 40 ? "रेनकोट साथ रखें और जलभराव वाले चौराहों से बचें।" : "सामान्य दैनिक आवागमन हेतु मार्ग साफ़ है।";
        impact = rainProb > 40 ? "पीक आवर्स में धीमी गति और पानी भराव।" : "समय पर आवागमन।";
      } else if (userMode === 'event_planner') {
        tip = rainProb > 40 ? "खुले पंडाल में वाटरप्रूफ कवर की व्यवस्था रखें।" : "आउटडोर आयोजन हेतु मौसम अनुकूल है।";
        impact = rainProb > 40 ? "खुले मंच पर व्यवधान की संभावना।" : "आयोजन सफलतापूर्वक संपन्न हो सकता है।";
      } else if (userMode === 'emergency') {
        tip = rainProb > 40 ? "निचले जलभराव वाले क्षेत्रों की निगरानी रखें और आपातकालीन नंबर तैयार रखें।" : "कोई गंभीर बाढ़ या जलभराव का खतरा नहीं।";
        impact = rainProb > 40 ? "स्थानीय स्तर पर जल जमाव का जोखिम।" : "स्थिति पूर्णतः सामान्य है।";
      } else {
        tip = rainProb > 40 ? "बाहर निकलते समय छाता या रेनकोट साथ रखना श्रेयस्कर होगा!" : "बारिश की कोई चिंता नहीं; बेझिझक योजना बनाएं!";
        impact = rainProb > 40 ? "सड़क पर हल्का पानी भर सकता है।" : "सामान्य स्थिति।";
      }
    } else if (lang === 'hinglish') {
      summaryText = rainProb > 40
        ? `${understanding.time} ${city} mein ${rainProb}% rain chance hai with ${condition} conditions.`
        : `${city} mein ${understanding.time} baarish ka chance sirf ${rainProb}% hai. Mausam dry aur ${condition} rahega.`;

      if (userMode === 'farmer') {
        tip = rainProb > 40 ? "Rain expected hai! Extra irrigation rokein aur drain channels clear rakhein." : "Rain chance low hai; regular schedule ke hisaab se irrigation karein.";
        impact = rainProb > 40 ? "Natural soil hydration milegi." : "Mitti mein moisture monitoring zaroori hai.";
      } else if (userMode === 'traveler' || userMode === 'commuter') {
        tip = rainProb > 40 ? "Umbrella aur raincoat pack karein. Roads slippery ho sakti hain." : "Commute bilkul smooth rahega.";
        impact = rainProb > 40 ? "Peak hours mein extra travel buffer time lein." : "On-time arrival expected.";
      } else if (userMode === 'fitness' || userMode === 'outdoor') {
        tip = rainProb > 40 ? "Indoor workout ya covered track choose karein." : "Outdoor jogging aur sports ke liye perfect time hai.";
        impact = rainProb > 40 ? "Ground wet aur slippery ho sakta hai." : "High activity comfort.";
      } else {
        tip = rainProb > 40 ? "Umbrella sath rakhna best rahega!" : "Koi umbrella ki zaroorat nahi hai aaj!";
        impact = rainProb > 40 ? "Minor traffic slowing expected." : "Dry road conditions.";
      }
    } else {
      summaryText = rainProb > 40
        ? `For ${understanding.time} in ${city}, there is a ${rainProb}% probability of rain with ${condition} skies.`
        : `Rain is unlikely for ${understanding.time} in ${city}. The probability of precipitation is only ${rainProb}%.`;

      if (userMode === 'farmer') {
        tip = rainProb > 40 ? "Rain expected; pause planned surface irrigation and verify field drainage." : "Low precipitation risk; continue standard irrigation cycles.";
        impact = rainProb > 40 ? "Natural soil recharging." : "Soil moisture depletion without watering.";
      } else if (userMode === 'traveler' || userMode === 'commuter') {
        tip = rainProb > 40 ? "Carry waterproof gear and allow an extra 15-minute commute window." : "Roads are clear and dry with no transit disruption.";
        impact = rainProb > 40 ? "Wet road conditions and localized spray." : "Smooth, on-time transit.";
      } else if (userMode === 'fitness' || userMode === 'outdoor') {
        tip = rainProb > 40 ? "Consider indoor training or an all-weather trail." : "Excellent window for outdoor running and training.";
        impact = rainProb > 40 ? "Slick pavement and shoe waterlogging." : "Optimal training conditions.";
      } else if (userMode === 'event_planner') {
        tip = rainProb > 40 ? "Have covered contingency spaces ready for outdoor guests." : "Clear outdoor setup conditions; proceed as planned.";
        impact = rainProb > 40 ? "Moisture impact on exposed staging." : "Uninterrupted outdoor festivities.";
      } else {
        tip = rainProb > 40 ? "Carrying a compact umbrella is recommended today!" : "No umbrella needed today; enjoy the pleasant weather!";
        impact = rainProb > 40 ? "Minor road splashing and slow peak-hour traffic expected." : "Dry road surfaces and normal transit.";
      }
    }
  } else if (understanding.intent === "TEMPERATURE") {
    if (lang === 'hi') {
      summaryText = `${city} में वर्तमान तापमान ${temp}°C है (${condition})। अधिकतम तापमान ${highTemp}°C और न्यूनतम ${lowTemp}°C तक रहने का अनुमान है।`;
      if (userMode === 'farmer') {
        tip = temp > 35 ? "दोपहर की कड़ी धूप से पहले सुबह जल्दी सिंचाई करें ताकि वाष्पीकरण कम हो।" : "तापमान फसलों के अनुकूल बना हुआ है।";
        impact = temp > 35 ? "उच्च वाष्पोत्सर्जन और जल की अधिक मांग।" : "सामान्य फसल वृद्धि।";
      } else if (userMode === 'fitness') {
        tip = temp > 35 ? "कसरत सुबह 7 बजे से पहले या शाम 6 बजे के बाद ही करें; खूब पानी पिएं।" : "आउटडोर वर्कआउट के लिए सुखद तापमान।";
        impact = temp > 35 ? "हीट क्रैम्प्स या डिहाइड्रेशन का जोखिम।" : "कसरत हेतु आदर्श स्थिति।";
      } else {
        tip = temp > 35 ? "दोपहर में धूप से बचें और पर्याप्त तरल पदार्थ लेते रहें।" : "तापमान सुखद और आरामदायक बना हुआ है।";
        impact = temp > 35 ? "गर्म मौसम के कारण थर्मल तनाव।" : "सुहावना मौसम।";
      }
    } else if (lang === 'hinglish') {
      summaryText = `Abhi ${city} mein temperature ${temp}°C (${condition}) hai. Max ${highTemp}°C tak jayega aur min ${lowTemp}°C rahega.`;
      if (userMode === 'fitness' || userMode === 'outdoor') {
        tip = temp > 35 ? "Peak sun hours (12 PM - 4 PM) workout avoid karein aur electrolytes lein." : "Running ke liye cool and balanced weather hai.";
        impact = temp > 35 ? "Higher dehydration risk." : "Good thermal comfort.";
      } else if (userMode === 'farmer') {
        tip = "High temperatures ke time early morning drip irrigation plan karein.";
        impact = "Soil moisture loss accelerates during peak afternoon.";
      } else {
        tip = temp > 35 ? "Afternoon hours mein shaded areas prefer karein aur hydrated rahein." : "Temperature normal and pleasant hai.";
        impact = temp > 35 ? "Moderate heat index during midday." : "Comfortable conditions.";
      }
    } else {
      summaryText = `In ${city}, the temperature is currently ${temp}°C (${condition}). Daytime high will reach ${highTemp}°C with a low of ${lowTemp}°C.`;
      if (userMode === 'fitness') {
        tip = temp > 35 ? "Schedule outdoor training before 8 AM or after 6 PM to prevent heat exhaustion." : "Comfortable thermal profile for high-intensity exercise.";
        impact = temp > 35 ? "Increased heart rate and sweat loss rate." : "Optimal athletic endurance.";
      } else if (userMode === 'farmer') {
        tip = temp > 35 ? "Irrigate early in the morning to offset peak evapotranspiration." : "Temperature supports steady crop vegetative growth.";
        impact = temp > 35 ? "Elevated soil water stress." : "Stable soil conditions.";
      } else {
        tip = temp > 35 ? "Stay well hydrated and limit unshaded sun exposure during midday." : "Comfortable temperatures throughout the day.";
        impact = temp > 35 ? "Midday thermal discomfort." : "Pleasant atmospheric conditions.";
      }
    }
  } else if (understanding.intent === "FARMING" || userMode === 'farmer') {
    if (lang === 'hi') {
      summaryText = `${city} के कृषि परिप्रेक्ष्य: तापमान ${temp}°C, आर्द्रता ${humidity}%, हवा ${windSpeed} km/h और बारिश की संभावना ${rainProb}% है।`;
      tip = windSpeed > 25 
        ? "तेज़ हवाओं के कारण कीटनाशक छिड़काव रोक दें और संवेदनशील पौधों को सहारा दें।" 
        : rainProb > 50 
        ? "आगामी बारिश को देखते हुए रासायनिक उर्वरक का प्रयोग स्थगित रखें।" 
        : "सुबह के समय ड्रिप सिंचाई करें ताकि पानी की बचत हो सके।";
      impact = "फसल सुरक्षा और जल संरक्षण हेतु अनुकूल निगरानी आवश्यक है।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} farming advisory: Temp ${temp}°C, humidity ${humidity}%, wind ${windSpeed} km/h aur rain chance ${rainProb}% hai.`;
      tip = windSpeed > 25 
        ? "High wind ki wajah se pesticide spray delay karein." 
        : rainProb > 50 
        ? "Fertilizer runoff prevent karne ke liye chemical sprays pause karein." 
        : "Early morning irrigation schedule follow karein.";
      impact = "Field moisture and crop stability maintained.";
    } else {
      summaryText = `Agricultural perspective for ${city}: Temperature is ${temp}°C, relative humidity is ${humidity}%, wind speed is ${windSpeed} km/h, and rain chance is ${rainProb}%.`;
      tip = windSpeed > 25 
        ? "Wind speeds exceed 25 km/h; postpone foliar spraying to prevent chemical drift." 
        : rainProb > 50 
        ? "Hold off fertilizer application to prevent nutrient runoff." 
        : "Irrigate early morning to maximize deep soil moisture absorption.";
      impact = "Soil moisture remains stable under scheduled management.";
    }
  } else if (understanding.intent === "AQI" || understanding.intent === "HEALTH") {
    if (lang === 'hi') {
      summaryText = `${city} में वायु गुणवत्ता सूचकांक (AQI) लगभग ${aqi} है। स्थिति: ${aqi > 150 ? 'अस्वस्थ' : aqi > 100 ? 'मध्यम' : 'संतोषजनक'}।`;
      tip = aqi > 120 ? "संवेदनशील लोग और बच्चे बाहर निकलते समय मास्क का उपयोग करें।" : "हवा की स्थिति सामान्य है, बाहर की गतिविधियां सुरक्षित हैं।";
      impact = aqi > 120 ? "श्वसन संबंधी संवेदनशीलता।" : "स्वच्छ वायुमंडलीय प्रवाह।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein current AQI ${aqi} record hua hai (${aqi > 150 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Good'}).`;
      tip = aqi > 120 ? "Sensitive individuals N95 mask wear karein outside." : "Outdoor sports aur commute ke liye air acceptable hai.";
      impact = aqi > 120 ? "Mild irritation in sensitive respiratory tracts." : "Clean atmospheric baseline.";
    } else {
      summaryText = `Air Quality Index for ${city} is currently ${aqi} (${aqi > 150 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Satisfactory'}).`;
      tip = aqi > 120 ? "Individuals with asthma or respiratory conditions should wear a mask outdoors." : "Air quality is favorable for outdoor activities.";
      impact = aqi > 120 ? "Elevated particulate exposure." : "Normal atmospheric respiration.";
    }
  } else if (understanding.intent === "WIND") {
    if (lang === 'hi') {
      summaryText = `${city} में हवा की गति ${windSpeed} km/h है (${weatherData?.current?.windDirection || 'NW'} दिशा)। ${windSpeed > 30 ? 'हवा काफी तेज़ और झोंकेदार है।' : 'हवा की गति सामान्य और मंद है।'}`;
      tip = windSpeed > 30 ? "तेज़ हवाओं के चलते होर्डिंग्स और पेड़ों से सुरक्षित दूरी रखें।" : "हवा की गति बाहरी गतिविधियों के लिए अनुकूल है।";
      impact = windSpeed > 30 ? "हल्के ढांचों पर अतिरिक्त वायुमंडलीय दबाव।" : "स्थिर वायुमंडलीय प्रवाह।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein wind speed ${windSpeed} km/h (${weatherData?.current?.windDirection || 'NW'}) record hui hai. ${windSpeed > 30 ? 'Winds kaafi gusty hain.' : 'Wind flow moderate aur pleasant hai.'}`;
      tip = windSpeed > 30 ? "High-profile vehicles drive karte waqt caution rakhein." : "Outdoors activities ke liye airflow perfect hai.";
      impact = windSpeed > 30 ? "Moderate wind gust resistance." : "Smooth air conditions.";
    } else {
      summaryText = `In ${city}, wind speed is currently ${windSpeed} km/h blowing from the ${weatherData?.current?.windDirection || 'NW'}. ${windSpeed > 30 ? 'Conditions are breezy with noticeable gusts.' : 'Wind velocity is gentle and calm.'}`;
      tip = windSpeed > 30 ? "Secure loose outdoor furniture and lightweight awnings." : "Favorable wind conditions for outdoor recreation.";
      impact = windSpeed > 30 ? "Elevated aerodynamic drag." : "Stable atmospheric circulation.";
    }
  } else if (understanding.intent === "HUMIDITY") {
    const dewPointVal = weatherData?.current?.dewPoint ?? Math.round(temp - (100 - humidity) / 5);
    if (lang === 'hi') {
      summaryText = `${city} में सापेक्ष आर्द्रता ${humidity}% है। ओस बिंदु लगभग ${dewPointVal}°C है।`;
      tip = humidity > 65 ? "उच्च नमी के कारण उमस महसूस हो सकती है, सूती कपड़े पहनें।" : humidity < 25 ? "हवा शुष्क है; पर्याप्त पानी पिएं और त्वचा पर मॉइस्चराइजर लगाएं।" : "आर्द्रता का स्तर आरामदायक बना हुआ है।";
      impact = humidity > 65 ? "पसीने के धीमे वाष्पीकरण से थर्मल असुविधा।" : "संतुलित श्वसन आराम।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein humidity level ${humidity}% hai (dew point ~${dewPointVal}°C).`;
      tip = humidity > 65 ? "High moisture ke chalte sticky feel hoga, breathable cottons wear karein." : humidity < 25 ? "Air dry hai, water intake increase karein." : "Humidity level balanced aur comfortable hai.";
      impact = humidity > 65 ? "Elevated mugginess index." : "Standard ambient moisture.";
    } else {
      summaryText = `In ${city}, relative humidity is currently at ${humidity}% with a dew point of ~${dewPointVal}°C.`;
      tip = humidity > 65 ? "High moisture creates muggy conditions; wear light breathable cotton fabrics." : humidity < 25 ? "Dry air prevalent; stay well-hydrated and protect skin." : "Comfortable ambient humidity level.";
      impact = humidity > 65 ? "Reduced evaporative cooling efficiency." : "Optimal atmospheric moisture.";
    }
  } else if (understanding.intent === "UV") {
    if (lang === 'hi') {
      summaryText = `${city} में सौर पराबैंगनी (UV) सूचकांक ${uvIndex} है (${uvIndex >= 8 ? 'अति उच्च' : uvIndex >= 6 ? 'उच्च' : 'मध्यम'})।`;
      tip = uvIndex >= 6 ? "सुबह 11 बजे से दोपहर 3 बजे तक सीधी धूप से बचें, SPF 30+ सनस्क्रीन और धूप का चश्मा उपयोग करें।" : "यूवी विकिरण का स्तर सुरक्षित और सामान्य है।";
      impact = uvIndex >= 6 ? "बिना सुरक्षा वाली त्वचा पर 20-30 मिनट में सनबर्न का जोखिम।" : "विटामिन डी संश्लेषण हेतु सुरक्षित धूप।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein UV Index currently ${uvIndex} hai (${uvIndex >= 8 ? 'Very High' : uvIndex >= 6 ? 'High' : 'Moderate'}).`;
      tip = uvIndex >= 6 ? "Midday sun mein sunscreen (SPF 30+) apply karein aur sunglasses wear karein." : "Solar radiation safe limits mein hai.";
      impact = uvIndex >= 6 ? "Elevated erythemal solar radiation." : "Mild solar exposure.";
    } else {
      summaryText = `In ${city}, the solar UV Index is currently ${uvIndex} (${uvIndex >= 8 ? 'Very High' : uvIndex >= 6 ? 'High' : 'Moderate'}).`;
      tip = uvIndex >= 6 ? "Apply broad-spectrum SPF 30+ sunscreen and wear UV-rated sunglasses between 11 AM and 3 PM." : "UV radiation is at safe, low-risk levels.";
      impact = uvIndex >= 6 ? "Sunburn risk on unprotected skin within 20 to 30 minutes." : "Safe ambient solar exposure.";
    }
  } else if (understanding.intent === "ALERT" || understanding.intent === "WEATHER_RISK") {
    if (lang === 'hi') {
      summaryText = `${city} में मौसमी जोखिम और चेतावनी विश्लेषण: ${officialWarning ? officialWarning : 'वर्तमान में कोई सक्रिय गंभीर चेतावनी जारी नहीं है। स्थिति सामान्य है।'} तापमान ${temp}°C, बारिश संभावना ${rainProb}%, हवा ${windSpeed} km/h।`;
      tip = officialWarning ? "आधिकारिक दिशा-निर्देशों का पालन करें और जलभराव अथवा खुले क्षेत्रों से बचें।" : "सभी मौसम सूचकांक सुरक्षित सीमा में हैं।";
      impact = officialWarning ? "स्थानीय स्तर पर आवागमन या गतिविधियों में व्यवधान का जोखिम।" : "स्थिति पूर्णतः नियंत्रित और सुरक्षित है।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} weather risk review: ${officialWarning ? officialWarning : 'Currently koi active severe weather warning nahi hai.'} Temp ${temp}°C, rain chance ${rainProb}%, wind ${windSpeed} km/h.`;
      tip = officialWarning ? "IMD advisories follow karein aur alerts check karte rahein." : "Conditions stable hain, routine plans safe hain.";
      impact = officialWarning ? "Adverse weather risk present." : "Safe environmental conditions.";
    } else {
      summaryText = `Weather risk and hazard assessment for ${city}: ${officialWarning ? officialWarning : 'No active severe weather alerts or watches in effect.'} Current temperature is ${temp}°C with ${rainProb}% rain probability and winds at ${windSpeed} km/h.`;
      tip = officialWarning ? "Follow civil meteorological instructions and monitor official updates." : "All parameters remain within benign operational thresholds.";
      impact = officialWarning ? "Potential localized disruption from prevailing conditions." : "Stable atmospheric baseline.";
    }
  } else if (understanding.intent === "TRAVEL") {
    if (lang === 'hi') {
      summaryText = `${city} के लिए यात्रा एवं पारगमन रिपोर्ट: वर्तमान स्थिति ${condition}, तापमान ${temp}°C, दृश्यता 10 km, और बारिश की संभावना ${rainProb}% है।`;
      tip = rainProb > 40 ? "सड़क पर बारिश के कारण फिसलन हो सकती है; यात्रा में 15 मिनट का अतिरिक्त समय लेकर चलें।" : "मार्ग पूरी तरह साफ़ और सूखा है; सुखद यात्रा की शुभकामनाएं।";
      impact = rainProb > 40 ? "सड़क यातायात में मामूली मंदी।" : "समय पर और सुचारू आवागमन।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} travel conditions: Condition ${condition}, temp ${temp}°C, visibility clear (10 km), rain chance ${rainProb}%.`;
      tip = rainProb > 40 ? "Roads slippery ho sakti hain, driving buffer time lein." : "Roads aur flights ke liye weather clear hai.";
      impact = rainProb > 40 ? "Minor transit slowdown." : "On-schedule commute.";
    } else {
      summaryText = `Transit and travel advisory for ${city}: Conditions are ${condition} at ${temp}°C with 10 km visibility and a ${rainProb}% chance of rain.`;
      tip = rainProb > 40 ? "Pavement may be slick in localized showers; allow extra stopping distance." : "Transit corridors and highways report clear conditions.";
      impact = rainProb > 40 ? "Marginal commute delays possible." : "Optimal travel velocity.";
    }
  } else if (understanding.intent === "OUTDOOR_ACTIVITY") {
    if (lang === 'hi') {
      summaryText = `${city} में आउटडोर खेल एवं व्यायाम की स्थिति: तापमान ${temp}°C (${condition}), आर्द्रता ${humidity}%, हवा ${windSpeed} km/h, और यूवी इंडेक्स ${uvIndex} है।`;
      tip = temp > 35 ? "दोपहर के समय कड़ी धूप से बचें; कसरत सुबह 6-8 बजे या शाम को ही करें।" : "दौड़, साइकिलिंग या खेलकूद के लिए मौसम बहुत ही अनुकूल है।";
      impact = temp > 35 ? "उच्च तापमान में पसीना और निर्जलीकरण का जोखिम।" : "उत्कृष्ट एरोबिक क्षमता।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} outdoor activity index: Temp ${temp}°C (${condition}), humidity ${humidity}%, wind ${windSpeed} km/h, UV index ${uvIndex}.`;
      tip = temp > 35 ? "Early morning 6-8 AM ya evening slots choose karein workout ke liye." : "Running, cycling aur games ke liye great atmosphere hai.";
      impact = temp > 35 ? "Dehydration risk in direct sun." : "Comfortable athletic exertion.";
    } else {
      summaryText = `Outdoor activity and fitness assessment for ${city}: Currently ${temp}°C (${condition}) with ${humidity}% humidity, wind at ${windSpeed} km/h, and UV index ${uvIndex}.`;
      tip = temp > 35 ? "Limit strenuous exertion between 11 AM and 4 PM; hydrate with electrolytes." : "Superb conditions for outdoor workouts, running, or team sports.";
      impact = temp > 35 ? "Elevated cardiovascular heat load." : "Prime aerobic performance.";
    }
  } else if (understanding.intent === "FORECAST") {
    if (lang === 'hi') {
      summaryText = `${city} के लिए आगामी बहु-दिवसीय पूर्वानुमान: आने वाले दिनों में अधिकतम तापमान ${highTemp}°C और न्यूनतम ${lowTemp}°C के आसपास रहने का अनुमान है। स्थिति मुख्यतः ${condition} रहेगी।`;
      tip = "दैनिक पूर्वानुमान टैब में जाकर 7 दिनों का विस्तृत चार्ट देख सकते हैं।";
      impact = "मध्यम अवधि में स्थिर मौसमी रुझान।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} upcoming forecast: Next few days mein high temp ~${highTemp}°C aur low temp ~${lowTemp}°C rahega with predominantly ${condition} weather.`;
      tip = "Detailed 7-day breakdown ke liye Dashboard ka forecast section check karein.";
      impact = "Medium-range atmospheric stability.";
    } else {
      summaryText = `Multi-day forecast outlook for ${city}: High temperatures will average around ${highTemp}°C with lows near ${lowTemp}°C under predominantly ${condition} skies.`;
      tip = "Consult the 7-day daily forecast table for day-by-day temperature trends.";
      impact = "Stable medium-range numerical prediction profile.";
    }
  } else if (understanding.intent === "HISTORICAL_WEATHER") {
    if (lang === 'hi') {
      summaryText = `${city} का ऐतिहासिक एवं जलवायु अवलोकन: वर्तमान तापमान ${temp}°C क्षेत्र के दीर्घकालिक जलवायु औसत और ERA5 पुनर्वितरण आंकड़ों के अनुकूल है।`;
      tip = "पिछले महीनों एवं वर्षों के तुलनात्मक रिकॉर्ड देखने के लिए 'Historical Weather' पृष्ठ पर जाएं।";
      impact = "जलवायु सांख्यिकी का सामान्य वितरण।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} climate & history summary: Current temperature ${temp}°C long-term climate normals aur ERA5 historical records ke consistent range mein hai.`;
      tip = "Past archives explore karne ke liye Historical Weather page visit karein.";
      impact = "Consistent with seasonal climate benchmarks.";
    } else {
      summaryText = `Climate and historical record analysis for ${city}: Current telemetry of ${temp}°C aligns with regional climatological normals and ERA5 reanalysis archives.`;
      tip = "Visit the Historical Weather page to explore past daily records and export CSV archives.";
      impact = "Data consistent with long-term climate baseline.";
    }
  } else {
    // General / Context-Tailored Default
    const defaultAdvisory = getContextAdvisory(userMode, lang);
    if (lang === 'hi') {
      summaryText = `${city} में इस समय तापमान ${temp}°C और स्थिति ${condition} है। आर्द्रता ${humidity}% और हवा की गति ${windSpeed} km/h है।`;
      tip = defaultAdvisory || "मौसम स्थिर है; दिन की योजनाएं सुचारू रूप से बना सकते हैं।";
      impact = "सामान्य वायुमंडलीय स्थिति।";
    } else if (lang === 'hinglish') {
      summaryText = `${city} mein current mausam ${temp}°C aur ${condition} hai. Humidity ${humidity}% aur wind ${windSpeed} km/h hai.`;
      tip = defaultAdvisory || "Mausam stable hai, travel ya outdoor activities continue kar sakte hain.";
      impact = "Standard atmospheric balance.";
    } else {
      summaryText = `In ${city}, it is currently ${temp}°C with ${condition} skies. Humidity is ${humidity}%, wind is ${windSpeed} km/h, and high will reach ${highTemp}°C.`;
      tip = defaultAdvisory || "Keep an eye on regional updates if planning long-distance travel.";
      impact = "Standard atmospheric baseline.";
    }
  }

  return {
    id: `msg-ai-${Date.now()}`,
    sender: "assistant",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: summaryText,
    understanding: understanding,
    richContent: {
      city,
      temp: `${temp}°C`,
      condition,
      rawCondition,
      rainProbability: `${rainProb}%`,
      humidity: `${humidity}%`,
      wind: `${windSpeed} km/h`,
      highLow: `${highTemp}°C / ${lowTemp}°C`,
      aqi: `${aqi}`,
      uvIndex: `${uvIndex}`,
      forecastWindow: understanding.time,
      contextMode: userMode,
      contextLabel: modeLabel,
      activePerspective: {
        mode: userMode,
        label: modeLabel
      },
      officialWarning,
      aiGuidance: tip,
      tip,
      impact,
      recommendation: tip,
      confidence: weatherData?.confidence?.level || "High",
      uncertainty: weatherData?.confidence?.uncertaintyExplanation || "Atmospheric model deterministic.",
      sourcesUsed: [
        "Open-Meteo High-Resolution Grid",
        "Deterministic Telemetry Feed",
        "WMO Synoptic Observations"
      ],
      aiExplanationLabel: "WeatherGPT AI Synthesis",
      extraCard
    }
  };
}
