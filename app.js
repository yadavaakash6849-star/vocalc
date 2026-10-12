(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const expressionDisplay = $("#expression-display");
  const resultDisplay = $("#result-display");
  const displayNote = $("#display-note");
  const historyList = $("#history-list");
  const STORAGE = { history: "vocalc-history-v1", theme: "vocalc-theme-v1", feedback: "vocalc-feedback-v1", language: "vocalc-language-v1" };
  const LANGUAGE_CONFIG = {
    en: { label: "English", short: "EN", speech: "en-IN", voiceError: "Voice input could not be understood. Please try again.", unavailable: "Voice recognition for this language is not supported by your browser." },
    hi: { label: "हिंदी", short: "HI", speech: "hi-IN", voiceError: "आवाज़ समझ नहीं आई। कृपया दोबारा बोलें।", unavailable: "आपका ब्राउज़र इस भाषा के लिए वॉइस पहचान का समर्थन नहीं करता।" },
    hinglish: { label: "Hinglish", short: "HI+", speech: "hi-IN", voiceError: "Voice samajh nahi aayi. Please dobara try karein.", unavailable: "Voice recognition is unavailable. Please try Hindi or English." },
    mr: { label: "मराठी", short: "MR", speech: "mr-IN", voiceError: "आवाज समजली नाही. कृपया पुन्हा प्रयत्न करा.", unavailable: "तुमचा ब्राउझर या भाषेतील आवाज ओळखत नाही." },
    gu: { label: "ગુજરાતી", short: "GU", speech: "gu-IN", voiceError: "અવાજ સમજાયો નથી. કૃપા કરીને ફરી પ્રયાસ કરો.", unavailable: "તમારું બ્રાઉઝર આ ભાષા માટે વૉઇસ ઓળખને સમર્થન આપતું નથી." },
    bn: { label: "বাংলা", short: "BN", speech: "bn-IN", voiceError: "কথা বুঝতে পারিনি। আবার চেষ্টা করুন।", unavailable: "আপনার ব্রাউজার এই ভাষার ভয়েস শনাক্তকরণ সমর্থন করে না।" },
    ta: { label: "தமிழ்", short: "TA", speech: "ta-IN", voiceError: "குரலைப் புரிந்துகொள்ள முடியவில்லை. மீண்டும் முயற்சிக்கவும்.", unavailable: "உங்கள் உலாவி இந்த மொழிக்கான குரல் அறிதலை ஆதரிக்கவில்லை." },
    te: { label: "తెలుగు", short: "TE", speech: "te-IN", voiceError: "మాట అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.", unavailable: "మీ బ్రౌజర్ ఈ భాషలో వాయిస్ గుర్తింపును సమర్థించదు." },
    kn: { label: "ಕನ್ನಡ", short: "KN", speech: "kn-IN", voiceError: "ಮಾತು ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", unavailable: "ನಿಮ್ಮ ಬ್ರೌಸರ್ ಈ ಭಾಷೆಯ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆಯನ್ನು ಬೆಂಬಲಿಸುವುದಿಲ್ಲ." },
    ml: { label: "മലയാളം", short: "ML", speech: "ml-IN", voiceError: "ശബ്ദം മനസ്സിലായില്ല. വീണ്ടും ശ്രമിക്കുക.", unavailable: "നിങ്ങളുടെ ബ്രൗസർ ഈ ഭാഷയിലെ ശബ്ദ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല." },
    pa: { label: "ਪੰਜਾਬੀ", short: "PA", speech: "pa-IN", voiceError: "ਆਵਾਜ਼ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", unavailable: "ਤੁਹਾਡਾ ਬ੍ਰਾਊਜ਼ਰ ਇਸ ਭਾਸ਼ਾ ਲਈ ਵੌਇਸ ਪਛਾਣ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ।" },
    ur: { label: "اردو", short: "UR", speech: "ur-IN", voiceError: "آواز سمجھ نہیں آئی۔ براہ کرم دوبارہ کوشش کریں۔", unavailable: "آپ کا براؤزر اس زبان کے لیے آواز کی شناخت کی حمایت نہیں کرتا۔" }
  };
  const UI_TRANSLATIONS = {
    en: { languageSettings: "LANGUAGE SETTINGS", interfaceLanguage: "Interface language", voiceInputLanguage: "Voice input language", voiceOutputLanguage: "Voice output language", autoDetect: "Auto Detect", autoDetectLanguage: "Auto Detect Language", detectHint: "Detect English, Hindi, or Hinglish speech", voiceAnswers: "Voice answers", readResult: "Read your result aloud", languageLabel: "LANGUAGE", scientific: "Scientific", history: "History", clearAll: "Clear all", memory: "MEMORY", tryAgain: "Try again", listening: "Listening...", settings: "Settings" },
    hi: { languageSettings: "भाषा सेटिंग्स", interfaceLanguage: "इंटरफ़ेस भाषा", voiceInputLanguage: "वॉइस इनपुट भाषा", voiceOutputLanguage: "वॉइस आउटपुट भाषा", autoDetect: "स्वचालित पहचान", autoDetectLanguage: "भाषा पहचानें", detectHint: "अंग्रेज़ी, हिंदी या हिंग्लिश पहचानें", voiceAnswers: "आवाज़ में उत्तर", readResult: "उत्तर बोलकर सुनाएँ", languageLabel: "भाषा", scientific: "वैज्ञानिक", history: "इतिहास", clearAll: "साफ़ करें", memory: "मेमोरी", tryAgain: "फिर कोशिश करें", listening: "सुन रहा हूँ...", settings: "सेटिंग्स" },
    hinglish: { languageSettings: "LANGUAGE SETTINGS", interfaceLanguage: "Interface language", voiceInputLanguage: "Voice input language", voiceOutputLanguage: "Voice output language", autoDetect: "Auto Detect", autoDetectLanguage: "Auto Detect Language", detectHint: "English, Hindi, ya Hinglish pehchanein", voiceAnswers: "Voice answers", readResult: "Result bolkar sunayein", languageLabel: "LANGUAGE", scientific: "Scientific", history: "History", clearAll: "Clear all", memory: "MEMORY", tryAgain: "Try again", listening: "Listening...", settings: "Settings" },
    mr: { languageSettings: "भाषा सेटिंग्ज", interfaceLanguage: "इंटरफेस भाषा", voiceInputLanguage: "व्हॉइस इनपुट भाषा", voiceOutputLanguage: "व्हॉइस आउटपुट भाषा", autoDetect: "स्वयंचलित ओळख", autoDetectLanguage: "भाषा ओळखा", detectHint: "इंग्रजी, हिंदी किंवा हिंग्लिश ओळखा", voiceAnswers: "व्हॉइस उत्तरे", readResult: "उत्तर मोठ्याने वाचा", languageLabel: "भाषा", scientific: "वैज्ञानिक", history: "इतिहास", clearAll: "सर्व साफ करा", memory: "मेमरी", tryAgain: "पुन्हा प्रयत्न करा", listening: "ऐकत आहे...", settings: "सेटिंग्ज" },
    gu: { languageSettings: "ભાષા સેટિંગ્સ", interfaceLanguage: "ઇન્ટરફેસ ભાષા", voiceInputLanguage: "વૉઇસ ઇનપુટ ભાષા", voiceOutputLanguage: "વૉઇસ આઉટપુટ ભાષા", autoDetect: "આપમેળે ઓળખો", autoDetectLanguage: "ભાષા ઓળખો", detectHint: "અંગ્રેજી, હિન્દી અથવા હિંગ્લિશ ઓળખો", voiceAnswers: "વૉઇસ જવાબો", readResult: "પરિણામ બોલીને સંભળાવો", languageLabel: "ભાષા", scientific: "વૈજ્ઞાનિક", history: "ઇતિહાસ", clearAll: "બધું સાફ કરો", memory: "મેમરી", tryAgain: "ફરી પ્રયાસ કરો", listening: "સાંભળી રહ્યું છે...", settings: "સેટિંગ્સ" },
    bn: { languageSettings: "ভাষা সেটিংস", interfaceLanguage: "ইন্টারফেসের ভাষা", voiceInputLanguage: "ভয়েস ইনপুট ভাষা", voiceOutputLanguage: "ভয়েস আউটপুট ভাষা", autoDetect: "স্বয়ংক্রিয় শনাক্তকরণ", autoDetectLanguage: "ভাষা শনাক্ত করুন", detectHint: "ইংরেজি, হিন্দি বা হিংলিশ শনাক্ত করুন", voiceAnswers: "ভয়েস উত্তর", readResult: "ফলাফল শুনুন", languageLabel: "ভাষা", scientific: "বৈজ্ঞানিক", history: "ইতিহাস", clearAll: "সব মুছুন", memory: "মেমরি", tryAgain: "আবার চেষ্টা করুন", listening: "শুনছি...", settings: "সেটিংস" },
    ta: { languageSettings: "மொழி அமைப்புகள்", interfaceLanguage: "இடைமுக மொழி", voiceInputLanguage: "குரல் உள்ளீட்டு மொழி", voiceOutputLanguage: "குரல் வெளியீட்டு மொழி", autoDetect: "தானாக கண்டறி", autoDetectLanguage: "மொழியை கண்டறி", detectHint: "ஆங்கிலம், இந்தி அல்லது ஹிங்லிஷ்", voiceAnswers: "குரல் பதில்கள்", readResult: "முடிவை உரக்கப் படி", languageLabel: "மொழி", scientific: "அறிவியல்", history: "வரலாறு", clearAll: "அனைத்தையும் அழி", memory: "நினைவகம்", tryAgain: "மீண்டும் முயற்சி", listening: "கேட்கிறது...", settings: "அமைப்புகள்" },
    te: { languageSettings: "భాషా సెట్టింగ్‌లు", interfaceLanguage: "ఇంటర్‌ఫేస్ భాష", voiceInputLanguage: "వాయిస్ ఇన్‌పుట్ భాష", voiceOutputLanguage: "వాయిస్ అవుట్‌పుట్ భాష", autoDetect: "ఆటో డిటెక్ట్", autoDetectLanguage: "భాషను గుర్తించు", detectHint: "ఇంగ్లీష్, హిందీ లేదా హింగ్లిష్", voiceAnswers: "వాయిస్ సమాధానాలు", readResult: "ఫలితాన్ని చదవండి", languageLabel: "భాష", scientific: "సైంటిఫిక్", history: "చరిత్ర", clearAll: "అన్నీ క్లియర్", memory: "మెమరీ", tryAgain: "మళ్లీ ప్రయత్నించండి", listening: "వింటున్నాను...", settings: "సెట్టింగ్‌లు" },
    kn: { languageSettings: "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು", interfaceLanguage: "ಇಂಟರ್ಫೇಸ್ ಭಾಷೆ", voiceInputLanguage: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಭಾಷೆ", voiceOutputLanguage: "ಧ್ವನಿ ಔಟ್‌ಪುಟ್ ಭಾಷೆ", autoDetect: "ಸ್ವಯಂ ಪತ್ತೆ", autoDetectLanguage: "ಭಾಷೆಯನ್ನು ಪತ್ತೆ ಮಾಡಿ", detectHint: "ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಅಥವಾ ಹಿಂಗ್ಲಿಷ್", voiceAnswers: "ಧ್ವನಿ ಉತ್ತರಗಳು", readResult: "ಫಲಿತಾಂಶವನ್ನು ಓದಿ", languageLabel: "ಭಾಷೆ", scientific: "ವೈಜ್ಞಾನಿಕ", history: "ಇತಿಹಾಸ", clearAll: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ", memory: "ಮೆಮೊರಿ", tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ...", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
    ml: { languageSettings: "ഭാഷാ ക്രമീകരണങ്ങൾ", interfaceLanguage: "ഇന്റർഫേസ് ഭാഷ", voiceInputLanguage: "ശബ്ദ ഇൻപുട്ട് ഭാഷ", voiceOutputLanguage: "ശബ്ദ ഔട്ട്പുട്ട് ഭാഷ", autoDetect: "സ്വയം കണ്ടെത്തുക", autoDetectLanguage: "ഭാഷ കണ്ടെത്തുക", detectHint: "ഇംഗ്ലീഷ്, ഹിന്ദി, ഹിംഗ്ലീഷ്", voiceAnswers: "ശബ്ദ ഉത്തരങ്ങൾ", readResult: "ഫലം വായിക്കുക", languageLabel: "ഭാഷ", scientific: "ശാസ്ത്രീയം", history: "ചരിത്രം", clearAll: "എല്ലാം മായ്ക്കുക", memory: "മെമ്മറി", tryAgain: "വീണ്ടും ശ്രമിക്കുക", listening: "കേൾക്കുന്നു...", settings: "ക്രമീകരണങ്ങൾ" },
    pa: { languageSettings: "ਭਾਸ਼ਾ ਸੈਟਿੰਗਾਂ", interfaceLanguage: "ਇੰਟਰਫੇਸ ਭਾਸ਼ਾ", voiceInputLanguage: "ਵੌਇਸ ਇਨਪੁੱਟ ਭਾਸ਼ਾ", voiceOutputLanguage: "ਵੌਇਸ ਆਉਟਪੁੱਟ ਭਾਸ਼ਾ", autoDetect: "ਆਪਣੇ ਆਪ ਪਛਾਣੋ", autoDetectLanguage: "ਭਾਸ਼ਾ ਪਛਾਣੋ", detectHint: "ਅੰਗਰੇਜ਼ੀ, ਹਿੰਦੀ ਜਾਂ ਹਿੰਗਲਿਸ਼", voiceAnswers: "ਵੌਇਸ ਜਵਾਬ", readResult: "ਨਤੀਜਾ ਬੋਲੋ", languageLabel: "ਭਾਸ਼ਾ", scientific: "ਵਿਗਿਆਨਕ", history: "ਇਤਿਹਾਸ", clearAll: "ਸਭ ਸਾਫ਼ ਕਰੋ", memory: "ਮੈਮੋਰੀ", tryAgain: "ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ", listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...", settings: "ਸੈਟਿੰਗਾਂ" },
    ur: { languageSettings: "زبان کی ترتیبات", interfaceLanguage: "انٹرفیس کی زبان", voiceInputLanguage: "وائس ان پٹ زبان", voiceOutputLanguage: "وائس آؤٹ پٹ زبان", autoDetect: "خودکار شناخت", autoDetectLanguage: "زبان کی شناخت", detectHint: "انگریزی، ہندی یا ہنگلش", voiceAnswers: "وائس جوابات", readResult: "نتیجہ سنائیں", languageLabel: "زبان", scientific: "سائنسی", history: "تاریخ", clearAll: "سب صاف کریں", memory: "میموری", tryAgain: "دوبارہ کوشش", listening: "سن رہا ہے...", settings: "ترتیبات" }
  };
  const UI_CORE = {
    en: { calculator: "Calculator", yourExpression: "YOUR EXPRESSION", history: "History", clear: "Clear all", delete: "Delete calculation", memory: "MEMORY", degrees: "Degrees", radians: "Radians", result: "Result", settings: "Settings" },
    hi: { calculator: "कैलकुलेटर", yourExpression: "आपकी गणना", history: "इतिहास", clear: "साफ़ करें", delete: "हटाएँ", memory: "मेमोरी", degrees: "डिग्री", radians: "रेडियन", result: "परिणाम", settings: "सेटिंग्स" },
    hinglish: { calculator: "Calculator", yourExpression: "YOUR EXPRESSION", history: "History", clear: "Clear", delete: "Delete", memory: "MEMORY", degrees: "Degree", radians: "Radian", result: "Result", settings: "Settings" },
    mr: { calculator: "गणक", yourExpression: "तुमचे गणित", history: "इतिहास", clear: "सर्व पुसून टाका", delete: "हटवा", memory: "मेमरी", degrees: "अंश", radians: "रेडियन", result: "निकाल", settings: "सेटिंग्ज" },
    gu: { calculator: "કેલ્ક્યુલેટર", yourExpression: "તમારી ગણતરી", history: "ઇતિહાસ", clear: "બધું સાફ કરો", delete: "કાઢી નાખો", memory: "મેમરી", degrees: "ડિગ્રી", radians: "રેડિયન", result: "પરિણામ", settings: "સેટિંગ્સ" },
    bn: { calculator: "ক্যালকুলেটর", yourExpression: "আপনার হিসাব", history: "ইতিহাস", clear: "সব মুছুন", delete: "মুছুন", memory: "মেমরি", degrees: "ডিগ্রি", radians: "রেডিয়ান", result: "ফলাফল", settings: "সেটিংস" },
    ta: { calculator: "கால்குலேட்டர்", yourExpression: "உங்கள் கணக்கு", history: "வரலாறு", clear: "அனைத்தையும் அழி", delete: "நீக்கு", memory: "நினைவகம்", degrees: "டிகிரி", radians: "ரேடியன்", result: "முடிவு", settings: "அமைப்புகள்" },
    te: { calculator: "క్యాలిక్యులేటర్", yourExpression: "మీ లెక్క", history: "చరిత్ర", clear: "అన్నీ క్లియర్", delete: "తొలగించు", memory: "మెమరీ", degrees: "డిగ్రీలు", radians: "రేడియన్లు", result: "ఫలితం", settings: "సెట్టింగ్‌లు" },
    kn: { calculator: "ಕ್ಯಾಲ್ಕುಲೇಟರ್", yourExpression: "ನಿಮ್ಮ ಲೆಕ್ಕ", history: "ಇತಿಹಾಸ", clear: "ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ", delete: "ಅಳಿಸಿ", memory: "ಮೆಮೊರಿ", degrees: "ಡಿಗ್ರಿ", radians: "ರೇಡಿಯನ್", result: "ಫಲಿತಾಂಶ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
    ml: { calculator: "കാൽക്കുലേറ്റർ", yourExpression: "നിങ്ങളുടെ കണക്ക്", history: "ചരിത്രം", clear: "എല്ലാം മായ്ക്കുക", delete: "നീക്കംചെയ്യുക", memory: "മെമ്മറി", degrees: "ഡിഗ്രി", radians: "റേഡിയൻ", result: "ഫലം", settings: "ക്രമീകരണങ്ങൾ" },
    pa: { calculator: "ਕੈਲਕੁਲੇਟਰ", yourExpression: "ਤੁਹਾਡਾ ਹਿਸਾਬ", history: "ਇਤਿਹਾਸ", clear: "ਸਭ ਸਾਫ਼ ਕਰੋ", delete: "ਮਿਟਾਓ", memory: "ਮੈਮੋਰੀ", degrees: "ਡਿਗਰੀ", radians: "ਰੇਡੀਅਨ", result: "ਨਤੀਜਾ", settings: "ਸੈਟਿੰਗਾਂ" },
    ur: { calculator: "کیلکولیٹر", yourExpression: "آپ کا حساب", history: "تاریخ", clear: "سب صاف کریں", delete: "حذف کریں", memory: "میموری", degrees: "ڈگری", radians: "ریڈین", result: "نتیجہ", settings: "ترتیبات" }
  };
  const VOICE_RESPONSES = {
    en: { prefix: "The answer is", suffix: "." }, hi: { prefix: "उत्तर", suffix: "है।" },
    hinglish: { prefix: "Answer", suffix: "hai." }, mr: { prefix: "उत्तर", suffix: "आहे." },
    gu: { prefix: "જવાબ", suffix: "છે." }, bn: { prefix: "উত্তর", suffix: "হয়।" },
    ta: { prefix: "விடை", suffix: "ஆகும்." }, te: { prefix: "సమాధానం", suffix: "అవుతుంది." },
    kn: { prefix: "ಉತ್ತರ", suffix: "ಆಗಿದೆ." }, ml: { prefix: "ഉത്തരം", suffix: "ആണ്." },
    pa: { prefix: "ਜਵਾਬ", suffix: "ਹੈ।" }, ur: { prefix: "جواب", suffix: "ہے۔" }
  };
  const ERROR_MESSAGES = {
    en: { divideZero: "Cannot divide by zero", invalid: "Invalid input", factorial: "Factorial requires a non-negative integer", expression: "Invalid expression", unknownVoice: "Could not understand the calculation" },
    hi: { divideZero: "शून्य से भाग नहीं दे सकते", invalid: "अमान्य इनपुट", factorial: "फैक्टोरियल के लिए शून्य या सकारात्मक पूर्णांक चाहिए", expression: "अमान्य गणना", unknownVoice: "गणना समझ नहीं आई" },
    hinglish: { divideZero: "Zero se divide nahi kar sakte", invalid: "Invalid input", factorial: "Factorial ke liye non-negative integer chahiye", expression: "Invalid expression", unknownVoice: "Calculation samajh nahi aayi" }
  };
  function loadLanguagePreferences() {
    let previousVoiceOutput = true;
    try { previousVoiceOutput = localStorage.getItem(STORAGE.feedback) !== "false"; }
    catch (error) { console.warn("Could not read the previous voice output setting.", error); }
    const defaults = { interface: "en", input: "auto", output: "en", autoDetect: true, voiceOutput: previousVoiceOutput };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.language) || "{}");
      const valid = (key) => Object.hasOwn(LANGUAGE_CONFIG, saved[key]);
      return {
        interface: valid("interface") ? saved.interface : defaults.interface,
        input: saved.input === "auto" || valid("input") ? saved.input : defaults.input,
        output: valid("output") ? saved.output : defaults.output,
        autoDetect: typeof saved.autoDetect === "boolean" ? saved.autoDetect : defaults.autoDetect,
        voiceOutput: typeof saved.voiceOutput === "boolean" ? saved.voiceOutput : defaults.voiceOutput
      };
    } catch (error) {
      console.warn("Could not load language preferences; using defaults.", error);
      return defaults;
    }
  }
  let languagePreferences = loadLanguagePreferences();
  function saveLanguagePreferences() {
    try { localStorage.setItem(STORAGE.language, JSON.stringify(languagePreferences)); }
    catch (error) { console.warn("Could not save language preferences.", error); }
  }
  let expression = "";
  let lastResult = 0;
  let memory = null;
  let angleUnit = "DEG";
  let scientific = false;
  let recognition = null;
  let isListening = false;
  let recognitionAttempt = 0;
  let speakFeedback = languagePreferences.voiceOutput;
  let detectedVoiceLanguage = "en";
  let history = loadHistory();

  function loadHistory() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE.history) || "[]");
      return Array.isArray(stored) ? stored.filter((item) => item && typeof item.id === "string" && typeof item.expression === "string" && typeof item.result === "string") : [];
    } catch (error) {
      console.error("Could not read calculator history.", error);
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE.history, JSON.stringify(history));
    } catch (error) {
      console.error("Could not save calculator history.", error);
      setNote("History could not be saved on this device");
    }
  }

  function setNote(text) { displayNote.textContent = text; }
  function formatNumber(value) {
    if (!Number.isFinite(value)) throw new Error("Invalid input");
    const normalized = Math.abs(value) < 1e-12 ? 0 : value;
    return Number(normalized.toPrecision(12)).toString();
  }
  function displayExpression(value) {
    return value.replace(/sqrt\(/g, "√(").replace(/cbrt\(/g, "∛(").replace(/(\d+)%\*/g, "$1% of ").replace(/\*/g, "×").replace(/\//g, "÷").replace(/-/g, "−");
  }
  function renderDisplay() {
    expressionDisplay.textContent = expression ? displayExpression(expression) : "Ready when you are";
    expressionDisplay.scrollLeft = expressionDisplay.scrollWidth;
    resultDisplay.classList.remove("error");
    resultDisplay.textContent = expression ? "" : "0";
  }
  function setError(message) {
    const key = message === "Cannot divide by zero" ? "divideZero"
      : message === "Factorial requires a non-negative integer" ? "factorial"
      : message === "Invalid input" ? "invalid"
      : message === "Could not understand the calculation" ? "unknownVoice" : "expression";
    const localizedErrors = ERROR_MESSAGES[languagePreferences.interface] || ERROR_MESSAGES.en;
    resultDisplay.textContent = localizedErrors[key] || ERROR_MESSAGES.en[key];
    resultDisplay.classList.add("error");
    setNote("Let's check that expression");
  }

  function tokenize(input) {
    const text = input.replace(/[×]/g, "*").replace(/[÷]/g, "/").replace(/[−–]/g, "-").replace(/π/g, "pi");
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      if (/\s/.test(text[i])) { i++; continue; }
      const number = text.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      if (number) { tokens.push({ type: "number", value: Number(number[0]) }); i += number[0].length; continue; }
      const identifier = text.slice(i).match(/^[a-z]+/i);
      if (identifier) { tokens.push({ type: "identifier", value: identifier[0].toLowerCase() }); i += identifier[0].length; continue; }
      if ("+-*/^()%!".includes(text[i])) { tokens.push({ type: "operator", value: text[i] }); i++; continue; }
      throw new Error("Invalid expression");
    }
    return tokens;
  }

  function evaluate(input) {
    const tokens = tokenize(input);
    let position = 0;
    const peek = () => tokens[position];
    const take = () => tokens[position++];
    const functions = new Set(["sin", "cos", "tan", "cot", "sec", "csc", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "abs", "exp"]);
    const angle = angleUnit === "DEG" ? Math.PI / 180 : 1;
    function factorial(value) {
      if (!Number.isInteger(value) || value < 0 || value > 170) throw new Error("Factorial requires a non-negative integer");
      let product = 1;
      for (let i = 2; i <= value; i++) product *= i;
      return product;
    }
    function applyFunction(name, value) {
      let result;
      switch (name) {
        case "sin": result = Math.sin(value * angle); break;
        case "cos": result = Math.cos(value * angle); break;
        case "tan": result = Math.tan(value * angle); break;
        case "cot": result = 1 / Math.tan(value * angle); break;
        case "sec": result = 1 / Math.cos(value * angle); break;
        case "csc": result = 1 / Math.sin(value * angle); break;
        case "asin": result = Math.asin(value) / angle; break;
        case "acos": result = Math.acos(value) / angle; break;
        case "atan": result = Math.atan(value) / angle; break;
        case "log": if (value <= 0) throw new Error("Invalid input"); result = Math.log10(value); break;
        case "ln": if (value <= 0) throw new Error("Invalid input"); result = Math.log(value); break;
        case "sqrt": if (value < 0) throw new Error("Invalid input"); result = Math.sqrt(value); break;
        case "cbrt": result = Math.cbrt(value); break;
        case "abs": result = Math.abs(value); break;
        case "exp": result = Math.exp(value); break;
        default: throw new Error("Invalid expression");
      }
      return result;
    }
    function parsePrimary() {
      const token = take();
      if (!token) throw new Error("Invalid expression");
      if (token.type === "number") return token.value;
      if (token.value === "(") {
        const value = parseAddSub();
        if (!peek() || take().value !== ")") throw new Error("Invalid expression");
        return value;
      }
      if (token.value === "+" || token.value === "-") {
        const value = parseExpression(25);
        return token.value === "-" ? -value : value;
      }
      if (token.type === "identifier") {
        if (token.value === "pi") return Math.PI;
        if (token.value === "e") return Math.E;
        if (functions.has(token.value)) {
          let argument;
          if (peek() && peek().value === "(") { take(); argument = parseAddSub(); if (!peek() || take().value !== ")") throw new Error("Invalid expression"); }
          else argument = parseExpression(25);
          return applyFunction(token.value, argument);
        }
      }
      throw new Error("Invalid expression");
    }
    function parsePostfix() {
      let value = parsePrimary();
      while (peek() && (peek().value === "!" || peek().value === "%")) {
        const operator = take().value;
        value = operator === "!" ? factorial(value) : value / 100;
      }
      return value;
    }
    function parsePower() {
      let value = parsePostfix();
      if (peek() && peek().value === "^") { take(); value = Math.pow(value, parseUnary()); }
      return value;
    }
    function parseUnary() {
      if (peek() && (peek().value === "+" || peek().value === "-")) {
        const sign = take().value;
        const value = parseUnary();
        return sign === "-" ? -value : value;
      }
      return parsePower();
    }
    function parseMultiply() {
      let value = parseUnary();
      while (peek() && ["*", "/"].includes(peek().value)) {
        const operator = take().value;
        const right = parseUnary();
        if (operator === "/" && right === 0) throw new Error("Cannot divide by zero");
        value = operator === "*" ? value * right : value / right;
      }
      return value;
    }
    function parseAddSub() {
      let value = parseMultiply();
      while (peek() && (peek().value === "+" || peek().value === "-")) {
        const operator = take().value;
        const right = parseMultiply();
        value = operator === "+" ? value + right : value - right;
      }
      return value;
    }
    function parseExpression(minPrecedence) {
      if (minPrecedence > 25) return parsePrimary();
      return parseUnary();
    }
    if (!tokens.length) throw new Error("Invalid expression");
    const value = parseAddSub();
    if (position !== tokens.length) throw new Error("Invalid expression");
    return value;
  }

  function addHistory(source, value) {
    const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, expression: source, result: formatNumber(value), time: Date.now() };
    history.unshift(item);
    history = history.slice(0, 40);
    saveHistory();
    renderHistory();
  }
  function renderHistory() {
    $("#history-count").textContent = history.length;
    if (!history.length) {
      historyList.innerHTML = '<div class="empty-history"><span class="history-symbol">↗</span><p>Your calculations will<br>show up here.</p></div>';
      return;
    }
    historyList.innerHTML = "";
    for (const item of history) {
      const row = document.createElement("div");
      row.className = "history-item";
      row.tabIndex = 0;
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `${item.expression} equals ${item.result}. Click to reuse.`);
      const expr = document.createElement("div");
      expr.className = "history-expression";
      expr.textContent = displayExpression(item.expression);
      const result = document.createElement("div");
      result.className = "history-result";
      result.textContent = item.result;
      const time = document.createElement("span");
      time.className = "history-time";
      time.textContent = new Date(item.time || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const remove = document.createElement("button");
      remove.className = "history-delete";
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", UI_CORE[languagePreferences.interface].delete);
      remove.addEventListener("click", (event) => {
        event.stopPropagation();
        history = history.filter((entry) => entry.id !== item.id);
        saveHistory();
        renderHistory();
      });
      const reuse = () => { expression = item.expression; lastResult = Number(item.result); renderDisplay(); resultDisplay.textContent = item.result; setNote("Previous calculation restored"); };
      row.addEventListener("click", reuse);
      row.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); reuse(); } });
      row.append(expr, result, time, remove);
      historyList.append(row);
    }
  }

  function calculate(source = expression, options = {}) {
    if (!source.trim()) return;
    try {
      const value = evaluate(source);
      const formatted = formatNumber(value);
      expression = source;
      lastResult = value;
      expressionDisplay.textContent = displayExpression(source) + (options.voice ? "  =" : "");
      resultDisplay.classList.remove("error");
      resultDisplay.textContent = formatted;
      setNote(options.voice ? "Voice calculation complete" : "Calculation complete");
      addHistory(source, value);
      if (speakFeedback && options.voice) speakAnswer(formatted);
    } catch (error) {
      const message = error.message === "Cannot divide by zero" ? error.message :
        error.message === "Factorial requires a non-negative integer" ? error.message :
        error.message === "Invalid input" ? error.message : "Invalid expression";
      setError(message);
      if (options.voice) setVoiceError(LANGUAGE_CONFIG[detectedVoiceLanguage].voiceError, detectedVoiceLanguage);
    }
  }

  function insert(value) {
    if (!expression && /^[+×÷−^%!)]/.test(value)) return;
    expression += value;
    renderDisplay();
    setNote("Expression in progress");
  }
  function clear() { expression = ""; resultDisplay.textContent = "0"; resultDisplay.classList.remove("error"); renderDisplay(); setNote("Your answer will appear here"); }
  function backspace() { expression = expression.slice(0, -1); renderDisplay(); }
  function toggleSign() {
    if (!expression) { expression = "-"; }
    else if (/^-?\d*\.?\d+$/.test(expression)) { expression = expression.startsWith("-") ? expression.slice(1) : `-${expression}`; }
    else { expression = `-(${expression})`; }
    renderDisplay();
  }
  function currentValue() {
    if (resultDisplay.classList.contains("error")) throw new Error("Invalid input");
    if (resultDisplay.textContent && resultDisplay.textContent !== "0" && !Number.isNaN(Number(resultDisplay.textContent))) return Number(resultDisplay.textContent);
    return expression ? evaluate(expression) : lastResult;
  }
  function memoryAction(action) {
    try {
      const value = currentValue();
      if (action === "mc") memory = null;
      if (action === "ms") memory = value;
      if (action === "mplus") memory = (memory || 0) + value;
      if (action === "mminus") memory = (memory || 0) - value;
      if (action === "mr") {
        if (memory !== null) { expression += formatNumber(memory); renderDisplay(); }
      }
      $("#memory-indicator").hidden = memory === null;
      setNote(memory === null ? "Memory cleared" : "Memory updated");
    } catch (error) { setError(error.message === "Cannot divide by zero" ? error.message : "Invalid input"); }
  }

  const EN_NUMBERS = {
    zero: 0, oh: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
    ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
    hundred: 100, thousand: 1000, million: 1000000
  };
  const INDIAN_NUMBERS = {
    hi: {
      "शून्य": 0, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पाँच": 5, "पांच": 5, "छह": 6, "सात": 7, "आठ": 8, "नौ": 9,
      "दस": 10, "ग्यारह": 11, "बारह": 12, "तेरह": 13, "चौदह": 14, "पंद्रह": 15, "सोलह": 16, "सत्रह": 17, "अठारह": 18, "उन्नीस": 19,
      "बीस": 20, "इक्कीस": 21, "बाईस": 22, "तेईस": 23, "चौबीस": 24, "पच्चीस": 25, "पचीस": 25, "छब्बीस": 26, "सत्ताईस": 27, "अट्ठाईस": 28, "उनतीस": 29,
      "तीस": 30, "इकतीस": 31, "बत्तीस": 32, "तैंतीस": 33, "चौंतीस": 34, "पैंतीस": 35, "पैंतिस": 35, "छत्तीस": 36, "सैंतीस": 37, "अड़तीस": 38, "उनतालीस": 39,
      "चालीस": 40, "पचास": 50, "साठ": 60, "सत्तर": 70, "अस्सी": 80, "नब्बे": 90, "सौ": 100, "हज़ार": 1000, "हजार": 1000
    },
    hinglish: {
      ek: 1, eka: 1, do: 2, dho: 2, teen: 3, tin: 3, char: 4, chaar: 4, chau: 4, paanch: 5, panch: 5, paanchh: 5, cheh: 6, chhah: 6, saat: 7, sat: 7, aath: 8, aat: 8, nau: 9,
      das: 10, gyarah: 11, barah: 12, terah: 13, chaudah: 14, pandrah: 15, solah: 16, satrah: 17, atharah: 18, unnis: 19,
      bees: 20, bis: 20, ikkis: 21, bais: 22, teis: 23, chaubis: 24, pachis: 25, pachchis: 25, pachees: 25, pachees: 25, chhabis: 26, sattais: 27, athais: 28, untis: 29,
      tees: 30, tis: 30, ikattis: 31, battis: 32, teintis: 33, chauntis: 34, paintis: 35, paintees: 35, paitis: 35, pentis: 35, chhattis: 36, saintis: 37, adtis: 38, untalis: 39,
      chalis: 40, chaalis: 40, challis: 40, pachas: 50, pachaas: 50, pachhas: 50, saath: 60, sath: 60, sattar: 70, assi: 80, asi: 80, nabbe: 90, navve: 90,
      sau: 100, so: 100, hazaar: 1000, hazar: 1000, hajar: 1000
    },
    mr: { "शून्य": 0, "एक": 1, "दोन": 2, "तीन": 3, "चार": 4, "पाच": 5, "सहा": 6, "सात": 7, "आठ": 8, "नऊ": 9, "दहा": 10, "वीस": 20, "पंचवीस": 25, "तीस": 30, "पस्तीस": 35, "चाळीस": 40, "पन्नास": 50, "साठ": 60, "ऐंशी": 80, "शंभर": 100, "हजार": 1000 },
    gu: { "શૂન્ય": 0, "એક": 1, "બે": 2, "ત્રણ": 3, "ચાર": 4, "પાંચ": 5, "છ": 6, "સાત": 7, "આઠ": 8, "નવ": 9, "દસ": 10, "વીસ": 20, "પચ્ચીસ": 25, "ત્રીસ": 30, "પાંત્રીસ": 35, "ચાલીસ": 40, "પચાસ": 50, "સાઠ": 60, "એંસી": 80, "સો": 100, "હજાર": 1000 },
    bn: { "শূন্য": 0, "এক": 1, "দুই": 2, "তিন": 3, "চার": 4, "পাঁচ": 5, "ছয়": 6, "সাত": 7, "আট": 8, "নয়": 9, "দশ": 10, "বিশ": 20, "পঁচিশ": 25, "ত্রিশ": 30, "পঁয়ত্রিশ": 35, "চল্লিশ": 40, "পঞ্চাশ": 50, "ষাট": 60, "আশি": 80, "একশো": 100, "শত": 100, "হাজার": 1000 },
    ta: { "பூஜ்ஜியம்": 0, "ஒன்று": 1, "இரண்டு": 2, "மூன்று": 3, "நான்கு": 4, "ஐந்து": 5, "ஆறு": 6, "ஏழு": 7, "எட்டு": 8, "ஒன்பது": 9, "பத்து": 10, "இருபது": 20, "இருபத்தைந்து": 25, "முப்பது": 30, "முப்பத்தைந்து": 35, "நாற்பது": 40, "ஐம்பது": 50, "அறுபது": 60, "எண்பது": 80, "நூறு": 100, "ஆயிரம்": 1000 },
    te: { "సున్నా": 0, "ఒకటి": 1, "రెండు": 2, "మూడు": 3, "నాలుగు": 4, "ఐదు": 5, "ఆరు": 6, "ఏడు": 7, "ఎనిమిది": 8, "తొమ్మిది": 9, "పది": 10, "ఇరవై": 20, "ఇరవై ఐదు": 25, "ముప్పై": 30, "ముప్పై ఐదు": 35, "నలభై": 40, "యాభై": 50, "అరవై": 60, "ఎనభై": 80, "వంద": 100, "వెయ్యి": 1000 },
    kn: { "ಸೊನ್ನೆ": 0, "ಒಂದು": 1, "ಎರಡು": 2, "ಮೂರು": 3, "ನಾಲ್ಕು": 4, "ಐದು": 5, "ಆರು": 6, "ಏಳು": 7, "ಎಂಟು": 8, "ಒಂಬತ್ತು": 9, "ಹತ್ತು": 10, "ಇಪ್ಪತ್ತು": 20, "ಇಪ್ಪತ್ತೈದು": 25, "ಮೂವತ್ತು": 30, "ಮೂವತ್ತೈದು": 35, "ನಲವತ್ತು": 40, "ಐವತ್ತು": 50, "ಅರವತ್ತು": 60, "ಎಂಬತ್ತು": 80, "ನೂರು": 100, "ಸಾವಿರ": 1000 },
    ml: { "പൂജ്യം": 0, "ഒന്ന്": 1, "രണ്ട്": 2, "മൂന്ന്": 3, "നാല്": 4, "അഞ്ച്": 5, "ആറ്": 6, "ഏഴ്": 7, "എട്ട്": 8, "ഒൻപത്": 9, "പത്ത്": 10, "ഇരുപത്": 20, "ഇരുപത്തഞ്ച്": 25, "മുപ്പത്": 30, "മുപ്പത്തഞ്ച്": 35, "നാൽപ്പത്": 40, "അമ്പത്": 50, "അറുപത്": 60, "എൺപത്": 80, "നൂറ്": 100, "ആയിരം": 1000 },
    pa: { "ਸਿਫ਼ਰ": 0, "ਇੱਕ": 1, "ਇਕ": 1, "ਦੋ": 2, "ਤਿੰਨ": 3, "ਚਾਰ": 4, "ਪੰਜ": 5, "ਛੇ": 6, "ਸੱਤ": 7, "ਅੱਠ": 8, "ਨੌਂ": 9, "ਦਸ": 10, "ਵੀਹ": 20, "ਪੱਚੀ": 25, "ਤੀਹ": 30, "ਪੈਂਤੀ": 35, "ਚਾਲੀ": 40, "ਪੰਜਾਹ": 50, "ਸੱਠ": 60, "ਅੱਸੀ": 80, "ਸੌ": 100, "ਹਜ਼ਾਰ": 1000 },
    ur: { "صفر": 0, "ایک": 1, "دو": 2, "تین": 3, "چار": 4, "پانچ": 5, "چھ": 6, "سات": 7, "آٹھ": 8, "نو": 9, "دس": 10, "بیس": 20, "پچیس": 25, "تیس": 30, "پینتیس": 35, "چالیس": 40, "پچاس": 50, "ساٹھ": 60, "اسی": 80, "سو": 100, "ہزار": 1000 }
  };
  const OPERATOR_WORDS = {
    "+": ["plus", "add", "added to", "sum", "जमा", "प्लस", "जोड़", "जोड़ो", "अधिक", "jama", "jamaa", "jod", "jodo", "add karo", "बेरीज", "अधिक", "વત્તા", "સરવાળો", "যোগ", "যোগফল", "கூட்டல்", "கூட்டு", "కూడిక", "కలిపి", "ಸೇರಿಸು", "കൂട്ടുക", "ਜੋੜ", "جمع", "جمع کریں"],
    "-": ["minus", "subtract", "subtract by", "less", "घटा", "घटाओ", "माइनस", "ghata", "ghatao", "kam", "వजा", "वजा", "બાદ", "বিয়োগ", "கழித்தல்", "తీసివేత", "ಕಳೆಯಿರಿ", "കുറയ്ക്കുക", "ਘਟਾਓ", "منفی"],
    "*": ["times", "multiply", "multiplied by", "multiply by", "into", "गुणा", "गुणित", "गुणिले", "guna", "gunit", "guno", "guna karo", "ಗುણ્યા", "ગુણાકાર", "গুণ", "பெருக்கல்", "గుణకారం", "ಗುಣಿಸು", "ഗുണിക്കുക", "ਗੁਣਾ", "ضرب"],
    "/": ["divided by", "divide by", "divide", "divided", "over", "भाग देकर", "भाग", "भागा", "भाग करो", "bhag", "bhaag", "bhag karo", "divide karo", "भागिले", "भागिले", "ભાગ્યા", "ભાગાકાર", "ভাগ", "வகுத்தல்", "భాగహారం", "ಭಾಗಿಸು", "ഹരിക്കുക", "ਭਾਗ", "تقسیم"],
    "^": ["to the power of", "raised to", "power of", "power", "की घात", "की पावर", "घात", "घातांक", "ki power", "ki ghat", "power", "ઘાત", "সূচক", "அடுக்குக்கு", "ఘాతం", "ಘಾತ", "ഘാതം", "ਘਾਤ", "کی طاقت"],
    "^ 2": ["square", "वर्ग", "varg", "वर्ग करो"],
    "^ 3": ["cube", "घन", "ghan"],
    "%": ["percentage", "percent", "प्रतिशत", "فیصد"],
    "!": ["factorial", "फैक्टोरियल"],
    "sqrt": ["square root of", "square root", "root of", "root", "वर्गमूल", "वर्ग मूल", "वर्गमूल", "vargmool", "varg mool", "square root", "বর্গমূল", "વર્ગમૂળ", "வர்க்கமூலம்", "వర్గమూలం", "ವರ್ಗಮೂಲ", "വർഗ്ഗമൂലം", "ਵਰਗਮੂਲ", "مربع جذر"],
    "cbrt": ["cube root of", "cube root", "घनमूल", "घन मूल"],
    "sin": ["sine", "साइन", "सिन", "sine"],
    "cos": ["cosine", "कॉस", "कोसाइन"],
    "tan": ["tangent", "टैन", "टैनजेंट"],
    "cot": ["cotangent", "कॉट"],
    "sec": ["secant"],
    "csc": ["cosecant"],
    "asin": ["arcsine", "inverse sine", "साइन इनवर्स"],
    "acos": ["arccosine", "inverse cosine"],
    "atan": ["arctangent", "inverse tangent"],
    "log": ["logarithm", "log", "लॉग"],
    "ln": ["natural log", "natural logarithm", "एलएन"],
    "abs": ["absolute value", "absolute"],
    "exp": ["exponential"],
    "pi": ["pi", "पाई"],
    "open": ["open bracket", "open parenthesis"],
    "close": ["close bracket", "close parenthesis"]
  };
  function replaceSpokenPhrases(text, phraseMap) {
    for (const [phrase, replacement] of phraseMap) {
      const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
      text = text.replace(new RegExp(`(^|\\s)${escaped}(?=$|\\s)`, "gu"), (_match, prefix) => `${prefix}${replacement}`);
    }
    return text;
  }
  function spokenNumberValue(words, numberMap) {
    let total = 0;
    let current = 0;
    for (const word of words) {
      const value = numberMap[word];
      if (value === undefined) return null;
      if (value === 100) current = Math.max(1, current) * 100;
      else if (value >= 1000) { total += Math.max(1, current) * value; current = 0; }
      else current += value;
    }
    return String(total + current);
  }
  function languageNumbers() {
    const map = { ...EN_NUMBERS };
    for (const words of Object.values(INDIAN_NUMBERS)) Object.assign(map, words);
    return map;
  }
  function numberWordsToDigits(text) {
    const numbers = languageNumbers();
    const tokens = text.split(/\s+/).filter(Boolean);
    const output = [];
    for (let i = 0; i < tokens.length;) {
      if (Object.hasOwn(numbers, tokens[i])) {
        let end = i + 1;
        while (end < tokens.length && Object.hasOwn(numbers, tokens[end])) end++;
        output.push(spokenNumberValue(tokens.slice(i, end), numbers));
        i = end;
      } else {
        output.push(tokens[i]);
        i++;
      }
    }
    return output.join(" ");
  }
  function replaceLocaleDigits(text) {
    const digitSets = ["٠١٢٣٤٥٦٧٨٩", "۰۱۲۳۴۵۶۷۸۹", "०१२३४५६७८९", "૦૧૨૩૪૫૬૭૮૯", "০১২৩৪৫৬৭৮৯", "௦௧௨௩௪௫௬௭௮௯", "౦౧౨౩౪౫౬౭౮౯", "೦೧೨೩೪೫೬೭೮೯", "൦൧൨൩൪൫൬൭൮൯", "੦੧੨੩੪੫੬੭੮੯"];
    for (const digits of digitSets) for (let i = 0; i < digits.length; i++) text = text.replaceAll(digits[i], String(i));
    return text;
  }
  function detectVoiceLanguage(raw) {
    if (/[ऀ-ॿ]/u.test(raw)) return "hi";
    if (/[઀-૿]/u.test(raw)) return "gu";
    if (/[ঀ-৿]/u.test(raw)) return "bn";
    if (/[஀-௿]/u.test(raw)) return "ta";
    if (/[ఀ-౿]/u.test(raw)) return "te";
    if (/[ಀ-೿]/u.test(raw)) return "kn";
    if (/[ഀ-ൿ]/u.test(raw)) return "ml";
    if (/[਀-੿]/u.test(raw)) return "pa";
    if (/[؀-ۿ]/u.test(raw)) return "ur";
    if (/\b(?:jama|jamaa|ghata|guna|gunit|bhag|pachis|pachees|paintis|paintees|paitis|pentis|pachaas|pachas|chaalis|chalis|hazaar|sau|ko|se|ka|ki|karo|batao)\b/i.test(raw)) return "hinglish";
    return "en";
  }
  function normalizeVoice(raw) {
    // Normalize spoken text into a restricted arithmetic grammar before the safe parser sees it.
    let text = replaceLocaleDigits(String(raw).toLowerCase())
      .replace(/([a-z])\s*-\s*([a-z])/g, "$1 $2")
      .replace(/[?!,;:।]/g, " ")
      .replace(/\bwhat's\b/g, "what is");
    const phraseRules = [];
    for (const [operator, phrases] of Object.entries(OPERATOR_WORDS)) {
      const replacement = operator === "open" ? "(" : operator === "close" ? ")" : operator === "pi" ? "π" : operator;
      for (const phrase of phrases) phraseRules.push([phrase.toLowerCase(), replacement]);
    }
    phraseRules.push(
      ["multiplied", "*"], ["divided", "/"], ["subtract", "-"], ["minus", "-"],
      ["squared", "^ 2"], ["cubed", "^ 3"],
      ["percent of", "% of"], ["percentage of", "% of"], ["decimal", "point"],
      ["point", "point"], ["what is", " "], ["can you calculate", " "],
      ["tell me", " "], ["natural log", "ln"], ["log base ten", "log"]
    );
    phraseRules.sort((a, b) => b[0].length - a[0].length);
    text = replaceSpokenPhrases(text, phraseRules);
    text = text.replace(/\b(?:percent|percentage)\s+of\b/g, "% of")
      .replace(/\b(?:of)\b/g, " of ")
      .replace(/\band\b/g, " ")
      .replace(/\s+/g, " ").trim();
    text = numberWordsToDigits(text)
      .replace(/\bpoint\b/g, ".")
      .replace(/(\d+(?:\.\d+)?)\s+(?:ko)\s+(\d+(?:\.\d+)?)\s+(?:se)\s*([*/])/g, "$1$3$2")
      .replace(/(\d+(?:\.\d+)?)\s+mein\s+(\d+(?:\.\d+)?)\s*([+\-*/])/g, "$1$3$2")
      .replace(/(\d+(?:\.\d+)?)\s+mein\s+se\s+(\d+(?:\.\d+)?)\s*-/g, "$1-$2")
      .replace(/(\d+(?:\.\d+)?)\s+(?:ka|का)\s+(\d+(?:\.\d+)?)\s*%/gu, "$2%*$1")
      .replace(/(\d+(?:\.\d+)?)\s+(?:ka|का)\s+(sqrt|cbrt|sin|cos|tan|cot|sec|csc|asin|acos|atan|log|ln|abs|exp)\b/gu, "$2($1)");
    text = text
      .replace(/\b(?:and)\b/g, " and ")
      .replace(/\b(?:what|is|the|please|calculate|compute|tell|me|can|you|equals|equal|batao|bataye|bataiye|karo|karein|nikalo|kitna|hai|hoga|ko|se|mein|me|ka|ki|ke|and)\b/g, " ")
      .replace(/(?:करो|करें|बताओ|बताइए|निकालो|कितना|है|होगा|का|की|के|को|से|में|मे|क्या|कृपया|जरा)/gu, " ")
      .replace(/\s+/g, " ").trim();
    text = text.replace(/(\d+(?:\.\d+)?)\s+of\s+(\d+(?:\.\d+)?)/g, "$1*$2")
      .replace(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*%/g, "$2%*$1")
      .replace(/(\d+(?:\.\d+)?)\s+(sqrt|cbrt|sin|cos|tan|cot|sec|csc|asin|acos|atan|log|ln|abs|exp)\b/g, "$2($1)")
      .replace(/\b(sqrt|cbrt|sin|cos|tan|cot|sec|csc|asin|acos|atan|log|ln|abs|exp)\s+(-?\d+(?:\.\d+)?|π|e)\b/g, "$1($2)")
      .replace(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/g, "$1%*$2")
      .replace(/\bof\b/g, "*")
      .replace(/\s*\.\s*/g, ".")
      .replace(/\s+/g, " ").trim();
    if (!text || !/^[\d.eπ()+*/^%!\-\s,a-z]+$/iu.test(text)) throw new Error("Could not understand the calculation");
    return text.replace(/\s*([()+*/^%!])\s*/g, "$1").replace(/×/g, "*").replace(/÷/g, "/");
  }

  function uiText(key) {
    return UI_TRANSLATIONS[languagePreferences.interface][key] || UI_TRANSLATIONS.en[key] || key;
  }
  function applyInterfaceLanguage() {
    const language = languagePreferences.interface;
    document.documentElement.lang = language === "hinglish" ? "en-IN" : LANGUAGE_CONFIG[language].speech;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (UI_TRANSLATIONS[language][key]) element.textContent = UI_TRANSLATIONS[language][key];
    });
    document.querySelectorAll("[data-core]").forEach((element) => {
      const key = element.dataset.core;
      element.textContent = UI_CORE[language][key] || UI_CORE.en[key] || key;
    });
    document.querySelectorAll("[data-core-aria]").forEach((element) => {
      const key = element.dataset.coreAria;
      element.setAttribute("aria-label", UI_CORE[language][key] || UI_CORE.en[key] || key);
    });
    $(".memory-row").setAttribute("aria-label", UI_CORE[language].memory);
    $("#language-short").textContent = LANGUAGE_CONFIG[language].short;
    $("#mode-label").textContent = scientific ? `${uiText("scientific")} on` : uiText("scientific");
    $("#speech-toggle").setAttribute("aria-label", uiText("voiceAnswers"));
    $("#angle-toggle").title = `${UI_CORE[language].degrees} / ${UI_CORE[language].radians}`;
    $("#speak-result").title = UI_CORE[language].result;
    $("#interface-language").value = languagePreferences.interface;
    $("#input-language").value = languagePreferences.input;
    $("#output-language").value = languagePreferences.output;
    $("#auto-detect-toggle").checked = languagePreferences.autoDetect;
    $("#speech-toggle").setAttribute("aria-checked", String(speakFeedback));
    renderHistory();
  }
  function selectedRecognitionLocale() {
    if (languagePreferences.input === "auto") return languagePreferences.autoDetect ? "hi-IN" : "en-IN";
    return LANGUAGE_CONFIG[languagePreferences.input].speech;
  }
  function resultLanguage(raw) {
    if (languagePreferences.input === "auto" && languagePreferences.autoDetect) return detectVoiceLanguage(raw);
    if (languagePreferences.autoDetect) {
      const detected = detectVoiceLanguage(raw);
      if (detected !== "en" || languagePreferences.input === "en") return detected;
    }
    return languagePreferences.input === "auto" ? "en" : languagePreferences.input;
  }
  function setVoiceError(message, language = detectedVoiceLanguage) {
    $("#voice-title").textContent = "We didn't catch that";
    $("#voice-status").textContent = message || LANGUAGE_CONFIG[language].voiceError;
    $("#voice-retry").hidden = false;
    $("#mic-button").classList.remove("listening");
    $("#mic-button").setAttribute("aria-label", uiText("tryAgain"));
    isListening = false;
  }
  const HI_SPOKEN_NUMBERS = { 0: "शून्य", 1: "एक", 2: "दो", 3: "तीन", 4: "चार", 5: "पाँच", 6: "छह", 7: "सात", 8: "आठ", 9: "नौ", 10: "दस", 11: "ग्यारह", 12: "बारह", 13: "तेरह", 14: "चौदह", 15: "पंद्रह", 16: "सोलह", 17: "सत्रह", 18: "अठारह", 19: "उन्नीस", 20: "बीस", 25: "पच्चीस", 30: "तीस", 35: "पैंतीस", 40: "चालीस", 50: "पचास", 60: "साठ", 70: "सत्तर", 80: "अस्सी", 90: "नब्बे", 100: "सौ" };
  const HI_ROMAN_NUMBERS = { 0: "shunya", 1: "ek", 2: "do", 3: "teen", 4: "char", 5: "paanch", 6: "chhe", 7: "saat", 8: "aath", 9: "nau", 10: "das", 11: "gyarah", 12: "barah", 13: "terah", 14: "chaudah", 15: "pandrah", 16: "solah", 17: "satrah", 18: "atharah", 19: "unnis", 20: "bees", 25: "pachis", 30: "tees", 35: "paintis", 40: "chalis", 50: "pachaas", 60: "saath", 70: "sattar", 80: "assi", 90: "nabbe", 100: "sau" };
  function spokenNumber(value, language) {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric < 0 || numeric > 100) return value;
    if (language === "hi") return HI_SPOKEN_NUMBERS[numeric] || String(numeric);
    if (language === "hinglish") return HI_ROMAN_NUMBERS[numeric] || String(numeric);
    return value;
  }
  function speakAnswer(value) {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance !== "function") {
      setNote("Speech output is not supported by this browser");
      return;
    }
    const language = languagePreferences.output;
    const config = LANGUAGE_CONFIG[language];
    const response = VOICE_RESPONSES[language] || VOICE_RESPONSES.en;
    const saidValue = spokenNumber(value, language);
    const utterance = new SpeechSynthesisUtterance(`${response.prefix} ${saidValue} ${response.suffix}`);
    utterance.lang = config.speech;
    const voices = window.speechSynthesis.getVoices();
    const languagePrefix = config.speech.split("-")[0].toLowerCase();
    const voice = voices.find((candidate) => candidate.lang.toLowerCase() === config.speech.toLowerCase()) ||
      voices.find((candidate) => candidate.lang.toLowerCase().startsWith(`${languagePrefix}-`)) ||
      voices.find((candidate) => candidate.lang.toLowerCase().startsWith("en-")) || voices[0];
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  function launchRecognition(locale, allowEnglishFallback) {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new Recognition();
    recognition.lang = locale;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    let retryWithEnglish = false;
    let finalReceived = false;
    recognition.onstart = () => {
      isListening = true;
      $("#mic-button").classList.add("listening");
      $("#mic-button").setAttribute("aria-label", "Stop listening");
      $("#voice-title").textContent = uiText("listening");
      $("#voice-status").textContent = `${LANGUAGE_CONFIG[languagePreferences.input === "auto" ? "hi" : languagePreferences.input].label} · Say your calculation`;
      $("#voice-retry").hidden = true;
      $("#voice-transcript").hidden = true;
    };
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
        else interimText += event.results[i][0].transcript;
      }
      const heard = finalText || interimText;
      if (heard) {
        $("#voice-title").textContent = "I heard you say";
        $("#voice-status").textContent = heard;
      }
      if (!finalText) return;
      finalReceived = true;
      detectedVoiceLanguage = resultLanguage(finalText);
      $("#voice-transcript").hidden = false;
      $("#recognized-language").textContent = LANGUAGE_CONFIG[detectedVoiceLanguage].label;
      $("#transcript-text").textContent = finalText;
      try {
        const parsed = normalizeVoice(finalText);
        expression = parsed;
        renderDisplay();
        $("#voice-title").textContent = "Here's what I understood";
        $("#voice-status").textContent = displayExpression(parsed);
        calculate(parsed, { voice: true });
      } catch (error) {
        setVoiceError(LANGUAGE_CONFIG[detectedVoiceLanguage].voiceError, detectedVoiceLanguage);
        setError("Could not understand the calculation");
      }
      recognition.stop();
    };
    recognition.onerror = (event) => {
      if (allowEnglishFallback && !recognitionAttempt && ["language-not-supported", "no-speech"].includes(event.error)) {
        retryWithEnglish = true;
        return;
      }
      const language = languagePreferences.input === "auto" ? "en" : languagePreferences.input;
      const message = event.error === "not-allowed" || event.error === "service-not-allowed"
        ? "Microphone access is blocked. Allow it in your browser settings and try again."
        : event.error === "language-not-supported" ? LANGUAGE_CONFIG[language].unavailable
        : LANGUAGE_CONFIG[language].voiceError;
      setVoiceError(message, language);
    };
    recognition.onend = () => {
      isListening = false;
      $("#mic-button").classList.remove("listening");
      $("#mic-button").setAttribute("aria-label", "Start voice input");
      if (retryWithEnglish && !recognitionAttempt) {
        recognitionAttempt = 1;
        launchRecognition("en-IN", false);
      } else if (!finalReceived && $("#voice-title").textContent === uiText("listening")) {
        setVoiceError(LANGUAGE_CONFIG[languagePreferences.input === "auto" ? "en" : languagePreferences.input].voiceError);
      }
    };
    try {
      recognition.start();
    } catch (error) {
      if (allowEnglishFallback && !recognitionAttempt) {
        recognitionAttempt = 1;
        launchRecognition("en-IN", false);
      } else {
        setVoiceError(LANGUAGE_CONFIG[languagePreferences.input === "auto" ? "en" : languagePreferences.input].unavailable);
      }
    }
  }
  function startListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError("Voice recognition is not available here. Use a supported version of Chrome or Edge.");
      return;
    }
    if (isListening && recognition) { recognition.stop(); return; }
    recognitionAttempt = 0;
    const autoMode = languagePreferences.input === "auto";
    launchRecognition(selectedRecognitionLocale(), (autoMode && languagePreferences.autoDetect) || languagePreferences.input === "hinglish");
  }

  document.querySelectorAll(".key").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.action === "clear") clear();
    else if (button.dataset.action === "backspace") backspace();
    else if (button.dataset.action === "equals") calculate();
    else if (button.dataset.action === "sign") toggleSign();
    else if (button.dataset.insert) insert(button.dataset.insert);
  }));
  document.querySelectorAll(".memory-button").forEach((button) => button.addEventListener("click", () => memoryAction(button.dataset.action)));
  $("#mode-toggle").addEventListener("click", () => {
    scientific = !scientific;
    document.body.classList.toggle("scientific-mode", scientific);
    $("#mode-toggle").setAttribute("aria-pressed", String(scientific));
    $("#mode-label").textContent = scientific ? `${uiText("scientific")} on` : uiText("scientific");
  });
  $("#angle-toggle").addEventListener("click", () => {
    angleUnit = angleUnit === "DEG" ? "RAD" : "DEG";
    $("#angle-toggle").textContent = angleUnit;
    setNote(`Angle mode: ${angleUnit}`);
  });
  $("#mic-button").addEventListener("click", startListening);
  $("#voice-retry").addEventListener("click", startListening);
  $("#speak-result").addEventListener("click", () => {
    try { speakAnswer(formatNumber(currentValue())); }
    catch (error) { setNote("Calculate a result first"); }
  });
  $("#speech-toggle").addEventListener("click", (event) => {
    speakFeedback = event.currentTarget.getAttribute("aria-checked") !== "true";
    event.currentTarget.setAttribute("aria-checked", String(speakFeedback));
    languagePreferences.voiceOutput = speakFeedback;
    saveLanguagePreferences();
    try { localStorage.setItem(STORAGE.feedback, String(speakFeedback)); }
    catch (error) { console.warn("Could not save voice output preference.", error); }
  });
  $("#language-button").addEventListener("click", () => {
    const panel = $("#language-panel");
    panel.hidden = !panel.hidden;
    $("#language-button").setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) $("#interface-language").focus();
  });
  $("#language-close").addEventListener("click", () => {
    $("#language-panel").hidden = true;
    $("#language-button").setAttribute("aria-expanded", "false");
    $("#language-button").focus();
  });
  $("#interface-language").addEventListener("change", (event) => {
    languagePreferences.interface = event.currentTarget.value;
    saveLanguagePreferences();
    applyInterfaceLanguage();
  });
  $("#input-language").addEventListener("change", (event) => {
    languagePreferences.input = event.currentTarget.value;
    saveLanguagePreferences();
  });
  $("#output-language").addEventListener("change", (event) => {
    languagePreferences.output = event.currentTarget.value;
    saveLanguagePreferences();
  });
  $("#auto-detect-toggle").addEventListener("change", (event) => {
    languagePreferences.autoDetect = event.currentTarget.checked;
    saveLanguagePreferences();
  });
  document.addEventListener("click", (event) => {
    const panel = $("#language-panel");
    if (!panel.hidden && !event.target.closest(".language-control")) {
      panel.hidden = true;
      $("#language-button").setAttribute("aria-expanded", "false");
    }
  });
  $("#clear-history").addEventListener("click", () => {
    history = [];
    saveHistory();
    renderHistory();
    setNote("History cleared");
  });
  $("#theme-toggle").addEventListener("click", () => {
    const light = document.body.classList.toggle("light-theme");
    localStorage.setItem(STORAGE.theme, light ? "light" : "dark");
    $("#theme-icon").textContent = light ? "☾" : "☼";
    $("#theme-toggle").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  });
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^\d$/.test(event.key) || ["+", "-", "*", "/", ".", "(", ")", "%", "^"].includes(event.key)) {
      event.preventDefault();
      insert(event.key === "*" ? "×" : event.key === "/" ? "÷" : event.key === "-" ? "−" : event.key);
    } else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
    else if (event.key === "Backspace") { event.preventDefault(); backspace(); }
    else if (event.key === "Escape") {
      if (!$("#language-panel").hidden) {
        event.preventDefault();
        $("#language-panel").hidden = true;
        $("#language-button").setAttribute("aria-expanded", "false");
      } else { event.preventDefault(); clear(); }
    }
  });

  if (localStorage.getItem(STORAGE.theme) === "light") {
    document.body.classList.add("light-theme");
    $("#theme-icon").textContent = "☾";
    $("#theme-toggle").setAttribute("aria-label", "Switch to dark theme");
  }
  applyInterfaceLanguage();
  $("#language-button").setAttribute("aria-expanded", "false");
  renderHistory();
  renderDisplay();
})();
