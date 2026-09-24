import React, { useMemo } from 'react';
import { 
  Sparkles, Sun, Umbrella, Wind, Thermometer, ShieldAlert, 
  Activity, Car, Sprout, Plane, CalendarCheck, CheckCircle2 
} from 'lucide-react';
import { getContextMode } from '../../data/contextModes';

export function SmartWeatherGuidance({ 
  weather, 
  forecast, 
  userMode = 'general', 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const current = weather?.current;
  const currentMode = getContextMode(userMode);
  const modeName = currentMode.names[lang] || currentMode.names.en;

  const guidanceList = useMemo(() => {
    if (!current) return [];

    const temp = current.temperature ?? 30;
    const rainProb = current.rainProbability ?? 10;
    const windSpeed = current.windSpeed ?? 12;
    const uvIndex = current.uvIndex ?? 6;
    const aqi = current.aqi ?? 75;

    const cards = [];

    // 1. Sun & UV Guidance
    if (uvIndex >= 6) {
      cards.push({
        id: 'uv',
        icon: Sun,
        iconColor: '#f59e0b',
        category: t('sunProtection', 'Sun & UV Protection'),
        title: lang === 'hi' 
          ? `उच्च यूवी इंडेक्स (${uvIndex})` 
          : lang === 'hinglish' 
          ? `High UV Index (${uvIndex})` 
          : `High UV Index (${uvIndex})`,
        advice: lang === 'hi'
          ? "दोपहर 11 से 3 बजे के बीच सीधी धूप से बचें और बाहर जाते समय सनस्क्रीन या टोपी का प्रयोग करें।"
          : lang === 'hinglish'
          ? "Noon 11 AM se 3 PM ke beech direct sun se bachein. Sunscreen aur sunglasses carry karein."
          : "Apply SPF 30+ sun protection and seek midday shade between 11 AM and 3 PM."
      });
    } else {
      cards.push({
        id: 'uv',
        icon: Sun,
        iconColor: '#10b981',
        category: t('sunProtection', 'Sun & UV Protection'),
        title: lang === 'hi' 
          ? `सुरक्षित यूवी स्तर (${uvIndex})` 
          : lang === 'hinglish' 
          ? `Moderate UV Level (${uvIndex})` 
          : `Moderate UV Level (${uvIndex})`,
        advice: lang === 'hi'
          ? "सामान्य दिन के लिए धूप की तीव्रता सुरक्षित स्तर पर है।"
          : lang === 'hinglish'
          ? "Normal daylight activities ke liye UV level comfortable hai."
          : "Solar radiation is moderate. Standard daylight activity is comfortable."
      });
    }

    // 2. Precipitation & Moisture Guidance
    if (rainProb >= 40) {
      cards.push({
        id: 'rain',
        icon: Umbrella,
        iconColor: '#0ea5e9',
        category: t('rainPrep', 'Precipitation Readiness'),
        title: lang === 'hi'
          ? `बारिश की संभावना (${rainProb}%)`
          : lang === 'hinglish'
          ? `Rain Chance Elevated (${rainProb}%)`
          : `Rain Chance Elevated (${rainProb}%)`,
        advice: lang === 'hi'
          ? "हल्की से मध्यम बारिश संभव है। बाहर निकलते समय छाता या रेनकोट साथ रखें।"
          : lang === 'hinglish'
          ? "Rain protection ya umbrella saath rakhein. Roads par slick conditions possible hain."
          : "Pack an umbrella or water-resistant layer; wet pavement possible during peak hours."
      });
    } else {
      cards.push({
        id: 'rain',
        icon: Umbrella,
        iconColor: '#38bdf8',
        category: t('rainPrep', 'Precipitation Readiness'),
        title: lang === 'hi'
          ? `कम बारिश की संभावना (${rainProb}%)`
          : lang === 'hinglish'
          ? `Dry Conditions Expected (${rainProb}%)`
          : `Dry Conditions Expected (${rainProb}%)`,
        advice: lang === 'hi'
          ? "वर्षा की संभावना बहुत कम है। खुले में कार्य या यात्रा के लिए अनुकूल।"
          : lang === 'hinglish'
          ? "Mausam dry rehne ki umeed hai. Outdoor travel ke liye safe window."
          : "Precipitation probability remains low. Favorable for open-air tasks."
      });
    }

    // 3. Wind & Airflow Advisory
    if (windSpeed >= 20) {
      cards.push({
        id: 'wind',
        icon: Wind,
        iconColor: '#a855f7',
        category: t('windAdvisory', 'Wind & Airflow Notice'),
        title: lang === 'hi'
          ? `सक्रिय हवा (${windSpeed} km/h)`
          : lang === 'hinglish'
          ? `Active Wind Flow (${windSpeed} km/h)`
          : `Active Wind Flow (${windSpeed} km/h)`,
        advice: lang === 'hi'
          ? "तेज हवा के झोंके संभव हैं। खुले टेंट, बैनर सुरक्षित करें और वाहन सावधानी से चलाएं।"
          : lang === 'hinglish'
          ? "Strong wind gusts expected. Highway drive par crosswinds ka dhyan rakhein."
          : "Breezy conditions. Secure loose outdoor fixtures and anticipate crosswinds."
      });
    }

    // 4. Mode-Specific Persona Guidance
    if (userMode === 'farmer') {
      cards.push({
        id: 'mode_farmer',
        icon: Sprout,
        iconColor: '#22c55e',
        category: `${modeName} ${t('guidanceSubtitle', 'Guidance')}`,
        title: lang === 'hi' ? "कृषि एवं सिंचाई सलाह" : lang === 'hinglish' ? "Agricultural & Irrigation Advice" : "Crop & Soil Moisture Management",
        advice: rainProb >= 40 
          ? (lang === 'hi' ? "संभावित बारिश को देखते हुए रासायनिक छिड़काव स्थगित रखें। जल निकासी सुनिश्चित करें।" : lang === 'hinglish' ? "Rain chance elevated hai, spray postpone karein aur drainage inspect karein." : "Postpone pesticide application due to rain probability; verify field drainage channels.")
          : (lang === 'hi' ? "हवा की सामान्य गति कीटनाशक छिड़काव और नियमित सिंचाई के लिए उपयुक्त है।" : lang === 'hinglish' ? "Irrigation aur field spraying ke liye steady window available hai." : "Optimal window for scheduled irrigation and field spraying activities.")
      });
    } else if (userMode === 'traveler') {
      cards.push({
        id: 'mode_traveler',
        icon: Plane,
        iconColor: '#3b82f6',
        category: `${modeName} ${t('guidanceSubtitle', 'Guidance')}`,
        title: lang === 'hi' ? "यात्रा एवं आवागमन सलाह" : lang === 'hinglish' ? "Highway & Travel Readiness" : "Transit & Travel Logistics",
        advice: windSpeed >= 20 || rainProb >= 50
          ? (lang === 'hi' ? "मौसम के कारण यात्रा में अतिरिक्त समय रखें। राजमार्ग पर दृश्यता की जांच करें।" : lang === 'hinglish' ? "Transit delays possible hain, extra buffer time ke sath travel plan karein." : "Allow extra transit buffer time; check regional highway surface moisture.")
          : (lang === 'hi' ? "राजमार्ग पर स्पष्ट दृश्यता। सामान्य यात्रा के लिए मौसम पूरी तरह अनुकूल है।" : lang === 'hinglish' ? "Clear highway visibility aur normal travel conditions hain." : "Clear surface visibility and calm driving conditions throughout the region.")
      });
    } else if (userMode === 'fitness') {
      cards.push({
        id: 'mode_fitness',
        icon: Activity,
        iconColor: '#ec4899',
        category: `${modeName} ${t('guidanceSubtitle', 'Guidance')}`,
        title: lang === 'hi' ? "वर्कआउट एवं कसरत सलाह" : lang === 'hinglish' ? "Workout Timing & Hydration" : "Athletic & Workout Timing",
        advice: temp >= 32
          ? (lang === 'hi' ? "गर्मी के कारण तीव्र दौड़ या व्यायाम सुबह 8 बजे से पहले या शाम 6 बजे के बाद करें। पर्याप्त जलपान करें।" : lang === 'hinglish' ? "Intense cardio morning ya evening ke thande time plan karein. Extra hydration carry karein." : "Schedule outdoor cardio during cooler morning hours; carry electrolyte hydration.")
          : (lang === 'hi' ? "तापमान और आर्द्रता आउटडोर दौड़ने या खेलकूद के लिए आरामदायक स्तर पर है।" : lang === 'hinglish' ? "Comfortable temperatures for running and outdoor athletic training." : "Favorable thermal envelope for distance running and outdoor drills.")
      });
    } else if (userMode === 'commuter') {
      cards.push({
        id: 'mode_commuter',
        icon: Car,
        iconColor: '#6366f1',
        category: `${modeName} ${t('guidanceSubtitle', 'Guidance')}`,
        title: lang === 'hi' ? "दैनिक आवागमन सलाह" : lang === 'hinglish' ? "Commute Time Readiness" : "Daily Commuter Outlook",
        advice: rainProb >= 35
          ? (lang === 'hi' ? "ऑफिस समय में हल्की बारिश और फिसलन संभव है। सुरक्षित दूरी बनाए रखें।" : lang === 'hinglish' ? "Commute hours mein wet roads possible hain. Safe vehicle distance rakhein." : "Potential damp roadway conditions during rush hours; maintain increased vehicle spacing.")
          : (lang === 'hi' ? "आवागमन के समय मौसम अनुकूल रहेगा। सामान्य ट्रैफिक समय की अपेक्षा करें।" : lang === 'hinglish' ? "Dry commute window expected for morning and evening transit." : "Dry and predictable commute conditions for standard road and transit travel.")
      });
    } else if (userMode === 'event_planner') {
      cards.push({
        id: 'mode_event',
        icon: CalendarCheck,
        iconColor: '#f97316',
        category: `${modeName} ${t('guidanceSubtitle', 'Guidance')}`,
        title: lang === 'hi' ? "आयोजन एवं शामियाना सलाह" : lang === 'hinglish' ? "Event & Canopy Safety" : "Event Viability & Setup",
        advice: windSpeed >= 20 || rainProb >= 35
          ? (lang === 'hi' ? "हवा और बारिश के कारण खुले तंबुओं को अतिरिक्त खूंटों से बांधें और इनडोर विकल्प तैयार रखें।" : lang === 'hinglish' ? "Canopy ropes ko reinforce karein aur indoor backup arrangement ready rakhein." : "Secure canopy tie-downs against wind gusts; prepare indoor contingency options.")
          : (lang === 'hi' ? "खुले में समारोह या कार्यक्रम आयोजित करने के लिए मौसम उपयुक्त है।" : lang === 'hinglish' ? "Outdoor gathering aur events ke liye favorable weather conditions." : "Calm winds and low rain probability provide solid outdoor event viability.")
      });
    } else {
      // General thermal guidance
      cards.push({
        id: 'thermal',
        icon: Thermometer,
        iconColor: '#eab308',
        category: t('thermalComfort', 'Thermal & Heat Comfort'),
        title: lang === 'hi' ? `तापमान स्थिति (${temp}°C)` : lang === 'hinglish' ? `Thermal Profile (${temp}°C)` : `Thermal Envelope (${temp}°C)`,
        advice: temp >= 35 
          ? (lang === 'hi' ? "दिन में गर्मी अधिक रहेगी। सूती कपड़े पहनें और नियमित रूप से पानी पिएं।" : lang === 'hinglish' ? "Daytime warm temperatures. Hydrate regularly aur light cotton clothes prefer karein." : "Warm daytime temperature. Wear breathable fabrics and drink water regularly.")
          : (lang === 'hi' ? "दिन का तापमान सामान्य और सुखद बना हुआ है।" : lang === 'hinglish' ? "Pleasant atmospheric daytime profile." : "Comfortable daytime profile across the metropolitan area.")
      });
    }

    return cards;
  }, [current, userMode, lang, t, modeName]);

  if (!current || guidanceList.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-glow)',
            color: 'var(--accent-blue)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              {t('smartGuidance', 'Smart Weather Guidance')}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('guidanceSubtitle', 'Data-driven practical preparation tailored to your active perspective')} ({modeName})
            </span>
          </div>
        </div>

        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
          <CheckCircle2 size={12} /> {t('groundedTelemetry', 'Live Grounded')}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.85rem'
      }}>
        {guidanceList.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-color)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'transform var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <IconComponent size={16} style={{ color: card.iconColor }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 750, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {card.category}
                  </span>
                </div>
              </div>

              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {card.title}
              </h4>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {card.advice}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
