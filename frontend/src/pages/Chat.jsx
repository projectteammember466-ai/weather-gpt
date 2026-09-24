import React from 'react';
import { ChatBox } from '../components/chat/ChatBox';

export function Chat({ 
  weather, 
  initialQuery, 
  lang = 'en', 
  setLang, 
  userMode = 'general', 
  setUserMode, 
  t = (k, f) => f || k 
}) {
  return (
    <div className="page-fade-in" style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      {/* Full-Width WeatherGPT AI Assistant with Top-Right Perspective Dropdown */}
      <ChatBox
        weatherData={weather}
        initialMessage={initialQuery}
        lang={lang}
        setLang={setLang}
        userMode={userMode}
        setUserMode={setUserMode}
        t={t}
      />
    </div>
  );
}
