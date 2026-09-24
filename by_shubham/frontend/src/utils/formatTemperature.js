// Temperature Formatting & Unit Conversion Utility

export function formatTemperature(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null) return '--°';

  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }

  return `${Math.round(celsius)}°C`;
}
