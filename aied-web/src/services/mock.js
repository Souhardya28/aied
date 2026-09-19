// Demo data so the MVP runs end-to-end without a backend or API key.
const EN = [
  [0, "Today we study electromagnetic induction — how a changing magnetic field produces an electric current."],
  [9, "Michael Faraday observed that when a magnet moves towards a coil, the galvanometer needle deflects."],
  [19, "When the magnet stops moving, the deflection drops to zero. So the field must change, not just exist."],
  [29, "The quantity that matters is magnetic flux: phi equals B times A times cos theta."],
  [39, "Faraday's law says the induced EMF equals the negative rate of change of flux: e equals minus d phi by d t."],
  [51, "For a coil with N turns, the EMF becomes N times larger: e equals minus N d phi by d t."],
  [61, "The minus sign is Lenz's law. The induced current always opposes the change that produced it."],
  [72, "Example: flux through a 100-turn coil falls from 0.5 to 0.1 weber in 0.2 seconds."],
  [82, "EMF equals 100 times 0.4 divided by 0.2, which gives 200 volts."],
  [92, "Next class, we apply this to self inductance and AC generators."],
];
const AS = [
  "আজি আমি বিদ্যুৎচুম্বকীয় আৱেশ (electromagnetic induction) পঢ়িম — সলনি হৈ থকা চুম্বকীয় ক্ষেত্ৰই কেনেকৈ বিদ্যুৎ প্ৰবাহ সৃষ্টি কৰে।",
  "মাইকেল ফাৰাডেই দেখিছিল যে চুম্বক এটা কুণ্ডলীৰ ফালে নিলে গেলভেনমিটাৰৰ কাঁটা লৰে।",
  "চুম্বকটো ৰখালে কাঁটা শূন্যলৈ উভতি আহে। গতিকে ক্ষেত্ৰখন থাকিলেই নহয়, সলনি হ'ব লাগিব।",
  "গুৰুত্বপূৰ্ণ ৰাশিটো হ'ল চুম্বকীয় ফ্লাক্স (magnetic flux): φ = B·A·cosθ।",
  "ফাৰাডেৰ সূত্ৰ অনুসৰি আৱিষ্ট EMF হ'ল ফ্লাক্সৰ পৰিৱৰ্তনৰ হাৰৰ ঋণাত্মক: e = −dφ/dt।",
  "N টা পাকৰ কুণ্ডলীৰ বাবে EMF N গুণ বাঢ়ে: e = −N dφ/dt।",
  "ঋণাত্মক চিনটো লেঞ্জৰ সূত্ৰ (Lenz's law)। আৱিষ্ট প্ৰবাহে সদায় ইয়াক সৃষ্টি কৰা পৰিৱৰ্তনৰ বিৰোধিতা কৰে।",
  "উদাহৰণ: 100 পাকৰ কুণ্ডলী এটাৰ মাজেৰে ফ্লাক্স 0.2 ছেকেণ্ডত 0.5 ৰ পৰা 0.1 ৱেবাৰলৈ কমে।",
  "EMF = 100 × 0.4 ÷ 0.2 = 200 ভল্ট।",
  "পিছৰ শ্ৰেণীত আমি ইয়াক স্ব-আৱেশ আৰু AC জেনেৰেটৰত প্ৰয়োগ কৰিম।",
];
const BN = [
  "আজ আমরা তড়িৎচুম্বকীয় আবেশ (electromagnetic induction) পড়ব — পরিবর্তনশীল চৌম্বক ক্ষেত্র কীভাবে তড়িৎ প্রবাহ তৈরি করে।",
  "মাইকেল ফ্যারাডে দেখেছিলেন, চুম্বক কুণ্ডলীর দিকে সরালে গ্যালভানোমিটারের কাঁটা নড়ে।",
  "চুম্বক থামালে কাঁটা শূন্যে ফিরে আসে। অর্থাৎ ক্ষেত্র শুধু থাকলে হবে না, তাকে বদলাতে হবে।",
  "গুরুত্বপূর্ণ রাশি হলো চৌম্বক ফ্লাক্স (magnetic flux): φ = B·A·cosθ।",
  "ফ্যারাডের সূত্র অনুযায়ী আবিষ্ট EMF হলো ফ্লাক্স পরিবর্তনের হারের ঋণাত্মক: e = −dφ/dt।",
  "N পাকের কুণ্ডলীতে EMF N গুণ হয়: e = −N dφ/dt।",
  "ঋণাত্মক চিহ্নটি লেঞ্জের সূত্র (Lenz's law)। আবিষ্ট প্রবাহ সবসময় তার সৃষ্টিকারী পরিবর্তনের বিরোধিতা করে।",
  "উদাহরণ: 100 পাকের কুণ্ডলীর মধ্য দিয়ে ফ্লাক্স 0.2 সেকেন্ডে 0.5 থেকে 0.1 ওয়েবারে নামে।",
  "EMF = 100 × 0.4 ÷ 0.2 = 200 ভোল্ট।",
  "পরের ক্লাসে আমরা এটি স্ব-আবেশ ও AC জেনারেটরে প্রয়োগ করব।",
];
const HI = [
  "आज हम विद्युतचुंबकीय प्रेरण (electromagnetic induction) पढ़ेंगे — बदलता चुंबकीय क्षेत्र विद्युत धारा कैसे पैदा करता है।",
  "माइकल फैराडे ने देखा कि चुंबक को कुंडली की ओर ले जाने पर गैल्वेनोमीटर की सुई हिलती है।",
  "चुंबक रुकते ही विक्षेप शून्य हो जाता है। यानी क्षेत्र का होना काफ़ी नहीं, उसका बदलना ज़रूरी है।",
  "महत्वपूर्ण राशि है चुंबकीय फ्लक्स (magnetic flux): φ = B·A·cosθ।",
  "फैराडे के नियम के अनुसार प्रेरित EMF फ्लक्स परिवर्तन की दर का ऋणात्मक है: e = −dφ/dt।",
  "N फेरों वाली कुंडली में EMF N गुना हो जाता है: e = −N dφ/dt।",
  "ऋणात्मक चिह्न लेंज़ का नियम (Lenz's law) है। प्रेरित धारा हमेशा उस परिवर्तन का विरोध करती है जिससे वह बनी।",
  "उदाहरण: 100 फेरों वाली कुंडली से फ्लक्स 0.2 सेकंड में 0.5 से 0.1 वेबर हो जाता है।",
  "EMF = 100 × 0.4 ÷ 0.2 = 200 वोल्ट।",
  "अगली कक्षा में हम इसे स्व-प्रेरण और AC जनरेटर पर लागू करेंगे।",
];

