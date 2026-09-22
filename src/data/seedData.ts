import { Card, Deck, AgeBand } from '@/types/game';
import { scenarios_4_6 } from './scenarios-4-6';
import { scenarios_7_9 } from './scenarios-7-9';
import { scenarios_10plus } from './scenarios-10plus';
import { scenarios_teens } from './scenarios-teens';
import { handAuthoredCards } from './handAuthored';

export const decks: Deck[] = [
  // ── 4-6 age band ──
  { id: 'body-boundaries-4-6', slug: 'body-boundaries-4-6', name: 'Body Boundaries (4–6)', description: 'Learn about your body, safe and unsafe touches, and saying no.', age_band: '4-6', tags: ['consent', 'body-safety'], is_default: true, is_free: true, card_count: 0, icon: '🛡️', color: 'primary' },
  { id: 'trusted-adults-4-6', slug: 'trusted-adults-4-6', name: 'Trusted Adults (4–6)', description: 'Know who to turn to and how to stay safe with strangers.', age_band: '4-6', tags: ['stranger-safety'], is_default: true, is_free: true, card_count: 0, icon: '🏠', color: 'safe' },
  { id: 'secrets-4-6', slug: 'secrets-4-6', name: 'Safe & Unsafe Secrets (4–6)', description: 'Learn the difference between surprises and secrets that should be told.', age_band: '4-6', tags: ['body-safety', 'secrets'], is_default: true, is_free: true, card_count: 0, icon: '🤫', color: 'caution' },
  { id: 'body-boundaries', slug: 'body-boundaries', name: 'Body Boundaries & Consent', description: 'Learn about personal space, safe and unsafe touches, and how to speak up.', age_band: '4-6', tags: ['boundaries', 'consent'], is_default: true, is_free: true, card_count: 4, icon: '🛡️', color: 'primary' },
  { id: 'trusted-adults', slug: 'trusted-adults', name: 'Trusted Adults & Safe Places', description: 'Know who to turn to and where to go when you need help.', age_band: '4-6', tags: ['trusted adults', 'safe places'], is_default: true, is_free: true, card_count: 4, icon: '🏠', color: 'safe' },
  // ── 7-9 age band ──
  { id: 'peer-pressure-7-9', slug: 'peer-pressure-7-9', name: 'Peer Pressure (7–9)', description: 'Handle dares, vapes, and pressure from friends.', age_band: '7-9', tags: ['peer-pressure', 'substance-risk'], is_default: true, is_free: true, card_count: 0, icon: '🫸', color: 'caution' },
  { id: 'digital-safety-7-9', slug: 'digital-safety-7-9', name: 'Digital Safety (7–9)', description: 'Stay safe from strangers and scams online.', age_band: '7-9', tags: ['online-safety'], is_default: true, is_free: true, card_count: 0, icon: '💻', color: 'help' },
  { id: 'online-safety', slug: 'online-safety', name: 'Online & Device Safety', description: 'Stay safe while using phones, tablets, and the internet.', age_band: '7-9', tags: ['online safety', 'devices'], is_default: true, is_free: true, card_count: 4, icon: '📱', color: 'help' },
  { id: 'bullying', slug: 'bullying', name: 'Bullying & Peer Pressure', description: 'Handle tough social situations and stand up for yourself and others.', age_band: '7-9', tags: ['bullying', 'peer pressure'], is_default: true, is_free: true, card_count: 4, icon: '💪', color: 'secondary' },
  // ── 10+ age band ──
  { id: 'emergencies', slug: 'emergencies', name: 'Emergencies & Getting Help', description: 'Learn what to do in scary or dangerous situations.', age_band: '10+', tags: ['emergencies', 'help'], is_default: true, is_free: true, card_count: 4, icon: '🚨', color: 'caution' },
  { id: 'grooming-awareness-10plus', slug: 'grooming-awareness-10plus', name: 'Grooming Awareness (10+)', description: 'Recognize manipulation tactics, boundary violations, and unsafe adult behavior.', age_band: '10+', tags: ['grooming', 'boundaries'], is_default: true, is_free: true, card_count: 0, icon: '🔍', color: 'primary' },
  { id: 'street-smarts-10plus', slug: 'street-smarts-10plus', name: 'Street Smarts (10+)', description: 'Navigate real-world situations with confidence and good judgment.', age_band: '10+', tags: ['awareness', 'judgment'], is_default: true, is_free: true, card_count: 0, icon: '🧠', color: 'help' },
  // ── Teens age band ──
  { id: 'real-world-judgment-teens', slug: 'real-world-judgment-teens', name: 'Real-World Judgment (Teens)', description: 'Navigate adult-ish situations with confidence and common sense.', age_band: 'teens', tags: ['judgment', 'digital-awareness'], is_default: true, is_free: true, card_count: 0, icon: '🧭', color: 'gentle' },
];

