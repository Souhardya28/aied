export const LANGUAGES = [
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', speech: 'as-IN', fromLecture: 'এই ক্লাছৰ পৰা', genKnowledge: 'সাধাৰণ জ্ঞান — এই ক্লাছত নাই' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', speech: 'bn-IN', fromLecture: 'এই ক্লাস থেকে', genKnowledge: 'সাধারণ জ্ঞান — এই ক্লাসে নেই' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speech: 'hi-IN', fromLecture: 'इस क्लास से', genKnowledge: 'सामान्य ज्ञान — इस क्लास में नहीं' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', speech: 'ta-IN', fromLecture: 'இந்த வகுப்பிலிருந்து', genKnowledge: 'பொது அறிவு — இந்த வகுப்பில் இல்லை' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', speech: 'te-IN', fromLecture: 'ఈ క్లాస్ నుండి', genKnowledge: 'సాధారణ జ్ఞానం — ఈ క్లాస్‌లో లేదు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', speech: 'mr-IN', fromLecture: 'या क्लासमधून', genKnowledge: 'सामान्य ज्ञान — या क्लासमध्ये नाही' },
  { code: 'en', name: 'English', native: 'English', speech: 'en-IN', fromLecture: 'From this lecture', genKnowledge: 'General knowledge — not in this lecture' },
];
export const langByCode = (c) => LANGUAGES.find((l) => l.code === c) || LANGUAGES[0];
