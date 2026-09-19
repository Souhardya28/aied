export const LANGUAGES = [
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', speech: 'as-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', speech: 'bn-IN' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', speech: 'hi-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', speech: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', speech: 'te-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', speech: 'mr-IN' },
  { code: 'en', name: 'English', native: 'English', speech: 'en-IN' },
];
export const langByCode = (c) => LANGUAGES.find((l) => l.code === c) || LANGUAGES[0];
