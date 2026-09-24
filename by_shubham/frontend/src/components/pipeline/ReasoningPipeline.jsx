import React, { useState } from 'react';
import { HelpCircle, Sparkles, MapPin, Database, ShieldCheck, Compass, MessageSquare, CheckCircle } from 'lucide-react';

const PIPELINE_STAGES = {
  en: [
    {
      step: "1",
      title: "User Question",
      icon: MessageSquare,
      summary: "Input query received via text or voice input.",
      detail: (city, query) => `Raw query: "${query}". System sanitizes input and passes it to query processing without exposing internal model buffers.`
    },
    {
      step: "2",
      title: "Intent Detection",
      icon: Compass,
      summary: "Detects user focus topic and temporal scope.",
      detail: () => "Identifies intent as 'RAIN_FORECAST' and time parameter as 'Tomorrow'. Extracted entities: Topic=Precipitation, Timeframe=Next 24h."
    },
    {
      step: "3",
      title: "Location Resolution",
      icon: MapPin,
      summary: "Resolves place names to coordinates and stations.",
      detail: (city) => `Matches query keyword to station ${city}. Validates geographic hierarchy, coordinates, and boundaries.`
    },
    {
      step: "4",
      title: "Weather Retrieval",
      icon: Database,
      summary: "Fetches observation telemetry and numerical forecasts.",
      detail: (city) => `Queries normalized data contract for ${city}: surface temperature, radar precipitation probability, humidity, barometric pressure, and active alerts.`
    },
    {
      step: "5",
      title: "Data Validation",
      icon: ShieldCheck,
      summary: "Validates ranges and checks data integrity.",
      detail: () => "Verifies temperatures are within physical bounds (-50°C to +60°C), rain chances between 0-100%, and marks data freshness timestamp as 'Fresh'."
    },
    {
      step: "6",
      title: "Weather Reasoning",
      icon: Sparkles,
      summary: "Evaluates atmospheric signals against meteorological rules.",
      detail: () => "Compares atmospheric moisture with barometric pressure. Concludes rain probability remains under 10% over the next 24 hours."
    },
    {
      step: "7",
      title: "AI Explanation",
      icon: HelpCircle,
      summary: "Synthesizes clear, plain-language takeaway.",
      detail: (city) => `Generates user guidance: 'Rain is unlikely tomorrow in ${city} (<10%). Comfortable daytime conditions expected.' Formats practical recommendations.`
    },
    {
      step: "8",
      title: "Answer + Sources + Uncertainty",
      icon: CheckCircle,
      summary: "Outputs response with transparent attribution.",
      detail: () => "Assembles rich response card: Temperature, Rain Chance, Confidence (90%), Attribution (Official Telemetry & NWP model), and Clear Disclaimer."
    }
  ],
  hi: [
    {
      step: "1",
      title: "उपयोगकर्ता का प्रश्न",
      icon: MessageSquare,
      summary: "टेक्स्ट या वॉइस इनपुट के माध्यम से प्राप्त प्रश्न।",
      detail: (city, query) => `मूल प्रश्न: "${query}"। सिस्टम इनपुट को सुरक्षित रूप से साफ़ करता है और क्वेरी प्रोसेसिंग को सौंपता है।`
    },
    {
      step: "2",
      title: "इरादा पहचान (Intent)",
      icon: Compass,
      summary: "उपयोगकर्ता के विषय और समय सीमा की पहचान।",
      detail: () => "इरादे की पहचान 'बारिश पूर्वानुमान' के रूप में और समय 'कल' के रूप में। विषय=वर्षा, समयसीमा=अगले 24 घंटे।"
    },
    {
      step: "3",
      title: "स्थान समाधान (Location)",
      icon: MapPin,
      summary: "स्थान के नाम को निर्देशांक और स्टेशन से जोड़ना।",
      detail: (city) => `क्वेरी की-वर्ड को स्टेशन ${city} से जोड़ता है। भौगोलिक पदानुक्रम और सीमाओं का सत्यापन करता है।`
    },
    {
      step: "4",
      title: "मौसम डेटा प्राप्ति",
      icon: Database,
      summary: "टेलीमेट्री अवलोकन और संख्यात्मक पूर्वानुमान प्राप्त करना।",
      detail: (city) => `${city} के लिए सामान्यीकृत डेटा कॉन्ट्रैक्ट: तापमान, वर्षा संभावना, आर्द्रता, वायुदाब और सक्रिय चेतावनियां।`
    },
    {
      step: "5",
      title: "डेटा सत्यापन (Validation)",
      icon: ShieldCheck,
      summary: "सीमाओं और डेटा अखंडता का सत्यापन।",
      detail: () => "तापमान को भौतिक सीमाओं (-50°C से +60°C) और वर्षा को 0-100% के बीच सत्यापित करता है तथा डेटा को 'ताज़ा' चिह्नित करता है।"
    },
    {
      step: "6",
      title: "मौसम विज्ञान तर्क (Reasoning)",
      icon: Sparkles,
      summary: "मौसम संबंधी नियमों के अनुसार वायुमंडलीय संकेतों का मूल्यांकन।",
      detail: () => "कम नमी और उच्च वायुदाब की तुलना करता है। निष्कर्ष निकालता है कि अगले 24 घंटों में बारिश की संभावना 10% से कम है।"
    },
    {
      step: "7",
      title: "एआई स्पष्टीकरण",
      icon: HelpCircle,
      summary: "स्पष्ट, सरल भाषा में निष्कर्ष प्रस्तुत करना।",
      detail: (city) => `उपयोगकर्ता मार्गदर्शन तैयार करता है: 'कल ${city} में बारिश की संभावना बहुत कम है (<10%)। दिन में सुखद मौसम रहेगा।'`
    },
    {
      step: "8",
      title: "उत्तर + स्रोत + पारदर्शिता",
      icon: CheckCircle,
      summary: "पारदर्शी स्रोत और अनिश्चितता के साथ उत्तर देना।",
      detail: () => "कार्ड तैयार करता है: तापमान, वर्षा संभावना, पूर्वानुमान विश्वास (90%), आधिकारिक स्रोत और स्पष्ट डिस्क्लेमर।"
    }
  ],
  hinglish: [
    {
      step: "1",
      title: "User Question",
      icon: MessageSquare,
      summary: "Text ya voice input se mila user ka sawaal.",
      detail: (city, query) => `Raw query: "${query}". System input ko sanitize karke query processor ko bhejta hai.`
    },
    {
      step: "2",
      title: "Intent Detection",
      icon: Compass,
      summary: "User ka focus topic aur time period detect karna.",
      detail: () => "Intent 'RAIN_FORECAST' aur time parameter 'Tomorrow' identify hua. Topic=Barish, Timeframe=Next 24 ghante."
    },
    {
      step: "3",
      title: "Location Resolution",
      icon: MapPin,
      summary: "Place name ko coordinates aur weather station se match karna.",
      detail: (city) => `Query keyword ko station ${city} se match karta hai. Coordinates aur geographic boundaries validate karta hai.`
    },
    {
      step: "4",
      title: "Weather Data Retrieval",
      icon: Database,
      summary: "Observation telemetry aur numerical forecasts fetch karna.",
      detail: (city) => `${city} ke liye telemetry query: surface temperature, rain chance, humidity, pressure aur active alerts.`
    },
    {
      step: "5",
      title: "Data Validation",
      icon: ShieldCheck,
      summary: "Physical ranges aur data integrity check karna.",
      detail: () => "Temperature physical limits (-50°C se +60°C) aur rain chance 0-100% verify karta hai, freshness ko 'Fresh' mark karta hai."
    },
    {
      step: "6",
      title: "Weather Reasoning",
      icon: Sparkles,
      summary: "Meteorological rules ke hisaab se signals evaluate karna.",
      detail: () => "Atmospheric moisture aur barometric pressure compare karta hai. Result: next 24 hours mein rain probability 10% se kam hai."
    },
    {
      step: "7",
      title: "AI Explanation",
      icon: HelpCircle,
      summary: "Simple language mein guidance formulate karna.",
      detail: (city) => `Clear guidance generate karta hai: 'Kal ${city} mein baarish ki umeed kam hai (<10%). Suhana mausam rahega.'`
    },
    {
      step: "8",
      title: "Answer + Sources + Confidence",
      icon: CheckCircle,
      summary: "Transparent attribution aur uncertainty ke sath final answer.",
      detail: () => "Rich response card: Temperature, Rain Chance, Confidence (90%), Official source attribution aur safe disclaimer."
    }
  ]
};

