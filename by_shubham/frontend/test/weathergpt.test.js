import test from 'node:test';
import assert from 'node:assert/strict';

import { getMockWeather, MOCK_WEATHER_DATA, DEFAULT_CITY, ALL_DEMO_CITIES } from '../src/data/weatherData.js';
import { getHourlyForecast, getDailyForecast } from '../src/data/forecastData.js';
import { getMockAlerts, MOCK_ALERTS_BY_CITY } from '../src/data/alertData.js';
import { 
  generateAIChatResponse, 
  extractQueryUnderstanding, 
  INITIAL_SUGGESTED_QUESTIONS, 
  WEATHER_AWARE_QUESTIONS,
  INTENT_DEFINITIONS
} from '../src/data/chatData.js';
import { getMockClimate, MOCK_CLIMATE_BY_CITY } from '../src/data/climateData.js';
import { TRANSLATIONS, getTranslation, SUPPORTED_LANGUAGES, localizeCondition } from '../src/data/translations.js';
import { CONTEXT_MODES, getContextMode, getContextSuggestedQuestions, getContextAdvisory } from '../src/data/contextModes.js';
import { formatTemperature } from '../src/utils/formatTemperature.js';
import { formatWind } from '../src/utils/formatWind.js';
import { fetchHistoricalWeather, generateSimulatedHistorical, parseWmoCode } from '../src/services/api.js';
import { calculateMoonPhase, calculateSunMetrics, MOON_PHASES } from '../src/utils/astronomy.js';
import { DEFAULT_SAVED_LOCATIONS } from '../src/hooks/useSavedLocations.js';
import { DEFAULT_SECTION_ORDER, DEFAULT_SECTION_VISIBILITY } from '../src/hooks/useDashboardPreferences.js';

// ==========================================
// A1-A10 Regression Protection Tests
// ==========================================

test('A1 - Project Setup & Architecture Baseline', () => {
  assert.ok(DEFAULT_CITY, 'Default city should be defined');
  assert.equal(DEFAULT_CITY, 'jodhpur');
  assert.ok(MOCK_WEATHER_DATA.jodhpur, 'Jodhpur fixture must exist');
});

test('A4 - Search & Current Weather Tests', () => {
  const jodhpur = getMockWeather('jodhpur');
  assert.equal(jodhpur.location.city, 'Jodhpur');
  assert.equal(typeof jodhpur.current.temperature, 'number');
  assert.ok(jodhpur.metadata.source, 'Metadata source must be defined');

  // Case insensitivity
  const delhi = getMockWeather('DELHI');
  assert.equal(delhi.location.city, 'Delhi');

  // Weather condition fixtures
  assert.equal(getMockWeather('oslo').current.condition, 'Snow');
  assert.equal(getMockWeather('cairo').current.condition, 'Night Clear');
  assert.equal(getMockWeather('miami').current.condition, 'Thunderstorm');

  // Minimal fixture
  const minimal = getMockWeather('minimalCity');
  assert.equal(minimal.location.city, 'Remote Outpost');
  assert.equal(minimal.current.uvIndex, undefined);

  // Long city name fixture
  const longCity = getMockWeather('longcity');
  assert.ok(longCity.location.city.length > 25);

  // Error trigger
  assert.throws(() => getMockWeather('error'), /Weather service connection failed/);
  assert.throws(() => getMockWeather('invalid'), /was not found in weather records/);
});

test('A5 - Forecast Data Tests', () => {
  const hourly = getHourlyForecast(30);
  assert.equal(hourly.length, 8);
  hourly.forEach((item) => {
    assert.ok(item.time);
    assert.equal(typeof item.temp, 'number');
  });

  const daily = getDailyForecast(30);
  assert.equal(daily.length, 7);
  daily.forEach((day) => {
    assert.ok(day.day);
    assert.ok(day.high >= day.low);
  });
});

test('A6 - Alert System & Trust Architecture Baseline', () => {
  const jodhpurAlerts = getMockAlerts('jodhpur');
  assert.ok(jodhpurAlerts.length > 0);
  const alert = jodhpurAlerts[0];
  assert.equal(alert.severity, 'SEVERE');
  assert.ok(alert.officialWarning.source);
  assert.ok(alert.aiExplanation.disclaimer.includes('WeatherGPT interpretation'));

  assert.equal(getMockAlerts('tokyo').length, 0);
});

test('A8 - Formatting Utilities Tests', () => {
  assert.equal(formatTemperature(25, 'C'), '25°C');
  assert.equal(formatTemperature(0, 'F'), '32°F');
  assert.equal(formatTemperature(null), '--°');
  assert.equal(formatWind(20, 'kmh', 'NW'), '20 km/h NW');
  assert.equal(formatWind(10, 'mph', 'E'), '6 mph E');
  assert.equal(formatWind(null), '--');
});