/* ─── Helper constants & functions ─── */

const DECKS = {
  BODY_4_6: 'body-boundaries-4-6',
  TRUSTED_4_6: 'trusted-adults-4-6',
  SECRETS_4_6: 'secrets-4-6',
  PEER_7_9: 'peer-pressure-7-9',
  DIGITAL_7_9: 'digital-safety-7-9',
  GROOMING_10PLUS: 'grooming-awareness-10plus',
  STREET_10PLUS: 'street-smarts-10plus',
  JUDGMENT_TEENS: 'real-world-judgment-teens',
} as const;

const normalize = (s: string) =>
  s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2019]/g, "'").replace(/\s*What would you do\?\s*$/i, '').replace(/\s*Here's the Sitch\.\.\s*/i, '').trim();

const makeTitle = (scenario: string) => {
  const clean = scenario.replace(/[".]/g, '').trim();
  const first = clean.split(/[.!?–—]/)[0].trim();
  const short = first.length <= 50 ? first : first.slice(0, 50).replace(/\s+\S*$/, '') + '…';
  return short;
};

const tagsFor = (s0: string) => {
  const s = s0.toLowerCase();
  const tags = new Set<string>();
  const addIf = (needle: string, tag: string) => { if (s.includes(needle)) tags.add(tag); };
  addIf('online', 'online-safety'); addIf('text', 'cyberbullying'); addIf('phone', 'digital-media');
  addIf('picture', 'digital-media'); addIf('social media', 'digital-boundaries');
  addIf('secret', 'secrets'); addIf('hug', 'consent'); addIf('lap', 'consent');
  addIf('tickle', 'consent'); addIf('touch', 'body-safety'); addIf('private parts', 'body-safety');
  addIf('doctor', 'body-safety'); addIf('weapon', 'weapons'); addIf('drugs', 'substances');
  addIf('vape', 'substances'); addIf('alcohol', 'substances'); addIf('drunk', 'substances');
  addIf('party', 'party-safety'); addIf('bull', 'bullying'); addIf('mean', 'bullying');
  addIf('cheat', 'integrity'); addIf('steal', 'integrity'); addIf('shoplift', 'integrity');
  addIf('run away', 'runaway'); addIf('fighting', 'home-conflict'); addIf('yell', 'fear');
  addIf('unconscious', 'medical-emergency'); addIf('hurt', 'harm');
  addIf('end their life', 'suicide-risk'); addIf('want to die', 'suicide-risk');
  addIf('self-harm', 'self-harm'); addIf('abused', 'abuse'); addIf('assault', 'assault');
  addIf('harassed', 'harassment'); addIf('pregnant', 'pregnancy');
  addIf('follow', 'stranger-safety'); addIf('car', 'stranger-safety');
  addIf('lost', 'lost'); addIf('animal', 'animal-safety');
  addIf('nude', 'exploitation'); addIf('photo', 'digital-media'); addIf('isolat', 'grooming');
  addIf('mature', 'grooming'); addIf('favorite', 'grooming'); addIf('special', 'grooming');
  addIf('pressure', 'peer-pressure'); addIf('weed', 'substances'); addIf('smok', 'substances');
  addIf('package', 'suspicious-activity'); addIf('instinct', 'intuition'); addIf('uh-oh', 'intuition');
  addIf('boundary', 'boundaries'); addIf('sleepover', 'sleepover-safety');
  if (s.includes('grown-up') || s.includes('teacher') || s.includes('coach')) tags.add('trusted-adults');
  if (s.includes('friend')) tags.add('friends');
  if (tags.size === 0) tags.add('common-sense');
  return Array.from(tags);
};

const difficultyFor = (s0: string): 1 | 2 | 3 => {
  const s = s0.toLowerCase();
  if (s.includes('private parts') || s.includes('take off clothes') || s.includes('naked') ||
      s.includes('sexual') || s.includes('weapon') || s.includes('drugs') ||
      s.includes('unconscious') || s.includes('end their life') || s.includes('want to die') ||
      s.includes('self-harm') || s.includes('abused') || s.includes("put something in another person's drink") ||
      s.includes('nude') || s.includes('weed') || s.includes('smok')) return 3;
  if (s.includes('threat') || s.includes('follow') || s.includes('alone') || s.includes('room') ||
      s.includes('car') || s.includes('run away') || s.includes('vape') || s.includes('alcohol') ||
      s.includes('drunk') || s.includes('bully') || s.includes('mean') || s.includes('fight') ||
      s.includes('hit') || s.includes('isolat') || s.includes('pressure') || s.includes('boundary') ||
      s.includes('sleepover') || s.includes('package')) return 2;
  return 1;
};

const guidanceFor = (s0: string) => {
  const s = s0.toLowerCase();
  if (s.includes('private parts') || s.includes('take off clothes') || s.includes('doctor') || s.includes('bottom'))
    return 'If anyone asks to see or touch private parts or play a clothes-off game, say NO, get away, and tell a trusted adult immediately.';
  if (s.includes('nude') || s.includes('personal pic'))
    return 'Never send nude or personal photos. Screenshot the request, block the person, and tell a trusted adult immediately.';
  if (s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle') || s.includes('boundary'))
    return 'You can say no to any touch you don\'t want. Move away and tell a trusted adult if it continues.';
  if (s.includes('secret') || s.includes('private') || s.includes('just between'))
    return 'If a secret makes you feel yucky, scared, or worried, tell a trusted adult. You\'re not in trouble for telling.';
  if (s.includes('grooming') || s.includes('mature') || s.includes('favorite') || s.includes('special treatment') || s.includes('isolat'))
    return 'Adults who single you out, flatter you excessively, or try to isolate you may be grooming. Tell a trusted adult.';
  if (s.includes('candy') || s.includes('finding their dog') || s.includes('car') || s.includes('meet you in person') || s.includes('mall'))
    return 'Don\'t go anywhere alone with someone you don\'t know or feel unsure about. Go to your safe adult.';
  if (s.includes('online') || s.includes('texts') || s.includes('picture') || s.includes('group chat') || s.includes('social media') || s.includes('hack') || s.includes('message'))
    return 'Protect your privacy online. Don\'t share personal info, don\'t forward harmful content, and tell a trusted adult.';
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills') || s.includes('weed') || s.includes('smok'))
    return 'Say no and get away from substances. If you feel pressured, find a trusted adult and leave the situation.';
  if (s.includes('weapon'))
    return 'Get to safety and tell a trusted adult immediately. Do not confront the person.';
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return 'This is an emergency. Tell a trusted adult right away. If there is immediate danger, call emergency services.';
  if (s.includes('bully') || s.includes('mean name') || s.includes('makes fun') || s.includes('mean texts'))
    return 'You don\'t deserve bullying. Get support: move to safety, tell an adult, and keep evidence if it\'s online.';
  if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find") || s.includes('classroom'))
    return 'Stop, stay in a safe public place, and ask a safe adult (employee/teacher) for help.';
  if (s.includes('sleepover'))
    return 'Trust your instincts at sleepovers. If anything feels wrong, call your parent — you can always go home.';
  if (s.includes('instinct') || s.includes('uh-oh') || s.includes('gut'))
    return 'Your instincts are a built-in alarm system. If something feels wrong, trust that feeling, leave, and get help.';
  if (s.includes('lie') || s.includes('lying'))
    return 'Real friends don\'t ask you to lie about important things. Being honest keeps everyone safer.';
  if (s.includes('package'))
    return 'Never hold or hide things for others in secret. If someone asks you to, tell a trusted adult.';
  if (s.includes('run away'))
    return 'Running away puts you in danger. Talk to a trusted adult who can help with the real problem.';
  if (s.includes('follow') || s.includes('truck') || s.includes('watching'))
    return 'If you feel followed, go to a crowded place or trusted adult immediately. Don\'t confront the person.';
  if (s.includes('bathroom') || s.includes('uncomfortable'))
    return 'Leave any situation that makes you uncomfortable. Your safety is more important than being polite.';
  return 'Choose the safest next step: stay calm, use your voice, and involve a trusted adult when you need help.';
};

const whyFor = (s0: string) => {
  const s = s0.toLowerCase();
  if (s.includes('private parts') || s.includes('take off clothes') || s.includes('doctor') || s.includes('bottom') || s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle'))
    return 'Your body belongs to you. Safe adults respect boundaries and never ask for secret body games.';
  if (s.includes('nude') || s.includes('personal pic'))
    return 'Once an image is shared, you lose control of it forever. Blocking and telling an adult protects you.';
  if (s.includes('secret') || s.includes('just between'))
    return 'Unsafe secrets keep kids stuck. Trusted adults can protect you and help make things right.';
  if (s.includes('online') || s.includes('texts') || s.includes('picture') || s.includes('group chat') || s.includes('social media') || s.includes('message'))
    return 'Online actions can spread fast and last a long time. Blocking/reporting protects you and others.';
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills') || s.includes('weed') || s.includes('smok'))
    return 'Substances can harm your body and judgment. Leaving pressure situations keeps you in control.';
  if (s.includes('weapon'))
    return 'Weapons can turn dangerous quickly. Adults and trained responders should handle it.';
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return 'Safety comes first. Getting adult help fast can save a life.';
  if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find") || s.includes('classroom'))
    return 'Staying put helps trusted adults find you faster and prevents you from getting more lost.';
  if (s.includes('grooming') || s.includes('mature') || s.includes('favorite') || s.includes('isolat'))
    return 'Grooming tactics rely on secrecy and isolation. Telling an adult breaks that pattern and keeps you safe.';
  if (s.includes('instinct') || s.includes('uh-oh'))
    return 'Your body sends signals when something is off. Learning to trust those signals is a superpower.';
  if (s.includes('boundary'))
    return 'When someone crosses your boundaries and tells you to stay quiet, that\'s a red flag. You deserve to be heard.';
  return 'The safest choice usually includes staying calm, using clear words, and getting help early.';
};

const practicePhraseFor = (scenario: string, age: AgeBand) => {
  const s = scenario.toLowerCase();
  if (age === '4-6') {
    if (s.includes('hug') || s.includes('lap') || s.includes('tickle') || s.includes('touch') || s.includes('bottom') || s.includes('doctor') || s.includes('private parts'))
      return 'Stop. I don\'t like that.';
    if (s.includes('secret')) return 'I need to tell my grown-up.';
    if (s.includes('candy') || s.includes('car') || s.includes('dog')) return 'No! I\'m going to my grown-up.';
    if (s.includes("can't find") || s.includes("can\u2019t find") || s.includes('lost')) return 'I\'m lost. Please help me find my grown-up.';
    return 'I need help, please.';
  }
  if (age === '7-9') return 'No thanks. I\'m not doing that.';
  return 'I\'m not comfortable with that. I\'m getting help.';
};

const reflectionPromptsFor = (age: AgeBand, scenario = ''): string[] => {
  const s = scenario.toLowerCase();
  const ageBaseline =
    age === '4-6' ? 'Who is your safe grown-up to tell?' :
    age === '7-9' ? 'Who is the best trusted adult to tell first?' :
    'Who can support you without making it worse?';

  // Pick ONE scenario-specific opener based on keywords
  let specific = '';
  if (s.includes('private parts') || s.includes('touch') || s.includes('hug') || s.includes('tickle') || s.includes('lap') || s.includes('bottom') || s.includes('boundary'))
    specific = 'What words could you use to make someone stop?';
  else if (s.includes('secret') || s.includes('just between'))
    specific = 'How do you know if a secret is the bad kind that should be told?';
  else if (s.includes('online') || s.includes('text') || s.includes('group chat') || s.includes('social media') || s.includes('message') || s.includes('hack'))
    specific = 'What clue in the message would make you stop and check with an adult?';
  else if (s.includes('photo') || s.includes('picture') || s.includes('nude') || s.includes('personal pic'))
    specific = 'Why is a photo so hard to take back once you send it?';
  else if (s.includes('grooming') || s.includes('mature') || s.includes('favorite') || s.includes('special treatment') || s.includes('isolat'))
    specific = 'Why might an adult try to make you feel "special" or different from your friends?';
  else if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills') || s.includes('weed') || s.includes('smok'))
    specific = 'What could you say to a friend without making it weird?';
  else if (s.includes('weapon'))
    specific = 'Where is the safest place you could go right now?';
  else if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    specific = 'Who is one adult you could call right this minute?';
  else if (s.includes('bully') || s.includes('mean') || s.includes('makes fun'))
    specific = 'What\'s the difference between telling and tattling here?';
  else if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find"))
    specific = 'What would help an adult find you faster?';
  else if (s.includes('candy') || s.includes('car') || s.includes('dog') || s.includes('follow') || s.includes('truck'))
    specific = 'What is your "no, I\'m going to my adult" plan?';
  else if (s.includes('sleepover'))
    specific = 'What\'s our code word if you need to come home, no questions asked?';
  else if (s.includes('pressure') || s.includes('dare'))
    specific = 'What does it feel like in your body when something feels wrong?';
  else if (s.includes('package') || s.includes('hold') || s.includes('hide'))
    specific = 'Why might someone want a kid to hold something for them?';
  else if (s.includes('instinct') || s.includes('uh-oh') || s.includes('gut'))
    specific = 'When was the last time your gut told you something was off?';
  else
    specific = 'Has anything like this ever happened to you, or to someone you know?';

  return [specific, ageBaseline];
};

const deckFor_4_6 = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('private') || s.includes('lap') || s.includes('hug') || s.includes('tickle') || s.includes('bottom') || s.includes('doctor') || s.includes('touch'))
    return DECKS.BODY_4_6;
  if (s.includes('secret') || s.includes('not tell') || s.includes('keep a secret'))
    return DECKS.SECRETS_4_6;
  return DECKS.TRUSTED_4_6;
};

const deckFor_7_9 = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('online') || s.includes('text') || s.includes('phone') || s.includes('picture') || s.includes('social media') || s.includes('naked') || s.includes('photo') || s.includes('call'))
    return DECKS.DIGITAL_7_9;
  return DECKS.PEER_7_9;
};

const deckFor_10plus = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('groom') || s.includes('mature') || s.includes('favorite') || s.includes('secret') ||
      s.includes('attention') || s.includes('isolat') || s.includes('boundary') || s.includes('ick') ||
      s.includes('sleepover') || s.includes('coach') || s.includes('teacher') || s.includes('nude') ||
      s.includes('photo') || s.includes('older online'))
    return DECKS.GROOMING_10PLUS;
  return DECKS.STREET_10PLUS;
};