export function ReasoningPipeline({ 
  activeCity = "Jodhpur", 
  sampleQuery = "Will it rain tomorrow in Jodhpur?", 
  lang = 'en', 
  t = (k, f) => f || k 
}) {
  const [activeStage, setActiveStage] = useState(0);

  const stagesList = PIPELINE_STAGES[lang] || PIPELINE_STAGES.en;

  const defaultSampleQuery = lang === 'hi'
    ? `क्या कल ${activeCity} में बारिश होगी?`
    : lang === 'hinglish'
    ? `Kya kal ${activeCity} mein baarish hogi?`
    : sampleQuery;

  return (
    <div className="glass-card" style={{ padding: '1.75rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{
          padding: '0.4rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-glow)',
          color: 'var(--accent-blue)'
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 850 }}>
            {t('howWeatherGPTWorks', 'How WeatherGPT Works')}
          </h1>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {t('howWeatherGPTWorksSubtitle', 'See how WeatherGPT turns a weather question into a grounded response.')}
          </span>
        </div>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '1rem 0 1.5rem 0', lineHeight: 1.5 }}>
        {t('pipelineDesc', 'WeatherGPT operates on a strict verification pipeline. It decouples numerical data retrieval from linguistic generation to prevent meteorological hallucinations.')}
      </p>

      {/* Stepper Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {stagesList.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStage === idx;
          return (
            <div
              key={stage.step}
              onClick={() => setActiveStage(idx)}
              style={{
                cursor: 'pointer',
                background: isActive ? 'var(--accent-glow)' : 'var(--surface-color)',
                border: isActive ? '2px solid var(--accent-blue)' : '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--accent-blue)' : 'var(--surface-card)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 800
                  }}>
                    {stage.step}
                  </div>
                  <Icon size={18} style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.98rem', fontWeight: 750, color: 'var(--text-primary)' }}>
                    {stage.title}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {stage.summary}
                </span>
              </div>

              {isActive && (
                <div className="page-fade-in" style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--surface-border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: 'var(--accent-blue)' }}>
                    {t('pipelineStepAction', 'Pipeline Action')}:{' '}
                  </strong>
                  {stage.detail(activeCity, defaultSampleQuery)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
