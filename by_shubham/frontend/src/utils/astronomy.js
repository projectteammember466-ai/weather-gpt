// Astronomical Utilities for WeatherGPT (Deterministic Sun & Moon Calculations)

// Reference New Moon: Jan 11, 2024, 11:57:00 UTC
const REF_NEW_MOON_MS = Date.UTC(2024, 0, 11, 11, 57, 0);
const SYNODIC_MONTH_DAYS = 29.53058770576;
const SYNODIC_MONTH_MS = SYNODIC_MONTH_DAYS * 24 * 60 * 60 * 1000;

export const MOON_PHASES = [
  { key: 'newMoon', icon: 'Circle', emoji: '🌑', defaultName: 'New Moon' },
  { key: 'waxingCrescent', icon: 'Moon', emoji: '🌒', defaultName: 'Waxing Crescent' },
  { key: 'firstQuarter', icon: 'Moon', emoji: '🌓', defaultName: 'First Quarter' },
  { key: 'waxingGibbous', icon: 'Moon', emoji: '🌔', defaultName: 'Waxing Gibbous' },
  { key: 'fullMoon', icon: 'Sun', emoji: '🌕', defaultName: 'Full Moon' },
  { key: 'waningGibbous', icon: 'Moon', emoji: '🌖', defaultName: 'Waning Gibbous' },
  { key: 'lastQuarter', icon: 'Moon', emoji: '🌗', defaultName: 'Last Quarter' },
  { key: 'waningCrescent', icon: 'Moon', emoji: '🌘', defaultName: 'Waning Crescent' }
];

/**
 * Calculates current Moon Phase and Illumination percentage deterministically.
 */
export function calculateMoonPhase(targetDate = new Date()) {
  const d = new Date(targetDate);
  const diffMs = d.getTime() - REF_NEW_MOON_MS;
  const cycles = diffMs / SYNODIC_MONTH_MS;
  const phaseNormalized = cycles - Math.floor(cycles); // 0.0 to 1.0
  const ageDays = (phaseNormalized * SYNODIC_MONTH_DAYS).toFixed(1);

  // Illumination: 0% at New Moon, 100% at Full Moon
  const illumination = Math.round((1 - Math.cos(phaseNormalized * 2 * Math.PI)) / 2 * 100);

  let phaseIndex = 0;
  if (phaseNormalized < 0.03 || phaseNormalized >= 0.97) {
    phaseIndex = 0; // New Moon
  } else if (phaseNormalized < 0.22) {
    phaseIndex = 1; // Waxing Crescent
  } else if (phaseNormalized < 0.28) {
    phaseIndex = 2; // First Quarter
  } else if (phaseNormalized < 0.47) {
    phaseIndex = 3; // Waxing Gibbous
  } else if (phaseNormalized < 0.53) {
    phaseIndex = 4; // Full Moon
  } else if (phaseNormalized < 0.72) {
    phaseIndex = 5; // Waning Gibbous
  } else if (phaseNormalized < 0.78) {
    phaseIndex = 6; // Last Quarter
  } else {
    phaseIndex = 7; // Waning Crescent
  }

  const phaseMeta = MOON_PHASES[phaseIndex];

  return {
    key: phaseMeta.key,
    name: phaseMeta.defaultName,
    emoji: phaseMeta.emoji,
    icon: phaseMeta.icon,
    illumination,
    ageDays: parseFloat(ageDays),
    phaseFraction: parseFloat(phaseNormalized.toFixed(3))
  };
}

/**
 * Parses time string e.g. "06:15 AM", "18:45", "06:45 PM" to minutes past midnight
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const clean = timeStr.trim();
  
  // Check AM/PM format
  const is12Hour = /am|pm/i.test(clean);
  const parts = clean.replace(/[^\d:]/g, '').split(':');
  if (parts.length < 2) return null;

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;

  if (is12Hour) {
    const isPM = /pm/i.test(clean);
    const isAM = /am/i.test(clean);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Calculates daylight duration string (e.g. "12h 30m") and solar noon from sunrise and sunset
 */
export function calculateSunMetrics(sunriseStr = "06:15 AM", sunsetStr = "06:45 PM") {
  const riseMins = parseTimeToMinutes(sunriseStr) ?? (6 * 60 + 15);
  const setMins = parseTimeToMinutes(sunsetStr) ?? (18 * 60 + 45);

  let diffMins = setMins - riseMins;
  if (diffMins < 0) diffMins += 24 * 60; // Crosses midnight

  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  const durationFormatted = `${hours}h ${minutes}m`;

  const noonMins = Math.round(riseMins + diffMins / 2) % (24 * 60);
  const noonH = Math.floor(noonMins / 60);
  const noonM = noonMins % 60;
  const noon12 = noonH % 12 || 12;
  const noonAmPm = noonH >= 12 ? 'PM' : 'AM';
  const solarNoonFormatted = `${String(noon12).padStart(2, '0')}:${String(noonM).padStart(2, '0')} ${noonAmPm}`;

  return {
    daylightDuration: durationFormatted,
    daylightMinutes: diffMins,
    solarNoon: solarNoonFormatted,
    sunrise: sunriseStr,
    sunset: sunsetStr
  };
}
