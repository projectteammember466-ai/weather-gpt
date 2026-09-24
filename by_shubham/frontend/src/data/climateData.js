// Climate & Historical Weather Mock Fixtures (A19)

export const MOCK_CLIMATE_BY_CITY = {
  jodhpur: {
    city: "Jodhpur",
    climateType: "Hot Semi-Arid / Desert (BWh)",
    annualRainfall: "360 mm",
    annualAvgTemp: "27.5°C",
    historicalTrend: "+0.8°C over past 20 years",
    months: [
      { month: "Jan", avgHigh: 25, avgLow: 10, rainfall: 4 },
      { month: "Feb", avgHigh: 28, avgLow: 13, rainfall: 5 },
      { month: "Mar", avgHigh: 34, avgLow: 19, rainfall: 3 },
      { month: "Apr", avgHigh: 39, avgLow: 24, rainfall: 2 },
      { month: "May", avgHigh: 42, avgLow: 28, rainfall: 10 },
      { month: "Jun", avgHigh: 40, avgLow: 29, rainfall: 35 },
      { month: "Jul", avgHigh: 35, avgLow: 27, rainfall: 120 },
      { month: "Aug", avgHigh: 33, avgLow: 25, rainfall: 130 },
      { month: "Sep", avgHigh: 34, avgLow: 24, rainfall: 45 },
      { month: "Oct", avgHigh: 36, avgLow: 20, rainfall: 5 },
      { month: "Nov", avgHigh: 31, avgLow: 15, rainfall: 1 },
      { month: "Dec", avgHigh: 26, avgLow: 11, rainfall: 2 }
    ]
  },
  delhi: {
    city: "Delhi",
    climateType: "Monsoon-influenced Humid Subtropical (Cwa)",
    annualRainfall: "790 mm",
    annualAvgTemp: "25.0°C",
    historicalTrend: "+0.6°C over past 20 years",
    months: [
      { month: "Jan", avgHigh: 21, avgLow: 8, rainfall: 15 },
      { month: "Feb", avgHigh: 24, avgLow: 11, rainfall: 18 },
      { month: "Mar", avgHigh: 30, avgLow: 16, rainfall: 14 },
      { month: "Apr", avgHigh: 37, avgLow: 22, rainfall: 12 },
      { month: "May", avgHigh: 40, avgLow: 26, rainfall: 30 },
      { month: "Jun", avgHigh: 39, avgLow: 28, rainfall: 75 },
      { month: "Jul", avgHigh: 35, avgLow: 27, rainfall: 235 },
      { month: "Aug", avgHigh: 34, avgLow: 26, rainfall: 245 },
      { month: "Sep", avgHigh: 34, avgLow: 25, rainfall: 125 },
      { month: "Oct", avgHigh: 33, avgLow: 19, rainfall: 15 },
      { month: "Nov", avgHigh: 28, avgLow: 13, rainfall: 5 },
      { month: "Dec", avgHigh: 23, avgLow: 9, rainfall: 8 }
    ]
  },
  mumbai: {
    city: "Mumbai",
    climateType: "Tropical Wet and Dry (Aw)",
    annualRainfall: "2,210 mm",
    annualAvgTemp: "27.2°C",
    historicalTrend: "+0.7°C over past 20 years",
    months: [
      { month: "Jan", avgHigh: 31, avgLow: 17, rainfall: 1 },
      { month: "Feb", avgHigh: 32, avgLow: 18, rainfall: 1 },
      { month: "Mar", avgHigh: 33, avgLow: 21, rainfall: 1 },
      { month: "Apr", avgHigh: 33, avgLow: 24, rainfall: 2 },
      { month: "May", avgHigh: 34, avgLow: 27, rainfall: 12 },
      { month: "Jun", avgHigh: 32, avgLow: 26, rainfall: 520 },
      { month: "Jul", avgHigh: 30, avgLow: 25, rainfall: 800 },
      { month: "Aug", avgHigh: 30, avgLow: 25, rainfall: 550 },
      { month: "Sep", avgHigh: 31, avgLow: 25, rainfall: 320 },
      { month: "Oct", avgHigh: 33, avgLow: 24, rainfall: 60 },
      { month: "Nov", avgHigh: 33, avgLow: 21, rainfall: 10 },
      { month: "Dec", avgHigh: 32, avgLow: 18, rainfall: 2 }
    ]
  }
};

export function getMockClimate(city = "jodhpur") {
  const key = city.trim().toLowerCase();
  if (MOCK_CLIMATE_BY_CITY[key]) return MOCK_CLIMATE_BY_CITY[key];
  
  // Generic fallback for any other city
  return {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    climateType: "Temperate Regional Climate",
    annualRainfall: "680 mm",
    annualAvgTemp: "23.5°C",
    historicalTrend: "+0.5°C over past 20 years",
    months: [
      { month: "Jan", avgHigh: 22, avgLow: 9, rainfall: 10 },
      { month: "Feb", avgHigh: 25, avgLow: 12, rainfall: 15 },
      { month: "Mar", avgHigh: 29, avgLow: 15, rainfall: 18 },
      { month: "Apr", avgHigh: 34, avgLow: 20, rainfall: 22 },
      { month: "May", avgHigh: 37, avgLow: 24, rainfall: 35 },
      { month: "Jun", avgHigh: 36, avgLow: 25, rainfall: 80 },
      { month: "Jul", avgHigh: 33, avgLow: 24, rainfall: 180 },
      { month: "Aug", avgHigh: 32, avgLow: 23, rainfall: 190 },
      { month: "Sep", avgHigh: 32, avgLow: 22, rainfall: 95 },
      { month: "Oct", avgHigh: 31, avgLow: 18, rainfall: 30 },
      { month: "Nov", avgHigh: 27, avgLow: 13, rainfall: 12 },
      { month: "Dec", avgHigh: 23, avgLow: 10, rainfall: 8 }
    ]
  };
}
