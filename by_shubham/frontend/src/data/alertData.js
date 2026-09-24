// Weather Alerts Fixtures (Strict Separation of Official Warnings vs AI Explanations)
// A13: Enhanced with Impact-Based Weather Alert Fields

export const MOCK_ALERTS_BY_CITY = {
  jodhpur: [
    {
      id: "alt-jod-01",
      title: "Heatwave Warning (Severe Heat)",
      severity: "SEVERE",
      affectedArea: "Jodhpur & Western Rajasthan Districts",
      validFrom: "2026-09-20 11:00 AM",
      validUntil: "2026-09-22 07:00 PM",
      expectedConditions: "Daytime surface temperatures reaching 42°C to 44°C with low relative humidity (15-20%) and dry westerly winds.",
      potentialImpacts: [
        "High risk of dehydration and heat exhaustion for outdoor workers",
        "Elevated evaporation rate causing rapid soil moisture depletion in crops",
        "Increased thermal load on municipal power grids and cooling systems"
      ],
      officialWarning: {
        source: "Indian Meteorological Department (IMD) - Demo Advisory",
        sourceType: "Official Weather Authority",
        description: "Severe heatwave conditions expected to persist over Western Rajasthan with peak temperatures exceeding 40°C during afternoon hours."
      },
      aiExplanation: {
        disclaimer: "WeatherGPT interpretation based on available weather information.",
        summary: "High atmospheric pressure and dry desert winds are pushing temperatures 4-5°C above seasonal averages. Solar radiation peaks between 12:00 PM and 4:00 PM.",
        recommendedAction: "Stay indoors during peak heat, carry electrolytes, protect crops with early morning irrigation, and avoid strenuous outdoor activity during midday."
      }
    }
  ],
  mumbai: [
    {
      id: "alt-mum-01",
      title: "Heavy Rainfall Advisory",
      severity: "HIGH",
      affectedArea: "Mumbai Metropolitan Region & Coastal Maharashtra",
      validFrom: "2026-09-20 08:00 AM",
      validUntil: "2026-09-21 11:00 PM",
      expectedConditions: "Localized rainfall accumulations of 80–120 mm within 6-hour windows, with coastal wind gusts up to 55 km/h.",
      potentialImpacts: [
        "Waterlogging in low-lying transit corridors and underpasses",
        "Slow vehicular movement and probable commuter rail delays",
        "Reduced maritime visibility and rough coastal surf conditions"
      ],
      officialWarning: {
        source: "Regional Weather Center - Demo Advisory",
        sourceType: "Official Weather Authority",
        description: "Continuous heavy to very heavy rainfall accompanied by gusty winds reaching 45-55 km/h over coastal districts."
      },
      aiExplanation: {
        disclaimer: "WeatherGPT interpretation based on available weather information.",
        summary: "A vigorous monsoon trough is drawing heavy Arabian Sea moisture inland, triggering episodic cloudburst bands.",
        recommendedAction: "Avoid traveling through known low-lying flood-prone roads, carry waterproof gear, and allow extra transit buffer."
      }
    }
  ],
  delhi: [
    {
      id: "alt-del-01",
      title: "Air Quality & Surface Dust Advisory",
      severity: "ADVISORY",
      affectedArea: "National Capital Region (NCR)",
      validFrom: "2026-09-20 06:00 AM",
      validUntil: "2026-09-21 06:00 PM",
      expectedConditions: "AQI levels in the 180–230 range (Unhealthy for Sensitive Groups) with elevated PM2.5 and PM10 particles.",
      potentialImpacts: [
        "Respiratory discomfort for children, elderly, and asthmatic individuals",
        "Hazy conditions causing moderate reduction in morning highway visibility"
      ],
      officialWarning: {
        source: "Central Pollution Control Board - Demo Advisory",
        sourceType: "Official Regulatory Body",
        description: "Particulate matter PM2.5 and PM10 levels elevated due to low wind speeds and surface atmospheric dust."
      },
      aiExplanation: {
        disclaimer: "WeatherGPT interpretation based on available weather information.",
        summary: "Atmospheric inversion layer and stagnant surface winds are trapping particulate matter close to ground level.",
        recommendedAction: "Sensitive individuals should wear N95 filtration masks during outdoor commutes and use indoor HEPA filtration if available."
      }
    }
  ],
  miami: [
    {
      id: "alt-mia-01",
      title: "Tropical Storm Warning & High Coastal Surf",
      severity: "EXTREME",
      affectedArea: "South Florida Coastal Zone & Miami-Dade County",
      validFrom: "2026-09-20 04:00 AM",
      validUntil: "2026-09-22 08:00 PM",
      expectedConditions: "Storm surge inundation of 3 to 5 feet above ground level with sustained tropical-storm-force winds exceeding 75 km/h.",
      potentialImpacts: [
        "Severe coastal flooding of low-lying roadways and barrier islands",
        "Downed tree branches and localized power distribution outages",
        "Rip currents and treacherous marine navigation"
      ],
      officialWarning: {
        source: "National Hurricane Center (NHC) - Demo Advisory",
        sourceType: "Official Weather Authority",
        description: "Dangerous coastal storm surges reaching 3 to 5 feet with sustained tropical storm force winds and rapid localized flash flooding."
      },
      aiExplanation: {
        disclaimer: "WeatherGPT interpretation based on available weather information.",
        summary: "Deep tropical low pressure system passing offshore creates strong onshore surge and heavy tropical squalls.",
        recommendedAction: "Heed municipal emergency management directives, secure outdoor patio items, and stay clear of beaches."
      }
    }
  ],
  oslo: [
    {
      id: "alt-oslo-01",
      title: "Freezing Ice & Snowdrift Hazard",
      severity: "WATCH",
      affectedArea: "Eastern Norway & Oslo Metropolitan Ring",
      validFrom: "2026-09-20 02:00 PM",
      validUntil: "2026-09-21 12:00 PM",
      expectedConditions: "Rapid temperature plummet below 0°C following wet sleet, leading to pervasive black ice formation.",
      potentialImpacts: [
        "Extremely slippery road surfaces causing elevated traffic incident risk",
        "Hazardous pedestrian walkways in untreated residential zones"
      ],
      officialWarning: {
        source: "Norwegian Meteorological Institute - Demo Advisory",
        sourceType: "Official Weather Authority",
        description: "Rapid freeze following wet snow causing severe black ice across road networks and mountain passes."
      },
      aiExplanation: {
        disclaimer: "WeatherGPT interpretation based on available weather information.",
        summary: "Sub-zero cold arctic air intrusion will freeze wet pavement within minutes of precipitation ending.",
        recommendedAction: "Equip vehicles with certified winter studded tires, reduce speed by half, and use non-slip footwear."
      }
    }
  ]
};

export function getMockAlerts(city = "jodhpur") {
  const key = city.trim().toLowerCase();
  return MOCK_ALERTS_BY_CITY[key] || [];
}
