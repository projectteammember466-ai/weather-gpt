// WeatherGPT Centralized User Context Modes / Activity Profiles Data Model
// Exactly 8 Activity Profiles prioritizing specific weather aspects without altering underlying facts

import { 
  User, Sprout, Plane, Sun, AlertTriangle, Car, CalendarCheck, Activity 
} from 'lucide-react';

export const CONTEXT_MODES = [
  {
    id: 'general',
    nameKey: 'context.general.name',
    defaultName: 'General',
    names: {
      en: 'General',
      hi: 'सामान्य',
      hinglish: 'General'
    },
    descKey: 'context.general.desc',
    defaultDesc: 'Standard comprehensive weather view and daily forecast overview.',
    descriptions: {
      en: 'Standard comprehensive weather view and daily forecast overview.',
      hi: 'दैनिक दिनचर्या के लिए सामान्य व्यापक मौसम विवरण।',
      hinglish: 'Standard comprehensive daily weather and forecast view.'
    },
    iconName: 'User',
    icon: User,
    priorities: ['temperature', 'condition', 'rainProbability', 'highLow'],
    aiInstruction: 'Provide a balanced, clear, and comprehensive weather summary covering temperature, skies, and precipitation without specialized professional bias.',
    suggestedQuestions: {
      en: [
        "What's the weather today?",
        "Will it rain today?",
        "What is the temperature right now?",
        "How will the weather be tomorrow?"
      ],
      hi: [
        "आज का मौसम कैसा रहेगा?",
        "क्या आज बारिश होने की संभावना है?",
        "अभी तापमान कितना है?",
        "कल का मौसम कैसा रहेगा?"
      ],
      hinglish: [
        "Aaj mausam kaisa rahega?",
        "Kya aaj baarish hogi?",
        "Abhi temperature kitna hai?",
        "Kal ka mausam kaisa rahega?"
      ]
    },
    advisory: {
      en: "Standard atmospheric conditions. Suitable for typical daily routines and general activities.",
      hi: "सामान्य वायुमंडलीय स्थिति। सामान्य दैनिक दिनचर्या और कार्यों के लिए उपयुक्त।",
      hinglish: "Normal atmospheric conditions. Daily routine aur regular activities ke liye suitable."
    }
  },
  {
    id: 'farmer',
    nameKey: 'context.farmer.name',
    defaultName: 'Farmer',
    names: {
      en: 'Farmer',
      hi: 'किसान',
      hinglish: 'Farmer'
    },
    descKey: 'context.farmer.desc',
    defaultDesc: 'Prioritizes rainfall volume, rain probability, soil moisture, and wind speed.',
    descriptions: {
      en: 'Prioritizes rainfall volume, rain probability, soil moisture, and wind speed.',
      hi: 'बारिश की मात्रा, मिट्टी की नमी और हवा की गति को प्राथमिकता।',
      hinglish: 'Rainfall volume, soil moisture aur wind speed par priority.'
    },
    iconName: 'Sprout',
    icon: Sprout,
    priorities: ['rainProbability', 'precipitation', 'humidity', 'wind', 'temperature'],
    aiInstruction: 'Focus on agricultural impacts: soil moisture retention, irrigation scheduling, wind speed for spraying, and field drainage.',
    suggestedQuestions: {
      en: [
        "Is rain expected for crops today?",
        "Is tomorrow suitable for field work and spraying?",
        "How strong will the wind be today?",
        "What is the relative humidity and soil moisture trend?"
      ],
      hi: [
        "क्या आज फसलों के लिए बारिश की संभावना है?",
        "क्या कल खेतों में काम और कीटनाशक छिड़काव के लिए ठीक है?",
        "आज हवा की गति कितनी रहेगी?",
        "आर्द्रता और मिट्टी में नमी की स्थिति क्या है?"
      ],
      hinglish: [
        "Kya aaj faslon ke liye baarish ki sambhavna hai?",
        "Kya kal khet mein spray aur field work kar sakte hain?",
        "Aaj hawa ki speed kitni rahegi?",
        "Humidity aur mitti ki nami kaisi hai?"
      ]
    },
    advisory: {
      en: "Monitor soil moisture and irrigation scheduling based on rainfall probability and wind velocity.",
      hi: "बारिश की संभावना और हवा की गति के आधार पर सिंचाई और फसलों की देखभाल की योजना बनाएं।",
      hinglish: "Baarish ke chance aur hawa ki speed ke hisaab se irrigation aur fasal schedule plan karein."
    }
  },
  {
    id: 'traveler',
    nameKey: 'context.traveler.name',
    defaultName: 'Traveler',
    names: {
      en: 'Traveler',
      hi: 'यात्री',
      hinglish: 'Traveler'
    },
    descKey: 'context.traveler.desc',
    defaultDesc: 'Prioritizes visibility, road safety, rain delays, and travel comfort.',
    descriptions: {
      en: 'Prioritizes visibility, road safety, rain delays, and travel comfort.',
      hi: 'दृश्यता, सड़क सुरक्षा और यात्रा में देरी को प्राथमिकता।',
      hinglish: 'Visibility, highway safety aur travel delay alerts.'
    },
    iconName: 'Plane',
    icon: Plane,
    priorities: ['visibility', 'condition', 'rainProbability', 'wind', 'travelComfort'],
    aiInstruction: 'Focus on travel logistics: highway visibility, flight/transit delay risks, rain road spray, wind crosswinds, and clothing packing advice.',
    suggestedQuestions: {
      en: [
        "Is the weather good for road travel today?",
        "Will rain or fog cause travel delays?",
        "What is the surface visibility like?",
        "What clothing should I pack for this trip?"
      ],
      hi: [
        "क्या आज यात्रा या ड्राइविंग के लिए मौसम ठीक है?",
        "क्या बारिश या कोहरे से सफर में देरी होगी?",
        "रास्ते में दृश्यता (विजिबिलिटी) कैसी है?",
        "इस यात्रा के लिए कौन से कपड़े साथ रखने चाहिए?"
      ],
      hinglish: [
        "Kya aaj road travel ya driving ke liye mausam theek hai?",
        "Kya baarish ya fog se safar mein delay hoga?",
        "Visibility aur road conditions kaisi hain?",
        "Travel ke liye kis tarah ke kapde pack karein?"
      ]
    },
    advisory: {
      en: "Clear surface visibility. Check regional highway advisories if travelling through precipitation zones.",
      hi: "सड़क और वायु दृश्यता की जांच करें। बारिश वाले इलाकों से गुजरते समय अतिरिक्त समय रखें।",
      hinglish: "Surface visibility check karein. Baarish wale areas mein travel karte waqt extra time lein."
    }
  },
  {
    id: 'outdoor',
    nameKey: 'context.outdoor.name',
    defaultName: 'Outdoor',
    names: {
      en: 'Outdoor',
      hi: 'आउटडोर',
      hinglish: 'Outdoor'
    },
    descKey: 'context.outdoor.desc',
    defaultDesc: 'Prioritizes UV index, air quality (AQI), heat stress, and outdoor comfort.',
    descriptions: {
      en: 'Prioritizes UV index, air quality (AQI), heat stress, and outdoor comfort.',
      hi: 'यूवी इंडेक्स, वायु गुणवत्ता और धूप/गर्मी से बचाव को प्राथमिकता।',
      hinglish: 'UV index, AQI aur dhoop/garmi se protection.'
    },
    iconName: 'Sun',
    icon: Sun,
    priorities: ['uvIndex', 'aqi', 'temperature', 'feelsLike', 'wind'],
    aiInstruction: 'Focus on outdoor recreation safety: peak UV exposure hours, air quality index, hydration, shade requirements, and wind chill/heat index.',
    suggestedQuestions: {
      en: [
        "Is it safe to stay outdoors for long hours today?",
        "What is the UV index and sun protection advice?",
        "Is the heat and humidity comfortable outside?",
        "What is the air quality index (AQI) right now?"
      ],
      hi: [
        "क्या आज लंबे समय तक बाहर रहना सुरक्षित है?",
        "यूवी इंडेक्स कितना है और धूप से बचाव की क्या सलाह है?",
        "बाहर गर्मी और उमस की स्थिति कैसी है?",
        "अभी वायु गुणवत्ता (AQI) का स्तर क्या है?"
      ],
      hinglish: [
        "Kya aaj outdoor rehna safe hai?",
        "UV index kitna hai aur dhoop se bachne ki kya advice hai?",
        "Garmi aur humidity ka outdoor comfort kaisa hai?",
        "Abhi AQI aur air pollution ka level kya hai?"
      ]
    },
    advisory: {
      en: "Apply sun protection during peak daylight hours. Keep hydration accessible during prolonged outdoor exposure.",
      hi: "दोपहर के समय धूप से बचाव करें और पर्याप्त मात्रा में पानी पिएं।",
      hinglish: "Dophar ke waqt dhoop se bachein aur hydration ka dhyan rakhein."
    }
  },
  {
    id: 'emergency',
    nameKey: 'context.emergency.name',
    defaultName: 'Emergency',
    names: {
      en: 'Emergency',
      hi: 'आपातकाल',
      hinglish: 'Emergency'
    },
    descKey: 'context.emergency.desc',
    defaultDesc: 'Prioritizes active official warnings, storm severity, and immediate safety guidance.',
    descriptions: {
      en: 'Prioritizes active official warnings, storm severity, and immediate safety guidance.',
      hi: 'सक्रिय मौसम चेतावनियां और आपातकालीन सुरक्षा निर्देश।',
      hinglish: 'Official warnings aur emergency safety guidance.'
    },
    iconName: 'AlertTriangle',
    icon: AlertTriangle,
    priorities: ['alerts', 'severeWeather', 'safetyActions', 'wind', 'rain'],
    aiInstruction: 'Emphasize any active official warnings, severe weather hazards, safety precautions, and civil protection directives. Never invent warnings.',
    suggestedQuestions: {
      en: [
        "Are there any active official weather warnings?",
        "What severe weather hazards are expected?",
        "What immediate emergency precautions should I take?",
        "Is there any flood, storm, or gale risk?"
      ],
      hi: [
        "क्या वर्तमान में कोई आधिकारिक मौसम चेतावनी सक्रिय है?",
        "आने वाले घंटों में किस गंभीर मौसम का खतरा है?",
        "सुरक्षा के लिए तुरंत क्या सावधानियां बरतनी चाहिए?",
        "क्या आंधी, तूफान या भारी बारिश का कोई जोखिम है?"
      ],
      hinglish: [
        "Kya abhi koi official weather warning active hai?",
        "Kis severe weather hazard ka risk hai?",
        "Immediate safety ke liye kya precautions lene chahiye?",
        "Kya aandhi, toofan ya flood ka koi alert hai?"
      ]
    },
    advisory: {
      en: "Monitor official national meteorological service bulletins. Follow civil protection instructions if severe alerts trigger.",
      hi: "आधिकारिक मौसम बुलेटिन पर नजर रखें। गंभीर चेतावनी जारी होने पर नागरिक सुरक्षा निर्देशों का पालन करें।",
      hinglish: "Official weather alerts par nazar rakhein aur emergency guidelines follow karein."
    }
  },
  {
    id: 'commuter',
    nameKey: 'context.commuter.name',
    defaultName: 'Commuter',
    names: {
      en: 'Commuter',
      hi: 'दैनिक यात्री (Commuter)',
      hinglish: 'Commuter'
    },
    descKey: 'context.commuter.desc',
    defaultDesc: 'Prioritizes commute-time rain chance, thunderstorm risk, and transit delays.',
    descriptions: {
      en: 'Prioritizes commute-time rain chance, thunderstorm risk, and transit delays.',
      hi: 'दफ्तर/यात्रा के समय बारिश की संभावना और सड़क स्थिति।',
      hinglish: 'Office travel timing, rain chance aur transit delay.'
    },
    iconName: 'Car',
    icon: Car,
    priorities: ['rainProbability', 'thunderstorm', 'visibility', 'wind', 'temperature'],
    aiInstruction: 'Focus on daily commute timings: rush-hour precipitation risk, slick roads, reduced visibility, public transit delays, and wind gusts.',
    suggestedQuestions: {
      en: [
        "Will rain affect my morning or evening commute?",
        "Is there any thunderstorm risk during peak travel hours?",
        "How is the visibility and road grip today?",
        "Should I leave earlier due to weather conditions?"
      ],
      hi: [
        "क्या सुबह या शाम के आने-जाने में बारिश से बाधा आएगी?",
        "क्या पीक आवर्स के दौरान आंधी-तूफान का कोई जोखिम है?",
        "सड़क पर दृश्यता और ड्राइविंग की स्थिति कैसी है?",
        "क्या मौसम के कारण घर से जल्दी निकलना चाहिए?"
      ],
      hinglish: [
        "Kya morning ya evening commute mein baarish affect karegi?",
        "Kya peak rush hours mein aandhi ya toofan ka risk hai?",
        "Road visibility aur driving conditions kaisi hain?",
        "Kya commute ke liye extra buffer time rakhna chahiye?"
      ]
    },
    advisory: {
      en: "Check peak-hour precipitation probability. Maintain a safe following distance on damp or wet pavement.",
      hi: "ऑफिस आने-जाने के समय बारिश की संभावना देखें और गीली सड़कों पर सुरक्षित गति से वाहन चलाएं।",
      hinglish: "Commute timings par rain probability check karein aur safe driving distance maintain karein."
    }
  },
  {
    id: 'event_planner',
    nameKey: 'context.event_planner.name',
    defaultName: 'Event Planner',
    names: {
      en: 'Event Planner',
      hi: 'इवेंट प्लानर',
      hinglish: 'Event Planner'
    },
    descKey: 'context.event_planner.desc',
    defaultDesc: 'Prioritizes precipitation timing, wind gusts, canopy safety, and outdoor viability.',
    descriptions: {
      en: 'Prioritizes precipitation timing, wind gusts, canopy safety, and outdoor viability.',
      hi: 'समारोह समय पर वर्षा, तेज हवा और खुले में आयोजन की उपयुक्तता।',
      hinglish: 'Event timings par rain chance, wind gusts aur canopy safety.'
    },
    iconName: 'CalendarCheck',
    icon: CalendarCheck,
    priorities: ['rainProbability', 'precipitation', 'wind', 'temperature', 'stability'],
    aiInstruction: 'Focus on event viability: rain timing windows, canopy/tent anchoring against wind gusts, guest thermal comfort, and indoor contingency triggers.',
    suggestedQuestions: {
      en: [
        "Is the weather suitable for an outdoor event today?",
        "What is the exact rain probability window?",
        "Will high wind gusts affect tents or stages?",
        "What is the thermal comfort level for guests?"
      ],
      hi: [
        "क्या आज का मौसम किसी खुले कार्यक्रम (इवेंट) के लिए अनुकूल है?",
        "किस समय बारिश होने की सबसे ज्यादा संभावना है?",
        "क्या तेज हवाओं से टेंट या शामियाने पर असर पड़ेगा?",
        "अतिथियों के लिए तापमान और उमस का स्तर कैसा रहेगा?"
      ],
      hinglish: [
        "Kya aaj outdoor event ya function ke liye mausam suitable hai?",
        "Rain probability ka exact time window kya hai?",
        "Kya tez hawaon se tent ya stage ko koi risk hai?",
        "Guests ke comfort ke hisaab se temperature kaisa rahega?"
      ]
    },
    advisory: {
      en: "Review wind velocity thresholds for temporary outdoor structures and stage canopies.",
      hi: "खुले शामियानों और अस्थायी ढांचों के लिए हवा की गति और बारिश की संभावना पर नजर रखें।",
      hinglish: "Outdoor tents aur structures ke liye wind speed aur rain timings monitor karein."
    }
  },
  {
    id: 'fitness',
    nameKey: 'context.fitness.name',
    defaultName: 'Fitness / Sports',
    names: {
      en: 'Fitness / Sports',
      hi: 'फिटनेस एवं खेल',
      hinglish: 'Fitness / Sports'
    },
    descKey: 'context.fitness.desc',
    defaultDesc: 'Prioritizes heat stress, humidity, AQI, UV radiation, and outdoor workout comfort.',
    descriptions: {
      en: 'Prioritizes heat stress, humidity, AQI, UV radiation, and outdoor workout comfort.',
      hi: 'वर्कआउट समय, गर्मी, उमस, यूवी और वायु गुणवत्ता का प्रभाव।',
      hinglish: 'Outdoor workout, heat stress, AQI aur hydration guidance.'
    },
    iconName: 'Activity',
    icon: Activity,
    priorities: ['temperature', 'humidity', 'aqi', 'uvIndex', 'feelsLike'],
    aiInstruction: 'Focus on athletic performance and exercise safety: optimal workout time of day, hydration volume, heat cramps/exhaustion risk, and respiratory AQI warnings.',
    suggestedQuestions: {
      en: [
        "Is it comfortable for outdoor running or exercise today?",
        "What is the best time of day for an outdoor workout?",
        "What are the current heat index and AQI levels?",
        "How much hydration should I carry for my training?"
      ],
      hi: [
        "क्या आज बाहर दौड़ने या वर्कआउट करने के लिए मौसम अनुकूल है?",
        "आउटडोर कसरत या खेल के लिए दिन का सबसे अच्छा समय कौन सा है?",
        "वर्तमान हीट इंडेक्स और वायु प्रदूषण (AQI) का स्तर क्या है?",
        "व्यायाम के दौरान डिहाइड्रेशन से बचने के लिए क्या ध्यान रखें?"
      ],
      hinglish: [
        "Kya aaj outdoor running ya workout ke liye mausam accha hai?",
        "Outdoor sports aur exercise ke liye best time kaun sa hai?",
        "Heat index aur AQI ka level workout ke liye kaisa hai?",
        "Training ke dauran hydration aur energy ka kya dhyan rakhein?"
      ]
    },
    advisory: {
      en: "Schedule intense cardio workouts during cooler morning or twilight hours. Monitor ozone and AQI thresholds.",
      hi: "भारी व्यायाम सुबह या शाम के ठंडे समय करें। वायु गुणवत्ता और उमस का ध्यान रखें।",
      hinglish: "Heavy workouts subah ya shaam ke thande time plan karein. AQI aur hydration ka dhyan rakhein."
    }
  }
];

export function getContextMode(modeId = 'general') {
  const mode = CONTEXT_MODES.find(m => m.id === modeId) || CONTEXT_MODES[0];
  if (!mode.names) {
    mode.names = { en: mode.defaultName, hi: mode.defaultName, hinglish: mode.defaultName };
  }
  if (!mode.descriptions) {
    mode.descriptions = { en: mode.defaultDesc, hi: mode.defaultDesc, hinglish: mode.defaultDesc };
  }
  return mode;
}

export function getContextSuggestedQuestions(modeId = 'general', lang = 'en') {
  const mode = getContextMode(modeId);
  const questionsForLang = mode.suggestedQuestions[lang] || mode.suggestedQuestions.en;
  return questionsForLang;
}

export function getContextAdvisory(modeId = 'general', lang = 'en') {
  const mode = getContextMode(modeId);
  return mode.advisory[lang] || mode.advisory.en;
}
