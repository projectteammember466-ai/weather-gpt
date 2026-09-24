// Forecast Mock Fixtures

export function getHourlyForecast(baseTemp = 30) {
  const hours = [
    "12:00 AM", "03:00 AM", "06:00 AM", "09:00 AM", 
    "12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"
  ];

  const tempOffsets = [-4, -6, -5, +1, +5, +6, +3, -1];
  const rainChances = [5, 5, 10, 10, 15, 20, 10, 5];
  const conditions = ["Clear", "Clear", "Clear", "Sunny", "Sunny", "Partly Cloudy", "Clear", "Clear"];
  const icons = ["Moon", "Moon", "Sun", "Sun", "Sun", "SunMedium", "Moon", "Moon"];
  const humidities = [55, 60, 58, 48, 38, 35, 42, 50];
  const windSpeeds = [10, 8, 9, 12, 16, 18, 14, 11];

  return hours.map((time, idx) => ({
    id: `h-${idx}`,
    time,
    temp: Math.round(baseTemp + tempOffsets[idx]),
    rainProbability: rainChances[idx],
    condition: conditions[idx],
    icon: icons[idx],
    humidity: humidities[idx],
    windSpeed: windSpeeds[idx]
  }));
}

export function getDailyForecast(baseTemp = 30) {
  const days = [
    { day: "Today", date: "Sep 20", condition: "Sunny", icon: "Sun", high: baseTemp + 2, low: baseTemp - 8, rain: 5 },
    { day: "Mon", date: "Sep 21", condition: "Sunny", icon: "Sun", high: baseTemp + 3, low: baseTemp - 7, rain: 10 },
    { day: "Tue", date: "Sep 22", condition: "Partly Cloudy", icon: "SunMedium", high: baseTemp + 1, low: baseTemp - 6, rain: 20 },
    { day: "Wed", date: "Sep 23", condition: "Rain Showers", icon: "CloudRain", high: baseTemp - 2, low: baseTemp - 9, rain: 65 },
    { day: "Thu", date: "Sep 24", condition: "Thunderstorm", icon: "CloudLightning", high: baseTemp - 4, low: baseTemp - 10, rain: 85 },
    { day: "Fri", date: "Sep 25", condition: "Cloudy", icon: "Cloud", high: baseTemp - 1, low: baseTemp - 8, rain: 30 },
    { day: "Sat", date: "Sep 26", condition: "Sunny", icon: "Sun", high: baseTemp + 2, low: baseTemp - 7, rain: 5 }
  ];

  return days;
}
