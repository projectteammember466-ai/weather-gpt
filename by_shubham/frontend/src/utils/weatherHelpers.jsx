// Weather Icon and Helper Utilities

import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  SunMedium, 
  Moon
} from 'lucide-react';

export function getWeatherIcon(iconName, className = "w-6 h-6") {
  const iconProps = { className };

  switch (iconName) {
    case 'Sun': return <Sun {...iconProps} style={{ color: '#f59e0b' }} />;
    case 'SunMedium': return <SunMedium {...iconProps} style={{ color: '#fbbf24' }} />;
    case 'Cloud': return <Cloud {...iconProps} style={{ color: '#cbd5e1' }} />;
    case 'CloudRain': return <CloudRain {...iconProps} style={{ color: '#38bdf8' }} />;
    case 'CloudLightning': return <CloudLightning {...iconProps} style={{ color: '#818cf8' }} />;
    case 'Snowflake': return <Snowflake {...iconProps} style={{ color: '#e0f2fe' }} />;
    case 'Moon': return <Moon {...iconProps} style={{ color: '#a5b4fc' }} />;
    default: return <Sun {...iconProps} style={{ color: '#f59e0b' }} />;
  }
}

export function getSeverityBadgeClass(severity = 'INFO') {
  switch (severity.toUpperCase()) {
    case 'INFO': return 'badge-info';
    case 'ADVISORY': return 'badge-advisory';
    case 'WATCH': return 'badge-watch';
    case 'HIGH': return 'badge-high';
    case 'SEVERE': return 'badge-severe';
    case 'EXTREME': return 'badge-extreme';
    default: return 'badge-info';
  }
}