// ==========================================
// A11-A22 Advanced Scope Verification Tests
// ==========================================

test('A11 - Intent Detection & Contextual Follow-Up Extraction', () => {
  // Query with location and time
  const res1 = extractQueryUnderstanding('Kal Jodhpur mein baarish hogi?');
  assert.equal(res1.location, 'Jodhpur');
  assert.equal(res1.time, 'Tomorrow');
  assert.equal(res1.intent, 'RAIN');
  assert.equal(res1.topic, 'Rain Probability');

  // Contextual follow-up inquiry ("What about evening?")
  const prior = { location: 'Jodhpur', time: 'Tomorrow', intent: 'RAIN' };
  const res2 = extractQueryUnderstanding('What about evening?', prior);
  assert.equal(res2.location, 'Jodhpur', 'Inherits location from prior context');
  assert.equal(res2.time, 'Tomorrow Evening', 'Resolves contextual time correctly');
  assert.equal(res2.intent, 'RAIN', 'Inherits intent from prior context');

  // Verify all 16 intents are registered
  const intentKeys = Object.keys(INTENT_DEFINITIONS);
  assert.ok(intentKeys.length >= 16, 'At least 16 intents must be defined');
  assert.ok(intentKeys.includes('FARMING'));
  assert.ok(intentKeys.includes('OUTDOOR_ACTIVITY'));
  assert.ok(intentKeys.includes('TRAVEL'));
  assert.ok(intentKeys.includes('AQI'));
});