const seg = (texts) => EN.map(([start], i) => ({ start, text: texts[i] }));
export const SAMPLE_LECTURE = {
  id: 'demo-emi',
  title: "Faraday's law & Lenz's law — Class 12 Physics",
  url: null,
  duration: 102,
  transcript: EN.map(([start, text]) => ({ start, text })),
  translations: { as: seg(AS), bn: seg(BN), hi: seg(HI) },
};

export function demoDoubtAnswer(question, segments) {
  const q = question.toLowerCase();
  const words = q.split(/\W+/).filter((w) => w.length > 3);
  const hits = SAMPLE_LECTURE.transcript
    .map((s, i) => ({ ...s, i, score: words.filter((w) => s.text.toLowerCase().includes(w)).length }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.start - b.start);
  const ts = (t) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  if (!hits.length) {
    return {
      grounded: false,
      sources: [],
      answer: "This lecture doesn't cover that directly. From general physics: try breaking the question into what changes (B, A or θ) and apply e = −N dφ/dt. Ask your teacher to confirm, or connect the Gemini backend for a full answer.",
    };
  }
  const lines = hits.map((h) => `[${ts(h.start)}] ${segments[h.i]?.text ?? h.text}`);
  const steps = /emf|volt|calculat|example|200|numer/.test(q)
    ? '\n\nStep by step:\n1. Change in flux Δφ = 0.5 − 0.1 = 0.4 Wb\n2. Time Δt = 0.2 s\n3. e = N·Δφ/Δt = 100 × 0.4 / 0.2 = 200 V'
    : '';
  return {
    grounded: true,
    sources: hits.map(({ start, text }) => ({ start, text })),
    answer: `Here's what the lecture says:\n\n${lines.join('\n')}${steps}`,
  };
}

export const DEMO_DASHBOARD = [
  { subject: 'Physics', total: 12, done: 7, minutes: 540, weak: ['Lenz\'s law', 'Lens maker\'s formula'] },
  { subject: 'Chemistry', total: 6, done: 4, minutes: 310, weak: ['Nernst equation'] },
  { subject: 'Mathematics', total: 6, done: 2, minutes: 260, weak: ['Bayes\' theorem', 'Definite integrals'] },
  { subject: 'Biology', total: 4, done: 3, minutes: 190, weak: [] },
];

export const DEMO_WEEK = [
  { day: 'Mon', minutes: 45 }, { day: 'Tue', minutes: 70 }, { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 85 }, { day: 'Fri', minutes: 60 }, { day: 'Sat', minutes: 110 }, { day: 'Sun', minutes: 40 },
];

export const DEMO_RECS = [
  { topic: "Lenz's law", subject: 'Physics', chapter: 'Electromagnetic Induction', minutes: 14, reason: 'Scored 40% in last test' },
  { topic: 'Self inductance', subject: 'Physics', chapter: 'Electromagnetic Induction', minutes: 18, reason: 'Not started · high weightage' },
  { topic: "Bayes' theorem", subject: 'Mathematics', chapter: 'Probability', minutes: 22, reason: 'Not started' },
];

export const DEMO_SYLLABUS = {
  Physics: {
    'Electrostatics': [['Coulomb\'s law', 'done'], ['Electric field lines', 'done'], ['Gauss\'s law', 'done']],
    'Current Electricity': [['Ohm\'s law', 'done'], ['Kirchhoff\'s rules', 'done'], ['Wheatstone bridge', 'in_progress']],
    'Electromagnetic Induction': [['Faraday\'s law', 'done'], ['Lenz\'s law', 'in_progress'], ['Self inductance', 'not_started']],
    'Ray Optics': [['Refraction at spherical surfaces', 'done'], ['Lens maker\'s formula', 'not_started'], ['Total internal reflection', 'not_started']],
  },
  Chemistry: {
    'Solutions': [['Raoult\'s law', 'done'], ['Colligative properties', 'done']],
    'Electrochemistry': [['Nernst equation', 'in_progress'], ['Conductance', 'done']],
    'Chemical Kinetics': [['Rate law', 'done'], ['Arrhenius equation', 'not_started']],
  },
  Mathematics: {
    'Matrices': [['Matrix operations', 'done'], ['Inverse by elementary operations', 'done']],
    'Integrals': [['Integration by parts', 'in_progress'], ['Definite integrals', 'not_started']],
    'Probability': [['Conditional probability', 'not_started'], ['Bayes\' theorem', 'not_started']],
  },
  Biology: {
    'Genetics': [['Mendel\'s laws', 'done'], ['Chromosomal theory', 'done']],
    'Human Reproduction': [['Gametogenesis', 'done'], ['Menstrual cycle', 'not_started']],
  },
};

const BANK = {
  Physics: [
    { type: 'mcq', topic: "Faraday's law", difficulty: 2, prompt: 'A 50-turn coil sees flux change by 0.02 Wb in 0.1 s. The induced EMF is:', options: ['1 V', '10 V', '0.1 V', '100 V'], answer: '10 V', explanation: 'e = NΔφ/Δt = 50 × 0.02 / 0.1 = 10 V.' },
    { type: 'mcq', topic: "Lenz's law", difficulty: 2, prompt: "Lenz's law is a consequence of conservation of:", options: ['Charge', 'Momentum', 'Energy', 'Mass'], answer: 'Energy', explanation: 'If the induced current aided the change, energy would be created from nothing.' },
    { type: 'mcq', topic: 'Magnetic flux', difficulty: 1, prompt: 'The SI unit of magnetic flux is:', options: ['Tesla', 'Weber', 'Henry', 'Gauss'], answer: 'Weber', explanation: '1 Wb = 1 T·m².' },
    { type: 'mcq', topic: 'Magnetic flux', difficulty: 2, prompt: 'Flux through a loop is zero when the angle between B and the area vector is:', options: ['0°', '45°', '90°', '180°'], answer: '90°', explanation: 'φ = BA cosθ and cos 90° = 0.' },
    { type: 'short', topic: "Lenz's law", difficulty: 3, prompt: 'A bar magnet is dropped through a copper ring. Why does it fall slower than g?', answer: 'Induced currents in the ring oppose the motion of the magnet (Lenz\'s law), producing an upward magnetic force.', explanation: 'The changing flux induces an eddy current whose field repels the approaching pole and attracts the leaving pole.' },
  ],
  Chemistry: [
    { type: 'mcq', topic: "Raoult's law", difficulty: 2, prompt: 'Relative lowering of vapour pressure equals the mole fraction of the:', options: ['Solvent', 'Solute', 'Mixture', 'Vapour'], answer: 'Solute', explanation: '(p° − p)/p° = x₂, the solute mole fraction.' },
    { type: 'mcq', topic: 'Chemical Kinetics', difficulty: 2, prompt: 'Unit of the rate constant for a first-order reaction:', options: ['mol L⁻¹ s⁻¹', 's⁻¹', 'L mol⁻¹ s⁻¹', 'mol s⁻¹'], answer: 's⁻¹', explanation: 'k = rate / [A], so the concentration units cancel.' },
    { type: 'mcq', topic: 'Nernst equation', difficulty: 3, prompt: 'At 298 K, the factor 2.303RT/F is approximately:', options: ['0.0591 V', '0.591 V', '8.314 V', '0.0296 V'], answer: '0.0591 V', explanation: '2.303 × 8.314 × 298 / 96500 ≈ 0.0591 V.' },
  ],
  Mathematics: [
    { type: 'mcq', topic: "Bayes' theorem", difficulty: 3, prompt: 'Bag A has 2 red, 3 black; bag B has 4 red, 1 black. A bag is picked at random and a red ball drawn. P(bag B)?', options: ['2/3', '1/2', '4/5', '1/3'], answer: '2/3', explanation: 'P(B|R) = (½·⅘)/(½·⅖ + ½·⅘) = 0.4/0.6 = 2/3.' },
    { type: 'mcq', topic: 'Definite integrals', difficulty: 2, prompt: '∫₀¹ x² dx equals:', options: ['1/2', '1/3', '1', '2/3'], answer: '1/3', explanation: '[x³/3]₀¹ = 1/3.' },
    { type: 'mcq', topic: 'Matrices', difficulty: 1, prompt: 'If A is 2×3 and B is 3×4, AB is of order:', options: ['3×3', '2×4', '4×2', 'Not defined'], answer: '2×4', explanation: 'Rows of A × columns of B.' },
  ],
};
export const demoTest = (subject) => BANK[subject] || BANK.Physics;

export const DEMO_PYQ = {
  Physics: {
    chapters: [
      { chapter: 'Electromagnetic Induction', weightage: 22, frequency: 14, yourScore: 48 },
      { chapter: 'Ray Optics', weightage: 18, frequency: 12, yourScore: 55 },
      { chapter: 'Electrostatics', weightage: 16, frequency: 11, yourScore: 78 },
      { chapter: 'Current Electricity', weightage: 14, frequency: 9, yourScore: 72 },
      { chapter: 'Semiconductors', weightage: 12, frequency: 8, yourScore: 66 },
      { chapter: 'Modern Physics', weightage: 10, frequency: 7, yourScore: 81 },
    ],
    trend: [
      { year: '2020', EMI: 18, Optics: 20, Electrostatics: 15 },
      { year: '2021', EMI: 20, Optics: 17, Electrostatics: 16 },
      { year: '2022', EMI: 22, Optics: 18, Electrostatics: 14 },
      { year: '2023', EMI: 24, Optics: 19, Electrostatics: 17 },
      { year: '2024', EMI: 25, Optics: 16, Electrostatics: 18 },
    ],
  },
  Chemistry: {
    chapters: [
      { chapter: 'Electrochemistry', weightage: 20, frequency: 13, yourScore: 52 },
      { chapter: 'Chemical Kinetics', weightage: 17, frequency: 11, yourScore: 70 },
      { chapter: 'Solutions', weightage: 15, frequency: 10, yourScore: 83 },
      { chapter: 'Coordination Compounds', weightage: 14, frequency: 9, yourScore: 45 },
    ],
    trend: [
      { year: '2020', EMI: 17, Optics: 16, Electrostatics: 15 },
      { year: '2021', EMI: 19, Optics: 18, Electrostatics: 14 },
      { year: '2022', EMI: 20, Optics: 17, Electrostatics: 16 },
      { year: '2023', EMI: 21, Optics: 16, Electrostatics: 15 },
      { year: '2024', EMI: 20, Optics: 18, Electrostatics: 15 },
    ],
    labels: { EMI: 'Electrochemistry', Optics: 'Kinetics', Electrostatics: 'Solutions' },
  },
};

export function demoCareerReply(text, profile) {
  const t = text.toLowerCase();
  if (/engineer|jee|b\.?tech|coding|computer/.test(t)) {
    return `With Physics at ${profile.physics}% and Maths at ${profile.maths}%, engineering is realistic, but Maths needs work first.\n\n• Exam: JEE Main (January and April sessions of class 12). Assam CEE is a good state backup.\n• Colleges in reach: NIT Silchar, IIIT Guwahati, Assam Engineering College, Jorhat Engineering College.\n• What to study next: Probability and Definite integrals are both untouched and appear every year. I've flagged them on your dashboard.`;
  }
  if (/doctor|neet|mbbs|medic|biology/.test(t)) {
    return 'Biology is your strongest subject (75% of topics done). For medicine:\n\n• Exam: NEET-UG, held every May.\n• Colleges: Gauhati Medical College, AIIMS Guwahati, Assam Medical College.\n• What to study next: Human Reproduction still has one chapter left, and Chemistry\'s Electrochemistry is a weak spot NEET tests often.';
  }
  if (/research|science|iiser|scientist|physics/.test(t)) {
    return 'If you enjoy understanding why things work, a BS-MS in the sciences fits well.\n\n• Exams: IISER Aptitude Test (IAT) and NEST, both around June.\n• Colleges: IISER Kolkata, NISER Bhubaneswar, IISc Bengaluru, Tezpur University.\n• What to study next: these exams reward concept depth, so finish Electromagnetic Induction properly before moving on.';
  }
  return `Tell me a bit more so I can be specific. For example:\n\n• "I like computers — is engineering right for me?"\n• "What are my options if I want to become a doctor?"\n• "Which careers use both Maths and Biology?"\n\nI already know you're in class ${profile.class}, ${profile.stream} stream.`;
}
