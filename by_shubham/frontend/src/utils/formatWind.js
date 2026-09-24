// Wind Speed Formatting Utility

export function formatWind(speedKmh, unit = 'kmh', direction = '') {
  if (speedKmh === undefined || speedKmh === null) return '--';

  let value = speedKmh;
  let label = 'km/h';

  if (unit === 'mph') {
    value = Math.round(speedKmh * 0.621371);
    label = 'mph';
  }

  const dirText = direction ? ` ${direction}` : '';
  return `${value} ${label}${dirText}`;
}