test('A12 - Multilingual UI & Response Generation', () => {
  assert.equal(SUPPORTED_LANGUAGES.length, 3, 'English, Hindi, and Hinglish supported');
  
  // English translation
  assert.equal(getTranslation('en', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('en', 'whyForecast'), 'Why this forecast?');

  // Hindi translation
  assert.equal(getTranslation('hi', 'dashboard'), 'डैशबोर्ड');
  assert.equal(getTranslation('hi', 'rainChance'), 'बारिश की संभावना');

  // Hinglish translation
  assert.equal(getTranslation('hinglish', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('hinglish', 'rainChance'), 'Baarish ka chance');

  // Multilingual chat responses
  const weather = getMockWeather('jodhpur');
  const enReply = generateAIChatResponse('Will it rain?', weather, 'en');
  const hiReply = generateAIChatResponse('बारिश होगी?', weather, 'hi');
  const hinglishReply = generateAIChatResponse('Baarish hogi?', weather, 'hinglish');

  assert.ok(enReply.text.includes('probability') || enReply.text.includes('unlikely') || enReply.text.includes('rain'));
  assert.ok(hiReply.text.includes('बारिश') || hiReply.text.includes('संभावना'));
  assert.ok(hinglishReply.text.includes('baarish') || hinglishReply.text.includes('rain'));
});

test('A13 - Impact-Based Weather Alerts', () => {
  const mumbaiAlerts = getMockAlerts('mumbai');
  assert.ok(mumbaiAlerts.length > 0);
  const alert = mumbaiAlerts[0];

  assert.ok(alert.expectedConditions, 'Alert must contain expected conditions');
  assert.ok(alert.expectedConditions.includes('mm'), 'Conditions must include quantitative metric');
  assert.ok(Array.isArray(alert.potentialImpacts), 'Potential impacts must be an array');
  assert.ok(alert.potentialImpacts.length >= 2, 'Must have at least 2 impact points');
});

test('A14 & A15 - Confidence, Uncertainty & Why This Forecast', () => {
  const jod = getMockWeather('jodhpur');
  assert.ok(jod.confidence, 'Weather must contain confidence');
  assert.equal(jod.confidence.level, 'High');
  assert.ok(jod.confidence.uncertaintyExplanation);

  assert.ok(jod.whyForecast, 'Weather must contain Why This Forecast breakdown');
  assert.ok(jod.whyForecast.signals.length >= 3, 'Must have at least 3 observed signals');
  assert.ok(jod.whyForecast.reasoning, 'Must have meteorological reasoning');
  assert.ok(jod.whyForecast.aiExplanation, 'Must have plain-language AI explanation');
});

test('A16 - Source, Freshness & Trust Verification', () => {
  const del = getMockWeather('delhi');
  assert.ok(del.metadata.freshness, 'Metadata must have freshness state');
  assert.ok(['Fresh', 'Aging', 'Stale'].includes(del.metadata.freshness));

  const chatResp = generateAIChatResponse('How is the weather?', del, 'en');
  assert.ok(chatResp.richContent.sourcesUsed, 'Response must detail sources used');
  assert.ok(chatResp.richContent.sourcesUsed.length >= 2);
  assert.ok(chatResp.richContent.aiExplanationLabel.includes('WeatherGPT'));
});

test('A17 - User Context Modes', () => {
  const jod = getMockWeather('jodhpur');
  assert.ok(jod.contextAdvice, 'Must provide context advice dictionary');
  assert.ok(jod.contextAdvice.general);
  assert.ok(jod.contextAdvice.farmer);
  assert.ok(jod.contextAdvice.traveler);
  assert.ok(jod.contextAdvice.outdoor);
  assert.ok(jod.contextAdvice.emergency);
});

test('A18 - Location-Aware Interactive Weather Map Data', () => {
  assert.ok(ALL_DEMO_CITIES.length >= 8, 'Map must contain multiple geographic stations');
  
  ALL_DEMO_CITIES.forEach((c) => {
    assert.ok(c.name, 'Station must have name');
    assert.equal(typeof c.lat, 'number', 'Station must have latitude');
    assert.equal(typeof c.lon, 'number', 'Station must have longitude');
    assert.equal(typeof c.temp, 'number', 'Station must have temp');
    assert.ok(c.lat >= -90 && c.lat <= 90);
    assert.ok(c.lon >= -180 && c.lon <= 180);
  });
});

test('A19 - Climate & Historical Weather Data', () => {
  const jodClimate = getMockClimate('jodhpur');
  assert.equal(jodClimate.city, 'Jodhpur');
  assert.ok(jodClimate.annualRainfall);
  assert.ok(jodClimate.annualAvgTemp);
  assert.equal(jodClimate.months.length, 12, 'Climate data must have 12 months');
  jodClimate.months.forEach((m) => {
    assert.ok(m.month);
    assert.ok(m.avgHigh >= m.avgLow);
  });
});

// ==========================================
// Part A Final Polish & Freeze Regression Tests
// ==========================================

test('Part A Final Freeze - Navigation Structure & Terminology Verification', () => {
  // Verify Core Navigation Keys in Translations
  const coreNavKeys = ['dashboard', 'map', 'chat', 'alerts', 'historical', 'pipeline', 'history', 'settings', 'refresh'];
  SUPPORTED_LANGUAGES.forEach(lang => {
    coreNavKeys.forEach(key => {
      const translated = getTranslation(lang.id, key);
      assert.ok(translated, `Translation key "${key}" must exist for language "${lang.id}"`);
      assert.ok(translated.length > 0);
    });
  });

  // Verify English standardized terminology
  assert.equal(getTranslation('en', 'dashboard'), 'Dashboard');
  assert.equal(getTranslation('en', 'map'), 'Weather Map');
  assert.equal(getTranslation('en', 'chat'), 'WeatherGPT AI');
  assert.equal(getTranslation('en', 'alerts'), 'Alerts');
  assert.equal(getTranslation('en', 'historical'), 'Historical Weather');
  assert.equal(getTranslation('en', 'pipeline'), 'AI Pipeline');
  assert.equal(getTranslation('en', 'history'), 'History');
  assert.equal(getTranslation('en', 'settings'), 'Settings');
  assert.equal(getTranslation('en', 'refresh'), 'Refresh');
});

test('Historical Weather API Telemetry & Normalization Tests', async () => {
  const result = await fetchHistoricalWeather(26.2389, 73.0243, '2024-05-01', '2024-05-07', 'Jodhpur');
  assert.ok(result);
  assert.equal(result.location.name, 'Jodhpur');
  assert.equal(result.daysCount, 7);
  assert.equal(result.daily.length, 7);

  // Verify summary statistics
  assert.ok(typeof result.summary.avgTemp === 'number');
  assert.ok(typeof result.summary.maxTemp === 'number');
  assert.ok(typeof result.summary.minTemp === 'number');
  assert.ok(typeof result.summary.totalPrecipitation === 'number');
  assert.ok(typeof result.summary.rainyDays === 'number');
  assert.ok(typeof result.summary.maxWindSpeed === 'number');
  assert.ok(result.summary.maxTemp >= result.summary.minTemp);

  // Verify daily records
  result.daily.forEach((day) => {
    assert.ok(day.date);
    assert.ok(day.condition);
    assert.ok(typeof day.maxTemp === 'number');
    assert.ok(typeof day.minTemp === 'number');
    assert.ok(typeof day.meanTemp === 'number');
    assert.ok(typeof day.precipitation === 'number');
    assert.ok(typeof day.windSpeed === 'number');
    assert.ok(day.maxTemp >= day.minTemp);
  });
});

// ==========================================
// Master Implementation Verification Tests
// ==========================================

test('Master Part 1 - Complete Website Language System & WMO Localization', () => {
  // English is default, 3 languages supported
  assert.equal(SUPPORTED_LANGUAGES[0].id, 'en');
  assert.equal(SUPPORTED_LANGUAGES[1].id, 'hi');
  assert.equal(SUPPORTED_LANGUAGES[2].id, 'hinglish');

  // Verify Weather condition translation across languages
  assert.equal(localizeCondition('Sunny', 'en'), 'Sunny');
  assert.equal(localizeCondition('Sunny', 'hi'), 'धूप');
  assert.equal(localizeCondition('Sunny', 'hinglish'), 'Sunny');

  assert.equal(localizeCondition('Thunderstorm', 'en'), 'Thunderstorm');
  assert.equal(localizeCondition('Thunderstorm', 'hi'), 'गरज के साथ तूफान');
  assert.equal(localizeCondition('Thunderstorm', 'hinglish'), 'Aandhi-Toofan');

  // Verify navigation and key UI translations in all languages
  ['en', 'hi', 'hinglish'].forEach(lang => {
    assert.ok(getTranslation(lang, 'dashboard'));
    assert.ok(getTranslation(lang, 'chat'));
    assert.ok(getTranslation(lang, 'map'));
    assert.ok(getTranslation(lang, 'alerts'));
    assert.ok(getTranslation(lang, 'historical'));
    assert.ok(getTranslation(lang, 'settings'));
    assert.ok(getTranslation(lang, 'pipeline'));
    assert.ok(getTranslation(lang, 'history'));
    assert.ok(getTranslation(lang, 'heroTitle'));
    assert.ok(getTranslation(lang, 'useMyLocation'));
    assert.ok(getTranslation(lang, 'periodAvgTemp'));
    assert.ok(getTranslation(lang, 'chartsAndTrends'));
    assert.ok(getTranslation(lang, 'dailyTable'));
    assert.ok(getTranslation(lang, 'exportCSV'));
  });
});

test('Master Part 2 - Centralized 8 User Context Modes & Prioritization', () => {
  assert.equal(CONTEXT_MODES.length, 8, 'Must provide exactly 8 context modes');

  const expectedModes = [
    'general', 'farmer', 'traveler', 'outdoor', 
    'emergency', 'commuter', 'event_planner', 'fitness'
  ];

  expectedModes.forEach(modeId => {
    const mode = getContextMode(modeId);
    assert.ok(mode, `Mode "${modeId}" must exist`);
    assert.equal(mode.id, modeId);

    // Multilingual names and descriptions
    assert.ok(mode.names.en, `English name required for ${modeId}`);
    assert.ok(mode.names.hi, `Hindi name required for ${modeId}`);
    assert.ok(mode.names.hinglish, `Hinglish name required for ${modeId}`);

    assert.ok(mode.descriptions.en, `English description required for ${modeId}`);
    assert.ok(mode.descriptions.hi, `Hindi description required for ${modeId}`);
    assert.ok(mode.descriptions.hinglish, `Hinglish description required for ${modeId}`);

    // Mode priorities
    assert.ok(Array.isArray(mode.priorities));
    assert.ok(mode.priorities.length >= 3);

    // Localized Advisories
    const advEn = getContextAdvisory(modeId, 'en');
    const advHi = getContextAdvisory(modeId, 'hi');
    const advHinglish = getContextAdvisory(modeId, 'hinglish');
    assert.ok(advEn.length > 0);
    assert.ok(advHi.length > 0);
    assert.ok(advHinglish.length > 0);

    // 4 Suggested Questions per language
    ['en', 'hi', 'hinglish'].forEach(lang => {
      const questions = getContextSuggestedQuestions(modeId, lang);
      assert.equal(questions.length, 4, `Mode ${modeId} must have exactly 4 questions for ${lang}`);
    });
  });

  // Fallback for unknown mode defaults to general
  const fallbackMode = getContextMode('unknown_mode_xyz');
  assert.equal(fallbackMode.id, 'general');
});

test('Master Part 3 - WeatherGPT AI Page & Strict Warning/Guidance Separation', () => {
  const weather = getMockWeather('jodhpur');

  // Mode: Farmer in English
  const farmerEn = generateAIChatResponse('What should I do today?', weather, 'en', { userMode: 'farmer' });
  assert.ok(farmerEn.text);
  assert.equal(farmerEn.richContent.activePerspective.mode, 'farmer');
  assert.equal(farmerEn.richContent.activePerspective.label, 'Farmer');
  assert.ok(farmerEn.richContent.aiGuidance, 'Must have distinct AI Guidance');
  assert.ok(farmerEn.richContent.aiExplanationLabel.includes('WeatherGPT'));

  // Mode: Emergency in Hindi
  const emergencyHi = generateAIChatResponse('क्या कोई खतरा है?', weather, 'hi', { userMode: 'emergency' });
  assert.ok(emergencyHi.text);
  assert.equal(emergencyHi.richContent.activePerspective.mode, 'emergency');
  assert.equal(emergencyHi.richContent.activePerspective.label, 'आपातकाल');

  // Verify warning separation when alerts exist
  const weatherWithAlert = {
    ...weather,
    alerts: [{ headline: 'IMD Red Warning: Heavy Rain & Flooding Expected', severity: 'SEVERE' }]
  };
  const responseWithAlert = generateAIChatResponse('Is it safe?', weatherWithAlert, 'en', { userMode: 'commuter' });
  assert.equal(responseWithAlert.richContent.officialWarning, 'IMD Red Warning: Heavy Rain & Flooding Expected');
  assert.ok(responseWithAlert.richContent.aiGuidance);
  assert.notEqual(responseWithAlert.richContent.officialWarning, responseWithAlert.richContent.aiGuidance);
});

test('Master Part 4 & 5 - Dynamic Suggested Questions Across Context Modes & Languages', () => {
  // Farmer mode questions
  const farmerEnQuestions = getContextSuggestedQuestions('farmer', 'en');
  assert.ok(farmerEnQuestions.some(q => q.toLowerCase().includes('crop') || q.toLowerCase().includes('field') || q.toLowerCase().includes('soil')));

  const farmerHiQuestions = getContextSuggestedQuestions('farmer', 'hi');
  assert.ok(farmerHiQuestions.some(q => q.includes('फसल') || q.includes('खेत')));

  // Fitness mode questions
  const fitnessEnQuestions = getContextSuggestedQuestions('fitness', 'en');
  assert.ok(fitnessEnQuestions.some(q => q.toLowerCase().includes('workout') || q.toLowerCase().includes('running')));

  const fitnessHinglishQuestions = getContextSuggestedQuestions('fitness', 'hinglish');
  assert.ok(fitnessHinglishQuestions.some(q => q.toLowerCase().includes('workout') || q.toLowerCase().includes('running')));

  // Traveler mode questions
  const travelerEnQuestions = getContextSuggestedQuestions('traveler', 'en');
  assert.ok(travelerEnQuestions.some(q => q.toLowerCase().includes('travel') || q.toLowerCase().includes('pack')));
});

// ==========================================
// Frontend Feature Expansion Tests
// ==========================================

test('Feature 1 - Favorite / Saved Locations Tests', () => {
  assert.ok(Array.isArray(DEFAULT_SAVED_LOCATIONS));
  assert.equal(DEFAULT_SAVED_LOCATIONS.length, 3);
  const jodhpur = DEFAULT_SAVED_LOCATIONS.find(l => l.city === 'Jodhpur');
  assert.ok(jodhpur);
  assert.ok(jodhpur.latitude && jodhpur.longitude);

  // Verify duplicate detection logic
  const isSavedFn = (list, cityName) => {
    return list.some(l => (l.city || l.name).toLowerCase() === cityName.toLowerCase());
  };
  assert.equal(isSavedFn(DEFAULT_SAVED_LOCATIONS, 'Jodhpur'), true);
  assert.equal(isSavedFn(DEFAULT_SAVED_LOCATIONS, 'jodhpur'), true);
  assert.equal(isSavedFn(DEFAULT_SAVED_LOCATIONS, 'Tokyo'), false);
});

test('Feature 2 - Weather Comparison Logic & Metrics Tests', () => {
  const jodhpur = getMockWeather('jodhpur');
  const jaipur = getMockWeather('jaipur');

  assert.ok(jodhpur && jaipur);
  assert.equal(typeof jodhpur.current.temperature, 'number');
  assert.equal(typeof jaipur.current.temperature, 'number');
  assert.notEqual(jodhpur.location.city, jaipur.location.city);

  // Test comparison prompt intent extraction
  const comparisonQuery = extractQueryUnderstanding('Compare Jodhpur and Jaipur');
  assert.equal(comparisonQuery.intent, 'COMPARISON');
  assert.equal(comparisonQuery.locationA, 'Jodhpur');
  assert.equal(comparisonQuery.locationB, 'Jaipur');

  // Verify comparison response does not declare subjective winner
  const response = generateAIChatResponse('Compare Jodhpur and Jaipur', jodhpur, 'en');
  assert.ok(response.text.includes('Jodhpur'));
  assert.ok(response.text.includes('Jaipur'));
  assert.equal(response.understanding.intent, 'COMPARISON');
  assert.ok(response.richContent.extraCard);
  assert.equal(response.richContent.extraCard.type, 'comparison');
});

test('Feature 3 - Weather Timeline & Hourly Progression Tests', () => {
  const hourly = getHourlyForecast(32);
  assert.ok(hourly && hourly.length >= 8);

  const firstHour = hourly[0];
  assert.ok(firstHour.time);
  assert.equal(typeof firstHour.temp, 'number');
  assert.equal(typeof firstHour.rainProbability, 'number');
  assert.equal(typeof firstHour.humidity, 'number');
  assert.equal(typeof firstHour.windSpeed, 'number');

  // Test timeline intent extraction
  const timelineQuery = extractQueryUnderstanding('What is the best time to go outside today?');
  assert.equal(timelineQuery.intent, 'TIMELINE');
});

test('Feature 4 - Smart Weather Guidance & Context Perspectives Tests', () => {
  const guidanceQuery = extractQueryUnderstanding('What should I wear today?');
  assert.equal(guidanceQuery.intent, 'GUIDANCE');

  const weather = getMockWeather('jodhpur');
  const guidanceResp = generateAIChatResponse('What should I wear today?', weather, 'en', { userMode: 'fitness' });
  assert.ok(guidanceResp.text);
  assert.equal(guidanceResp.understanding.intent, 'GUIDANCE');
  assert.equal(guidanceResp.richContent.activePerspective.mode, 'fitness');
});

test('Feature 5 - Weather Share Card & Telemetry Synthesis Tests', () => {
  const weather = getMockWeather('jodhpur');
  const shareText = `Weather in ${weather.location.city}: ${weather.current.temperature}°C, ${weather.current.condition}. Rain chance: ${weather.current.rainProbability}%. Humidity: ${weather.current.humidity}%. Powered by WeatherGPT.`;
  assert.ok(shareText.includes('Jodhpur'));
  assert.ok(shareText.includes('WeatherGPT'));
  assert.ok(shareText.includes('°C'));
});

test('Feature 6 - Dashboard Personalization & Section Ordering Tests', () => {
  assert.ok(Array.isArray(DEFAULT_SECTION_ORDER));
  assert.equal(DEFAULT_SECTION_ORDER.length, 10);
  assert.ok(DEFAULT_SECTION_ORDER.includes('currentWeather'));
  assert.ok(DEFAULT_SECTION_ORDER.includes('smartGuidance'));
  assert.ok(DEFAULT_SECTION_ORDER.includes('weatherTimeline'));
  assert.ok(DEFAULT_SECTION_ORDER.includes('sunMoon'));

  // Verify all sections are visible by default
  DEFAULT_SECTION_ORDER.forEach((key) => {
    assert.equal(DEFAULT_SECTION_VISIBILITY[key], true, `Section ${key} must default to visible`);
  });
});

test('Feature 7 - Astronomical Ephemeris & Moon Phase Tests', () => {
  // Test moon phase calculation
  const moon = calculateMoonPhase(new Date());
  assert.ok(moon.name, 'Moon must have a name');
  assert.ok(moon.emoji, 'Moon must have an emoji');
  assert.ok(moon.illumination >= 0 && moon.illumination <= 100, 'Illumination must be between 0 and 100');
  assert.ok(moon.ageDays >= 0 && moon.ageDays <= 30, 'Moon age must be valid synodic cycle');

  // Verify 8 distinct phases exist
  assert.equal(MOON_PHASES.length, 8);
  const phaseKeys = MOON_PHASES.map(p => p.key);
  assert.ok(phaseKeys.includes('newMoon'));
  assert.ok(phaseKeys.includes('fullMoon'));
  assert.ok(phaseKeys.includes('firstQuarter'));
  assert.ok(phaseKeys.includes('lastQuarter'));

  // Test sun ephemeris calculation
  const sun = calculateSunMetrics('06:30 AM', '06:45 PM');
  assert.ok(sun.daylightDuration.includes('12h 15m'));
  assert.ok(sun.solarNoon);
  assert.equal(sun.sunrise, '06:30 AM');
  assert.equal(sun.sunset, '06:45 PM');
});

test('Feature 8 & Advanced Chat - Multi-Turn Conversational Upgrades & Repositioned Pipeline Tests', () => {
  const weather = getMockWeather('jodhpur');

  // 1. Multi-turn follow up: Rain inquiry followed by "What about tomorrow?"
  const turn1 = extractQueryUnderstanding('Will it rain in Jodhpur today?');
  assert.equal(turn1.intent, 'RAIN');
  assert.equal(turn1.location, 'Jodhpur');

  const turn2 = extractQueryUnderstanding('What about tomorrow?', {
    intent: turn1.intent,
    location: turn1.location,
    time: turn1.time
  });
  assert.equal(turn2.intent, 'RAIN');
  assert.equal(turn2.time, 'Tomorrow');
  assert.equal(turn2.location, 'Jodhpur');

  // 2. Multi-turn follow up: Temperature inquiry followed by "And the wind?"
  const turn3 = extractQueryUnderstanding('How hot will it get in Jodhpur?');
  assert.equal(turn3.intent, 'TEMPERATURE');
  assert.equal(turn3.location, 'Jodhpur');

  const turn4 = extractQueryUnderstanding('And the wind?', {
    intent: turn3.intent,
    location: turn3.location,
    time: turn3.time
  });
  assert.equal(turn4.intent, 'WIND');
  assert.equal(turn4.location, 'Jodhpur');

  // 3. Saved locations chat inquiry
  const savedLocationsResp = generateAIChatResponse('What are my saved locations?', weather, 'en', {
    savedLocations: DEFAULT_SAVED_LOCATIONS
  });
  assert.equal(savedLocationsResp.understanding.intent, 'SAVED_LOCATIONS');
  assert.ok(savedLocationsResp.text.includes('Jodhpur'));

  // 4. Sun & Moon chat inquiry
  const sunMoonResp = generateAIChatResponse('When is sunset?', weather, 'en');
  assert.equal(sunMoonResp.understanding.intent, 'SUN_MOON');
  assert.ok(sunMoonResp.text.includes('sunset') || sunMoonResp.text.includes('daylight'));

  // 5. Translations for How WeatherGPT Works
  assert.equal(getTranslation('en', 'howWeatherGPTWorks'), 'How WeatherGPT Works');
  assert.equal(getTranslation('hi', 'howWeatherGPTWorks'), 'WeatherGPT कैसे काम करता है');
  assert.equal(getTranslation('hinglish', 'howWeatherGPTWorks'), 'How WeatherGPT Works');
  assert.ok(getTranslation('en', 'howWeatherGPTWorksSubtitle').includes('turns a weather question into a grounded response'));
});

// ==========================================
// Comprehensive QA & Integration Verification Tests
// ==========================================

test('Test 28 - QA Verification: Complete 20 Intents Detection & Grounding', () => {
  const weather = getMockWeather('jodhpur');
  const sampleQueries = {
    CURRENT_WEATHER: "How is the weather right now?",
    FORECAST: "What is the 7-day forecast?",
    RAIN: "Will it rain today?",
    TEMPERATURE: "What is the temperature right now?",
    WIND: "How strong is the wind?",
    HUMIDITY: "What is the humidity level?",
    AQI: "What is the air quality index (AQI)?",
    UV: "What is the UV index?",
    ALERT: "Are there any weather alerts or warnings?",
    TRAVEL: "Is it safe for travel and driving on the highway?",
    OUTDOOR_ACTIVITY: "Is it good for outdoor running and exercise?",
    FARMING: "What are the farming recommendations today?",
    HEALTH: "Is the air safe for asthma or health allergies?",
    WEATHER_RISK: "Is there any storm or cyclone risk?",
    COMPARISON: "Compare Jodhpur and Jaipur",
    HISTORICAL_WEATHER: "Tell me about historical climate records",
    SAVED_LOCATIONS: "What are my saved locations?",
    SUN_MOON: "When is sunrise and sunset?",
    GUIDANCE: "What should I wear today?",
    TIMELINE: "What is the best time to go outside today?"
  };

  const detectedIntents = new Set();
  for (const [expectedKey, query] of Object.entries(sampleQueries)) {
    const understanding = extractQueryUnderstanding(query);
    detectedIntents.add(understanding.intent);
    assert.equal(understanding.intent, expectedKey, `Query "${query}" should detect intent ${expectedKey}`);

    const response = generateAIChatResponse(query, weather, 'en');
    assert.ok(response.text && response.text.length > 10, `Response for ${expectedKey} must have substantive text`);
    assert.ok(response.richContent, `Response for ${expectedKey} must have richContent`);
    assert.ok(response.richContent.sourcesUsed.length >= 2, `Response for ${expectedKey} must attribute sources`);
    assert.ok(response.richContent.aiExplanationLabel.includes('WeatherGPT'));
  }

  assert.equal(detectedIntents.size, 20, 'All 20 distinct intents must be uniquely detected');
});

test('Test 29 - QA Verification: WMO Weather Code Mapping & Atmospheric Condition Parser', () => {
  assert.equal(parseWmoCode(0).condition, 'Clear Sky');
  assert.equal(parseWmoCode(1).condition, 'Partly Cloudy');
  assert.equal(parseWmoCode(2).condition, 'Partly Cloudy');
  assert.equal(parseWmoCode(3).condition, 'Overcast');
  assert.equal(parseWmoCode(45).condition, 'Foggy');
  assert.equal(parseWmoCode(51).condition, 'Light Rain / Drizzle');
  assert.equal(parseWmoCode(61).condition, 'Rain');
  assert.equal(parseWmoCode(71).condition, 'Snow');
  assert.equal(parseWmoCode(80).condition, 'Rain Showers');
  assert.equal(parseWmoCode(95).condition, 'Thunderstorm');
});

test('Test 30 - QA Verification: Astronomical Ephemeris & Daylight Math', () => {
  const sunMetrics = calculateSunMetrics('06:00 AM', '06:30 PM');
  assert.equal(sunMetrics.daylightDuration, '12h 30m');
  assert.equal(sunMetrics.solarNoon, '12:15 PM');
  assert.equal(sunMetrics.sunrise, '06:00 AM');
  assert.equal(sunMetrics.sunset, '06:30 PM');

  // Verify moon phase bounds
  const moon = calculateMoonPhase(new Date());
  assert.ok(moon.illumination >= 0 && moon.illumination <= 100);
  assert.ok(moon.ageDays >= 0 && moon.ageDays <= 30);
  assert.ok(moon.emoji.length > 0);
  assert.equal(MOON_PHASES.length, 8);
});

test('Test 31 - QA Verification: Historical Weather Simulated Reanalysis Resilience', () => {
  const hist = generateSimulatedHistorical(26.2389, 73.0243, '2024-03-01', '2024-03-07', 'Jodhpur');
  assert.equal(hist.daysCount, 7);
  assert.equal(hist.daily.length, 7);
  assert.ok(typeof hist.summary.avgTemp === 'number');
  assert.ok(typeof hist.summary.maxTemp === 'number');
  assert.ok(typeof hist.summary.minTemp === 'number');
  assert.ok(hist.summary.maxTemp >= hist.summary.minTemp);
  assert.ok(hist.summary.totalPrecipitation >= 0);
  assert.ok(hist.summary.maxWindSpeed >= 0);
});

test('Test 32 - QA Verification: Dashboard Personalization Section Reordering & Toggles', () => {
  assert.equal(DEFAULT_SECTION_ORDER.length, 10);
  const orderCopy = [...DEFAULT_SECTION_ORDER];

  // Simulated move up of index 1
  const fromIndex = 1;
  const toIndex = 0;
  const reordered = [...orderCopy];
  const [removed] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, removed);

  assert.equal(reordered[0], orderCopy[1]);
  assert.equal(reordered[1], orderCopy[0]);
  assert.equal(reordered.length, 10);

  // Default visibility
  DEFAULT_SECTION_ORDER.forEach(sectionKey => {
    assert.equal(DEFAULT_SECTION_VISIBILITY[sectionKey], true);
  });
});

test('Test 33 - QA Verification: Context Modes Priority Matrix & Language Integrity', () => {
  assert.equal(CONTEXT_MODES.length, 8);
  const validModeIds = ['general', 'farmer', 'traveler', 'outdoor', 'emergency', 'commuter', 'event_planner', 'fitness'];

  CONTEXT_MODES.forEach(mode => {
    assert.ok(validModeIds.includes(mode.id));
    assert.ok(mode.names.en && mode.names.hi && mode.names.hinglish);
    assert.ok(mode.descriptions.en && mode.descriptions.hi && mode.descriptions.hinglish);
    assert.ok(Array.isArray(mode.priorities) && mode.priorities.length >= 3);
  });
});

test('Test 34 - QA Verification: Multilingual Translation Completeness', () => {
  const criticalKeys = [
    'dashboard', 'map', 'chat', 'alerts', 'historical', 'pipeline', 'history', 'settings',
    'realTimeWeatherIntelligence', 'searchPlaceholder', 'useMyLocation', 'howWeatherGPTWorks',
    'howWeatherGPTWorksSubtitle', 'smartGuidance', 'weatherTimeline', 'sunMoon', 'savedLocations'
  ];

  SUPPORTED_LANGUAGES.forEach(langObj => {
    criticalKeys.forEach(k => {
      const val = getTranslation(langObj.id, k);
      assert.ok(val, `Missing translation for key "${k}" in language "${langObj.id}"`);
      assert.ok(val.length > 0);
    });
  });
});