/* ─── Card builder ─── */

const LABELS = ['A', 'B', 'C', 'D'];

/**
 * Deterministic shuffle of options A-C so the correct answer isn't always B.
 * Uses a simple seeded PRNG so the order is stable across renders but varies per card.
 */
const shuffleFirstThree = (
  options: string[],
  correctLabel: string,
  worstLabel: string,
  seed: number,
  qualities?: string[],
): { shuffled: string[]; newCorrect: string; newWorst: string; shuffledQualities?: string[] } => {
  // Shuffle every written option. The wow-me choice is appended at play time and always stays last.
  const indices = options.map((_, i) => i);
  // Fisher-Yates with seeded pseudo-random
  let s = seed;
  const nextRand = () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(nextRand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const labelToIdx: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
  const correctIdx = labelToIdx[correctLabel];
  const worstIdx = labelToIdx[worstLabel];

  const shuffled = indices.map(srcIdx => options[srcIdx]);
  const shuffledQualities = qualities ? indices.map(srcIdx => qualities[srcIdx]) : undefined;

  // Map old indices to new positions
  const oldToNew: Record<number, number> = {};
  indices.forEach((srcIdx, destIdx) => {
    oldToNew[srcIdx] = destIdx;
  });

  const newCorrect = oldToNew[correctIdx] !== undefined ? LABELS[oldToNew[correctIdx]] : correctLabel;
  const newWorst = oldToNew[worstIdx] !== undefined ? LABELS[oldToNew[worstIdx]] : worstLabel;

  return { shuffled, newCorrect, newWorst, shuffledQualities };
};

const buildCards = (age: AgeBand, deckFn: (scenario: string) => string, scenarios: { scenario: string; options: string[]; correct_option: string; worst_option: string; practice_phrase?: string }[]): Card[] =>
  scenarios.map((data, idx) => {
    const scenario = normalize(data.scenario);
    const id = `${age === 'teens' ? 'TEENS' : age === '10+' ? '10PLUS' : age}-${String(idx + 1).padStart(3, '0')}`;

    // Shuffle options A-C deterministically per card
    const seed = id.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
    const { shuffled, newCorrect, newWorst } = shuffleFirstThree(
      data.options,
      data.correct_option,
      data.worst_option,
      seed,
    );

    return {
      id,
      deck_id: deckFn(scenario),
      title: makeTitle(scenario),
      scenario,
      options: shuffled.map((text, i) => ({ label: LABELS[i], text })),
      correct_option: newCorrect,
      worst_option: newWorst,
      guidance_text: guidanceFor(scenario),
      why_text: whyFor(scenario),
      practice_phrase: data.practice_phrase || practicePhraseFor(scenario, age),
      help_prompt: reflectionPromptsFor(age, scenario).join(' '),
      reflection_prompts: reflectionPromptsFor(age, scenario),
      difficulty: difficultyFor(scenario),
      age_band: age,
      tags: tagsFor(scenario),
      status: 'published' as const,
    };
  });

/* ─── Final combined cards array ─── */

export const cards: Card[] = [
  ...buildCards('4-6', deckFor_4_6, scenarios_4_6),
  ...buildCards('7-9', deckFor_7_9, scenarios_7_9),
  ...buildCards('10+', deckFor_10plus, scenarios_10plus),
  ...buildCards('teens', () => DECKS.JUDGMENT_TEENS, scenarios_teens),
  ...handAuthoredCards,
];

/* ─── Update deck card_counts ─── */
decks.forEach(d => {
  d.card_count = cards.filter(c => c.deck_id === d.id && c.status === 'published').length;
});

/* ─── Query helpers ─── */

export function getDeckBySlug(slug: string): Deck | undefined {
  return decks.find(d => d.slug === slug || d.id === slug);
}

export function getCardsByDeck(deckId: string): Card[] {
  return cards.filter(c => c.deck_id === deckId && c.status === 'published');
}

export function getCardsByAgeBand(ageBand: string): Card[] {
  return cards.filter(c => c.age_band === ageBand && c.status === 'published');
}

export function getFreeDecks(): Deck[] {
  return decks.filter(d => d.is_free);
}

export function isFreeDeck(deckId: string): boolean {
  const deck = decks.find(d => d.id === deckId);
  return deck?.is_free ?? false;
}

/** Compilation deck ID – signals "pull random cards from all decks" */
export const COMPILATION_DECK_ID = '__compilation__';

/** Shuffle array (Fisher-Yates) and optionally limit count, filtered by age band */
export function getCompilationCards(limit = 10, ageBand?: AgeBand): Card[] {
  const published = cards.filter(c => c.status === 'published' && (!ageBand || c.age_band === ageBand));
  const shuffled = [...published];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}
