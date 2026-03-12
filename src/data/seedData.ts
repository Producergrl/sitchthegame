import { Card, Deck, AgeBand } from '@/types/game';

export const decks: Deck[] = [
  // ── 4-6 age band ──
  {
    id: 'body-boundaries-4-6', slug: 'body-boundaries-4-6',
    name: 'Body Boundaries (4–6)',
    description: 'Learn about your body, safe and unsafe touches, and saying no.',
    age_band: '4-6', tags: ['consent', 'body-safety'],
    is_default: true, is_free: true, card_count: 0, icon: '🛡️', color: 'primary',
  },
  {
    id: 'trusted-adults-4-6', slug: 'trusted-adults-4-6',
    name: 'Trusted Adults (4–6)',
    description: 'Know who to turn to and how to stay safe with strangers.',
    age_band: '4-6', tags: ['stranger-safety'],
    is_default: true, is_free: false, card_count: 0, icon: '🏠', color: 'safe',
  },
  {
    id: 'secrets-4-6', slug: 'secrets-4-6',
    name: 'Safe & Unsafe Secrets (4–6)',
    description: 'Learn the difference between surprises and secrets that should be told.',
    age_band: '4-6', tags: ['body-safety', 'secrets'],
    is_default: true, is_free: false, card_count: 0, icon: '🤫', color: 'caution',
  },
  // ── 5-7 age band ──
  {
    id: 'body-boundaries', slug: 'body-boundaries',
    name: 'Body Boundaries & Consent',
    description: 'Learn about personal space, safe and unsafe touches, and how to speak up.',
    age_band: '5-7', tags: ['boundaries', 'consent'],
    is_default: true, is_free: true, card_count: 4, icon: '🛡️', color: 'primary',
  },
  {
    id: 'trusted-adults', slug: 'trusted-adults',
    name: 'Trusted Adults & Safe Places',
    description: 'Know who to turn to and where to go when you need help.',
    age_band: '5-7', tags: ['trusted adults', 'safe places'],
    is_default: true, is_free: false, card_count: 4, icon: '🏠', color: 'safe',
  },
  // ── 7-11 age band ──
  {
    id: 'peer-pressure-7-11', slug: 'peer-pressure-7-11',
    name: 'Peer Pressure (7–11)',
    description: 'Handle dares, vapes, and pressure from friends.',
    age_band: '7-11', tags: ['peer-pressure', 'substance-risk'],
    is_default: true, is_free: true, card_count: 0, icon: '🫸', color: 'caution',
  },
  {
    id: 'digital-safety-7-11', slug: 'digital-safety-7-11',
    name: 'Digital Safety (7–11)',
    description: 'Stay safe from strangers and scams online.',
    age_band: '7-11', tags: ['online-safety'],
    is_default: true, is_free: false, card_count: 0, icon: '💻', color: 'help',
  },
  // ── 8-10 age band ──
  {
    id: 'online-safety', slug: 'online-safety',
    name: 'Online & Device Safety',
    description: 'Stay safe while using phones, tablets, and the internet.',
    age_band: '8-10', tags: ['online safety', 'devices'],
    is_default: true, is_free: true, card_count: 4, icon: '📱', color: 'help',
  },
  {
    id: 'bullying', slug: 'bullying',
    name: 'Bullying & Peer Pressure',
    description: 'Handle tough social situations and stand up for yourself and others.',
    age_band: '8-10', tags: ['bullying', 'peer pressure'],
    is_default: true, is_free: false, card_count: 4, icon: '💪', color: 'secondary',
  },
  // ── 11-13 age band ──
  {
    id: 'emergencies', slug: 'emergencies',
    name: 'Emergencies & Getting Help',
    description: 'Learn what to do in scary or dangerous situations.',
    age_band: '11-13', tags: ['emergencies', 'help'],
    is_default: true, is_free: true, card_count: 4, icon: '🚨', color: 'caution',
  },
  // ── 12+ age band ──
  {
    id: 'real-world-judgment-12plus', slug: 'real-world-judgment-12plus',
    name: 'Real-World Judgment (12+)',
    description: 'Navigate adult-ish situations with confidence and common sense.',
    age_band: '12+', tags: ['judgment', 'digital-awareness'],
    is_default: true, is_free: false, card_count: 0, icon: '🧭', color: 'gentle',
  },
];

/* ─── Helper constants & functions for 150-card generation ─── */

const DECKS = {
  BODY_4_6: 'body-boundaries-4-6',
  TRUSTED_4_6: 'trusted-adults-4-6',
  SECRETS_4_6: 'secrets-4-6',
  PEER_7_11: 'peer-pressure-7-11',
  DIGITAL_7_11: 'digital-safety-7-11',
  JUDGMENT_12: 'real-world-judgment-12plus',
} as const;

const normalize = (s: string) =>
  s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2019]/g, "'").replace(/\s*What would you do\?\s*$/i, '').trim();

const makeTitle = (scenario: string) => {
  const words = scenario.split(/\s+/).slice(0, 7).join(' ');
  return words.replace(/[".]/g, '').slice(0, 60).trim();
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
      s.includes('self-harm') || s.includes('abused') || s.includes("put something in another person's drink")) return 3;
  if (s.includes('threat') || s.includes('follow') || s.includes('alone') || s.includes('room') ||
      s.includes('car') || s.includes('run away') || s.includes('vape') || s.includes('alcohol') ||
      s.includes('drunk') || s.includes('bully') || s.includes('mean') || s.includes('fight') ||
      s.includes('hit')) return 2;
  return 1;
};

const optionsFor = (s0: string): string[] => {
  const s = s0.toLowerCase();
  if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find") || s.includes('classroom'))
    return ['Stay where you are and look for a safe adult.', 'Ask a safe adult (employee/teacher) for help right away.', 'Walk away alone to search.'];
  if (s.includes('candy') || s.includes('finding their dog') || s.includes('go with them') || s.includes('car'))
    return ['Go with them to help.', 'Say no and go to a trusted adult right away.', 'Keep talking to them by yourself.'];
  if (s.includes('secret'))
    return ['Keep the secret so no one is upset.', 'Tell a trusted adult, even if someone said not to.', 'Try to forget it and say nothing.'];
  if (s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle') || s.includes('private parts') || s.includes('doctor') || s.includes('bottom'))
    return ['Stay quiet and let it happen.', "Say 'Stop' or 'No' and move away.", 'Laugh even if you feel uncomfortable.'];
  if (s.includes('cheat') || s.includes('steal') || s.includes('shoplift') || s.includes('lie') || s.includes('copying your homework'))
    return ['Go along with it to avoid conflict.', 'Say no and choose the honest option.', 'Watch and say nothing.'];
  if (s.includes('mean texts') || s.includes('texts') || s.includes('online') || s.includes('picture') || s.includes('group chat') || s.includes('social media') || s.includes('hack'))
    return ['Reply back and escalate the conflict.', 'Save evidence, block/report, and tell a trusted adult.', 'Ignore it forever and hope it stops.'];
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills'))
    return ['Try it to fit in.', 'Say no and get distance from the situation.', 'Hold it for someone else.'];
  if (s.includes('weapon'))
    return ['Assume they\'re joking and do nothing.', 'Get to safety and tell a trusted adult immediately.', 'Confront them alone.'];
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return ['Keep it secret because they asked.', 'Tell a trusted adult right away and stay with them if safe.', 'Try to handle it alone without involving adults.'];
  return ['Do what they want so there\'s no conflict.', 'Use a calm voice to say what you need and ask for help if needed.', 'Get angry or run away without telling anyone.'];
};

/** Identifies the worst/most dangerous option label for a scenario (always the most harmful choice). */
const worstOptionFor = (s0: string): string => {
  const s = s0.toLowerCase();
  // For body safety / touch scenarios, staying quiet is the worst
  if (s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle') || s.includes('private parts') || s.includes('doctor') || s.includes('bottom'))
    return 'A'; // "Stay quiet and let it happen"
  // For secrets, keeping the secret is the worst
  if (s.includes('secret'))
    return 'A'; // "Keep the secret so no one is upset"
  // For stranger danger, going with them is the worst
  if (s.includes('candy') || s.includes('finding their dog') || s.includes('go with them') || s.includes('car'))
    return 'A'; // "Go with them"
  // For substances, trying it is the worst
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills'))
    return 'A'; // "Try it to fit in"
  // For weapons, doing nothing is the worst
  if (s.includes('weapon'))
    return 'A'; // "Assume they're joking"
  // For life-threatening situations, keeping it secret is the worst
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return 'A'; // "Keep it secret"
  // For online threats, escalating is the worst
  if (s.includes('mean texts') || s.includes('texts') || s.includes('online') || s.includes('picture') || s.includes('group chat') || s.includes('social media') || s.includes('hack'))
    return 'A'; // "Reply back and escalate"
  // Default: compliance/passivity is worst
  return 'A';
};

const guidanceFor = (s0: string) => {
  const s = s0.toLowerCase();
  if (s.includes('private parts') || s.includes('take off clothes') || s.includes('doctor') || s.includes('bottom'))
    return 'If anyone asks to see or touch private parts or play a clothes-off game, say NO, get away, and tell a trusted adult immediately.';
  if (s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle'))
    return 'You can say no to any touch you don\'t want. Move away and tell a trusted adult if it continues.';
  if (s.includes('secret'))
    return 'If a secret makes you feel yucky, scared, or worried, tell a trusted adult. You\'re not in trouble for telling.';
  if (s.includes('candy') || s.includes('finding their dog') || s.includes('car') || s.includes('meet you in person'))
    return 'Don\'t go anywhere alone with someone you don\'t know or feel unsure about. Go to your safe adult.';
  if (s.includes('online') || s.includes('texts') || s.includes('picture') || s.includes('group chat') || s.includes('social media') || s.includes('hack'))
    return 'Protect your privacy online. Don\'t share personal info, don\'t forward harmful content, and tell a trusted adult.';
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills'))
    return 'Say no and get away from substances. If you feel pressured, find a trusted adult and leave the situation.';
  if (s.includes('weapon'))
    return 'Get to safety and tell a trusted adult immediately. Do not confront the person.';
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return 'This is an emergency. Tell a trusted adult right away. If there is immediate danger, call emergency services.';
  if (s.includes('bully') || s.includes('mean name') || s.includes('makes fun') || s.includes('mean texts'))
    return 'You don\'t deserve bullying. Get support: move to safety, tell an adult, and keep evidence if it\'s online.';
  if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find") || s.includes('classroom'))
    return 'Stop, stay in a safe public place, and ask a safe adult (employee/teacher) for help.';
  return 'Choose the safest next step: stay calm, use your voice, and involve a trusted adult when you need help.';
};

const whyFor = (s0: string) => {
  const s = s0.toLowerCase();
  if (s.includes('private parts') || s.includes('take off clothes') || s.includes('doctor') || s.includes('bottom') || s.includes('touch') || s.includes('lap') || s.includes('hug') || s.includes('tickle'))
    return 'Your body belongs to you. Safe adults respect boundaries and never ask for secret body games.';
  if (s.includes('secret'))
    return 'Unsafe secrets keep kids stuck. Trusted adults can protect you and help make things right.';
  if (s.includes('online') || s.includes('texts') || s.includes('picture') || s.includes('group chat') || s.includes('social media'))
    return 'Online actions can spread fast and last a long time. Blocking/reporting protects you and others.';
  if (s.includes('vape') || s.includes('alcohol') || s.includes('drugs') || s.includes('pills'))
    return 'Substances can harm your body and judgment. Leaving pressure situations keeps you in control.';
  if (s.includes('weapon'))
    return 'Weapons can turn dangerous quickly. Adults and trained responders should handle it.';
  if (s.includes('end their life') || s.includes('want to die') || s.includes('self-harm') || s.includes('unconscious'))
    return 'Safety comes first. Getting adult help fast can save a life.';
  if (s.includes('lost') || s.includes("can't find") || s.includes("can\u2019t find") || s.includes('classroom'))
    return 'Staying put helps trusted adults find you faster and prevents you from getting more lost.';
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
  if (age === '7-11') return 'No thanks. I\'m not doing that.';
  return 'I\'m not comfortable with that. I\'m getting help.';
};

const reflectionPromptsFor = (age: AgeBand): string[] => {
  if (age === '4-6') return ['What did your tummy feel like?', 'Who is your safe grown-up to tell?'];
  if (age === '7-11') return ['Who is the best trusted adult to tell first?', 'What is one safe boundary you can set?'];
  return ['What\'s the safest next step right now?', 'Who can support you without making it worse?'];
};

const deckFor_4_6 = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('private') || s.includes('lap') || s.includes('hug') || s.includes('tickle') || s.includes('bottom') || s.includes('doctor') || s.includes('touch'))
    return DECKS.BODY_4_6;
  if (s.includes('secret') || s.includes('not tell') || s.includes('keep a secret'))
    return DECKS.SECRETS_4_6;
  return DECKS.TRUSTED_4_6;
};

const deckFor_7_11 = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('online') || s.includes('text') || s.includes('phone') || s.includes('picture') || s.includes('social media') || s.includes('naked') || s.includes('photo') || s.includes('call'))
    return DECKS.DIGITAL_7_11;
  return DECKS.PEER_7_11;
};

/* ─── Scenarios ─── */

const scenarios_4_6: string[] = [
  "Your friend asks you to share your snack, but you really want it all. What would you do?",
  "A grown-up at the park asks for your help finding their dog. What would you do?",
  "Someone tells you a secret that makes you feel yucky inside. What would you do?",
  "You want to play with a toy your friend is using. What would you do?",
  "Your teacher asks you to clean up, but you're still playing. What would you do?",
  "A grown-up you don't know offers you candy. What would you do?",
  "Your friend wants to play rough, but it hurts. What would you do?",
  "You accidentally knock over a tower someone built. What would you do?",
  "A bigger kid at school takes your ball. What would you do?",
  "Someone says they'll only play with you if you give them your toy. What would you do?",
  "You can't find your grown-up at the store. What would you do?",
  "A grown-up you know wants you to sit on their lap but you don't want to. What would you do?",
  "Your friend says, \"Let's hide from the teacher.\" What would you do?",
  "Someone wants to tickle you, but you don't like it. What would you do?",
  "You see a bug in your food. What would you do?",
  "Your friend says, \"If you don't do this, I won't be your friend.\" What would you do?",
  "Someone calls you a mean name. What would you do?",
  "A teacher gives you the wrong snack. What would you do?",
  "Someone says they want to take a picture of you alone. What would you do?",
  "Your friend is crying because they miss their mom. What would you do?",
  "A grown-up tells you to keep a secret from your parents. What would you do?",
  "You don't want to hug someone, but they keep asking. What would you do?",
  "Someone asks to see your private parts. What would you do?",
  "Your friend doesn't want to share their toy with you. What would you do?",
  "You spill juice on the floor. What would you do?",
  "A grown-up says they'll give you a toy if you keep a secret. What would you do?",
  "You feel sick at school. What would you do?",
  "Your friend falls down and cries. What would you do?",
  "Someone says they will hurt your pet if you tell on them. What would you do?",
  "You don't like the game your friend wants to play. What would you do?",
  "A grown-up asks you to go with them to their car. What would you do?",
  "Your friend hits you. What would you do?",
  "Someone says they want to play \"doctor\" with you and take off clothes. What would you do?",
  "You see someone taking something that isn't theirs. What would you do?",
  "You lose your favorite toy at school. What would you do?",
  "Someone makes fun of your clothes. What would you do?",
  "Your friend says, \"Let's not tell anyone what we just did.\" What would you do?",
  "A grown-up keeps tickling you even when you say stop. What would you do?",
  "You see your friend push another kid. What would you do?",
  "Someone asks you to come into a room alone with them. What would you do?",
  "You feel scared about going to a friend's house. What would you do?",
  "Your teacher yells loudly and it scares you. What would you do?",
  "Someone touches your bottom and says it's a game. What would you do?",
  "Your friend wants you to run away from school with them. What would you do?",
  "Someone shows you a phone picture that makes you uncomfortable. What would you do?",
  "You need to go potty but you're shy to ask. What would you do?",
  "A grown-up wants you to keep a surprise from your parents. What would you do?",
  "Someone hugs you too tightly and it hurts. What would you do?",
  "You don't know where your classroom is. What would you do?",
  "Your friend won't let you sit with them at lunch. What would you do?",
];

const scenarios_7_11: string[] = [
  "Your friend wants to cheat on a test and asks for your answers. What would you do?",
  "Someone keeps sending you mean texts. What would you do?",
  "A teacher says something that makes you feel uncomfortable. What would you do?",
  "A friend dares you to steal candy from the store. What would you do?",
  "Someone you trust asks you to lie for them. What would you do?",
  "A stranger online asks where you live. What would you do?",
  "A friend invites you over, but their older sibling makes you feel uneasy. What would you do?",
  "Someone offers you a vape pen at school. What would you do?",
  "You see your friend getting bullied. What would you do?",
  "A friend says they want to run away. What would you do?",
  "Someone touches your leg under the table and it feels wrong. What would you do?",
  "Your friend wants to watch a movie your parents wouldn't allow. What would you do?",
  "Someone says they'll hurt you if you tell. What would you do?",
  "You're at a friend's house and their parents start fighting loudly. What would you do?",
  "You see a teacher hitting a student. What would you do?",
  "A grown-up buys you gifts often but asks for hugs and kisses in return. What would you do?",
  "Someone says they can make you famous if you keep a secret. What would you do?",
  "A friend asks you to sneak out at night. What would you do?",
  "Someone sends you a picture of themselves naked. What would you do?",
  "You see your friend stealing lunch money. What would you do?",
  "Your coach keeps asking you to come to practice early, alone. What would you do?",
  "Someone calls you names because of how you look. What would you do?",
  "You find out your friend is self-harming. What would you do?",
  "Your teacher tells you to keep a secret from your parents. What would you do?",
  "Someone says they want to be your boyfriend/girlfriend but asks for photos. What would you do?",
  "Your friend brings a weapon to school. What would you do?",
  "A grown-up touches your back and it feels uncomfortable. What would you do?",
  "Your friend dares you to jump off something dangerous. What would you do?",
  "Someone wants you to go into a room alone with them after school. What would you do?",
  "Your friend starts crying and says they want to die. What would you do?",
  "A classmate keeps copying your homework. What would you do?",
  "You lose your lunch money. What would you do?",
  "Someone tries to pull your pants down as a joke. What would you do?",
  "You see someone being mean to your sibling. What would you do?",
  "A friend keeps asking to touch you. What would you do?",
  "You're invited to a sleepover but feel uneasy. What would you do?",
  "A coach tells you to change in front of them. What would you do?",
  "You're offered a ride home by someone you don't know well. What would you do?",
  "Someone tells you their parents hurt them. What would you do?",
  "A friend keeps asking you to swear or use bad words. What would you do?",
  "You see inappropriate pictures on someone's phone. What would you do?",
  "Your teacher blames you for something you didn't do. What would you do?",
  "Your friend wants to skip school. What would you do?",
  "A friend keeps calling you at night and you're tired. What would you do?",
  "Someone asks you to keep a secret about touching. What would you do?",
  "A friend wants to prank call someone. What would you do?",
  "You see someone hurting an animal. What would you do?",
  "Your parents are fighting loudly. What would you do?",
  "Someone touches your hair or face without permission. What would you do?",
  "A friend pressures you to do something you know is wrong. What would you do?",
];

const scenarios_12_plus: string[] = [
  "Someone you like offers you alcohol at a party. What would you do?",
  "Your coach texts you late at night about personal things. What would you do?",
  "You find out your friend is being abused at home. What would you do?",
  "A friend shares nudes and asks for yours. What would you do?",
  "Someone older offers you a modeling job with photos in a private place. What would you do?",
  "Your friend says they want to end their life. What would you do?",
  "You see someone being sexually harassed in the hallway. What would you do?",
  "A teacher keeps commenting on your body. What would you do?",
  "Someone threatens to share your secrets online. What would you do?",
  "You're offered drugs at school. What would you do?",
  "A stranger online wants to meet you in person. What would you do?",
  "Your friend wants to shoplift at the mall. What would you do?",
  "You see a friend harming themselves in the bathroom. What would you do?",
  "Your boyfriend/girlfriend pressures you to have sex. What would you do?",
  "Someone shares a sexual video in your group chat. What would you do?",
  "You're at a party where everyone is drinking. What would you do?",
  "Your friend drives drunk. What would you do?",
  "Your teacher singles you out for special treatment. What would you do?",
  "You're in a car and the driver starts speeding dangerously. What would you do?",
  "Someone makes racist or sexist jokes around you. What would you do?",
  "Your friend gets very sick at a party. What would you do?",
  "Someone you know says they were sexually assaulted. What would you do?",
  "A friend asks you to cover for them with their parents. What would you do?",
  "You get sent a nude photo by someone. What would you do?",
  "Your friend shows you a weapon they brought to school. What would you do?",
  "Someone keeps staring at your body at the gym. What would you do?",
  "Your friend says they're pregnant and scared. What would you do?",
  "Your teacher asks to connect with you on social media. What would you do?",
  "Someone wants you to skip school for a day out. What would you do?",
  "Your friend is vaping and offers it to you. What would you do?",
  "You see a stranger following you on the way home. What would you do?",
  "A friend wants to send hate messages to someone. What would you do?",
  "Someone wants you to come to their house but no one else is home. What would you do?",
  "Your partner asks you to send something you're uncomfortable with. What would you do?",
  "A friend keeps asking to borrow money but never pays back. What would you do?",
  "You feel unsafe walking home alone after dark. What would you do?",
  "Someone grabs you at a crowded event. What would you do?",
  "You see a drink left unattended at a party. What would you do?",
  "Someone offers you pills to help you study. What would you do?",
  "Your friend wants to hack someone's account. What would you do?",
  "Your sibling is crying and won't tell you why. What would you do?",
  "A friend is dating someone much older. What would you do?",
  "Someone threatens to hurt your family if you tell. What would you do?",
  "Your friend wants to run away from home. What would you do?",
  "A teacher offers you a ride home. What would you do?",
  "Someone touches you in a way that feels wrong but says it's \"normal.\" What would you do?",
  "Your friend keeps making jokes about harming themselves. What would you do?",
  "You see a child being yelled at aggressively by a parent in public. What would you do?",
  "Your friend is unconscious after drinking. What would you do?",
  "Someone tells you they put something in another person's drink. What would you do?",
];

/* ─── Card builder (adapts to existing Card interface) ─── */

const LABELS = ['A', 'B', 'C', 'D'];

const buildCards = (age: AgeBand, deckFn: (scenario: string) => string, scenarios: string[]): Card[] =>
  scenarios.map((raw, idx) => {
    const scenario = normalize(raw);
    const id = `${age === '12+' ? '12PLUS' : age}-${String(idx + 1).padStart(3, '0')}`;
    const mcOptions = optionsFor(scenario);
    return {
      id,
      deck_id: deckFn(scenario),
      title: makeTitle(scenario),
      scenario,
      options: mcOptions.map((text, i) => ({ label: LABELS[i], text })),
      correct_option: 'B', // safe answer is always second
      worst_option: worstOptionFor(scenario),
      guidance_text: guidanceFor(scenario),
      why_text: whyFor(scenario),
      practice_phrase: practicePhraseFor(scenario, age),
      help_prompt: reflectionPromptsFor(age).join(' '),
      reflection_prompts: reflectionPromptsFor(age),
      difficulty: difficultyFor(scenario),
      age_band: age,
      tags: tagsFor(scenario),
      status: 'published' as const,
    };
  });

/* ─── 5-7 / 8-10 / 11-13 hand-authored cards ─── */

const handAuthoredCards: Card[] = [
  // ── 5-7: Body Boundaries & Consent ──
  { id: 'bb-1', deck_id: 'body-boundaries', title: 'The Unwanted Hug',
    scenario: 'A family friend wants to give you a big hug, but you don\'t feel like being hugged right now. What would you do?',
    options: [{ label: 'A', text: 'Hug them even though you don\'t want to' }, { label: 'B', text: 'Say "No thank you, I\'d rather wave hello!"' }, { label: 'C', text: 'Run away without saying anything' }, { label: 'D', text: 'Ask a parent if you have to hug them' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'You always have the right to say no to any touch that makes you uncomfortable, even from people you know.',
    why_text: 'Your body belongs to you. Politely saying no teaches others to respect your boundaries.',
    practice_phrase: '"No thank you — I\'d prefer a wave or a high-five!"',
    help_prompt: 'Talk to your parent or guardian about body boundaries.',
    difficulty: 1, age_band: '5-7', tags: ['boundaries', 'consent'], status: 'published' },
  { id: 'bb-2', deck_id: 'body-boundaries', title: 'The Secret Touch',
    scenario: 'Someone touches you in a way that feels wrong and tells you to keep it a secret. What would you do?',
    options: [{ label: 'A', text: 'Keep the secret because they told you to' }, { label: 'B', text: 'Tell a trusted adult right away' }, { label: 'C', text: 'Forget about it and move on' }, { label: 'D', text: 'Tell your best friend' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Safe secrets are fun surprises. Unsafe secrets make you feel bad inside. Always tell a trusted adult about unsafe secrets.',
    why_text: 'No one should ever ask you to keep a secret about touching. Telling an adult is brave and the right thing to do.',
    practice_phrase: '"This doesn\'t feel right. I need to tell someone I trust."',
    help_prompt: 'Tell a parent, teacher, or another trusted adult immediately.',
    difficulty: 2, age_band: '5-7', tags: ['boundaries', 'secrets'], status: 'published' },
  { id: 'bb-3', deck_id: 'body-boundaries', title: 'Changing Clothes',
    scenario: 'You\'re changing clothes at a friend\'s house and their older sibling walks in without knocking. What would you do?',
    options: [{ label: 'A', text: 'Say "Please knock! I\'m changing" and cover up' }, { label: 'B', text: 'Ignore it because it\'s not a big deal' }, { label: 'C', text: 'Feel embarrassed but say nothing' }, { label: 'D', text: 'Tell your friend\'s parent what happened' }],
    correct_option: 'A', worst_option: 'C', guidance_text: 'Everyone deserves privacy when changing. Speaking up helps set a clear boundary.',
    why_text: 'Asking for privacy is not rude — it\'s healthy. If it keeps happening, tell a trusted adult.',
    practice_phrase: '"Please knock before coming in — I need privacy!"',
    help_prompt: 'Talk to your parent about rules for privacy at other homes.',
    difficulty: 1, age_band: '5-7', tags: ['boundaries', 'privacy'], status: 'published' },
  { id: 'bb-4', deck_id: 'body-boundaries', title: 'The Tickle Game',
    scenario: 'Your cousin keeps tickling you and won\'t stop even though you said stop. What would you do?',
    options: [{ label: 'A', text: 'Laugh and hope they stop eventually' }, { label: 'B', text: 'Say "STOP! I said stop and I mean it!"' }, { label: 'C', text: 'Hit them back' }, { label: 'D', text: 'Walk away and tell an adult' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'When you say stop, people must listen. If they don\'t, walk away and get help.',
    why_text: 'Stop means stop — always. This is an important boundary everyone should respect.',
    practice_phrase: '"I said stop. Please respect that."',
    help_prompt: 'Tell a parent or guardian if someone won\'t stop when you ask.',
    difficulty: 1, age_band: '5-7', tags: ['boundaries', 'consent'], status: 'published' },
  // ── 5-7: Trusted Adults & Safe Places ──
  { id: 'ta-1', deck_id: 'trusted-adults', title: 'Who Do You Trust?',
    scenario: 'Something is making you worried and you need to talk to someone. Who would be the best person to tell?',
    options: [{ label: 'A', text: 'A stranger who seems nice' }, { label: 'B', text: 'A parent, teacher, or family member you trust' }, { label: 'C', text: 'Nobody — you should handle it yourself' }, { label: 'D', text: 'Post about it online' }],
    correct_option: 'B', worst_option: 'C', guidance_text: 'Trusted adults are people you know well who always want to keep you safe.',
    why_text: 'You never have to handle scary things alone. Trusted adults are there to help.',
    practice_phrase: '"I need to talk to you about something that\'s worrying me."',
    help_prompt: 'Make a list of 3-5 trusted adults you can always go to.',
    difficulty: 1, age_band: '5-7', tags: ['trusted adults'], status: 'published' },
  { id: 'ta-2', deck_id: 'trusted-adults', title: 'Lost at the Store',
    scenario: 'You get separated from your parent at a big store and can\'t find them. What would you do?',
    options: [{ label: 'A', text: 'Walk out of the store to look for them' }, { label: 'B', text: 'Go with a stranger who offers to help find them' }, { label: 'C', text: 'Find a store worker (with a name badge) and ask for help' }, { label: 'D', text: 'Stay where you are and cry' }],
    correct_option: 'C', worst_option: 'B', guidance_text: 'Store workers with name badges are safe people to ask for help. They can make an announcement to find your parent.',
    why_text: 'Staying in the store and finding an employee is the safest choice.',
    practice_phrase: '"I\'m lost. Can you help me find my mom/dad? Their name is ___."',
    help_prompt: 'Practice a plan with your parent about what to do if you get separated.',
    difficulty: 1, age_band: '5-7', tags: ['safe places', 'strangers'], status: 'published' },
  { id: 'ta-3', deck_id: 'trusted-adults', title: 'The Offer of a Ride',
    scenario: 'Someone you don\'t know well pulls up in a car and offers you a ride home. What would you do?',
    options: [{ label: 'A', text: 'Get in if they know your name' }, { label: 'B', text: 'Say "No thank you" and quickly go to a safe place' }, { label: 'C', text: 'Ask them who sent them' }, { label: 'D', text: 'Get in because it\'s a long walk' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Never get in a car with someone unless your parent told you it was okay. Go to a safe place and tell a trusted adult.',
    why_text: 'Safe adults won\'t ask kids they don\'t know well to get in their car.',
    practice_phrase: '"No thank you! My parent didn\'t tell me about this."',
    help_prompt: 'Have a family password that only trusted people know.',
    difficulty: 2, age_band: '5-7', tags: ['strangers', 'safe places'], status: 'published' },
  { id: 'ta-4', deck_id: 'trusted-adults', title: 'The Worried Feeling',
    scenario: 'You told a trusted adult about a problem, but nothing seems to change. What would you do?',
    options: [{ label: 'A', text: 'Give up and stop talking about it' }, { label: 'B', text: 'Keep telling trusted adults until someone helps' }, { label: 'C', text: 'Decide it\'s not important' }, { label: 'D', text: 'Handle it by yourself' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'If one adult doesn\'t help, tell another one. Keep speaking up until you get the help you need.',
    why_text: 'Sometimes the first person you tell might not understand. Never stop speaking up.',
    practice_phrase: '"I told someone before but I still need help. Can you help me?"',
    help_prompt: 'Remember: it\'s never your fault, and you deserve to be helped.',
    difficulty: 2, age_band: '5-7', tags: ['trusted adults'], status: 'published' },
  // ── 8-10: Online & Device Safety ──
  { id: 'os-1', deck_id: 'online-safety', title: 'The Friend Request',
    scenario: 'Someone you don\'t know sends you a friend request on a game and says they\'re a kid your age. What would you do?',
    options: [{ label: 'A', text: 'Accept — they said they\'re your age' }, { label: 'B', text: 'Don\'t accept and tell a parent about it' }, { label: 'C', text: 'Accept but don\'t share personal info' }, { label: 'D', text: 'Ask them to prove they\'re a kid first' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'People online can pretend to be anyone. Never accept requests from strangers.',
    why_text: 'You can\'t verify who someone really is online. A trusted adult can help you decide.',
    practice_phrase: '"I don\'t accept friend requests from people I don\'t know in real life."',
    help_prompt: 'Show your parent the request and talk about online safety rules.',
    difficulty: 1, age_band: '8-10', tags: ['online safety', 'strangers'], status: 'published' },
  { id: 'os-2', deck_id: 'online-safety', title: 'The Personal Info Quiz',
    scenario: 'A fun quiz online asks for your full name, school name, and birthday. What would you do?',
    options: [{ label: 'A', text: 'Fill it in — it\'s just a fun quiz' }, { label: 'B', text: 'Make up fake answers' }, { label: 'C', text: 'Skip the quiz and tell a parent about it' }, { label: 'D', text: 'Only share your first name' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'Quizzes that ask for personal information can be tricks to collect your data.',
    why_text: 'Personal info can be used to find or trick you. Always check with a parent first.',
    practice_phrase: '"I never share my personal information online without asking a parent first."',
    help_prompt: 'Ask your parent before filling out anything online.',
    difficulty: 1, age_band: '8-10', tags: ['online safety', 'privacy'], status: 'published' },
  { id: 'os-3', deck_id: 'online-safety', title: 'The Scary Message',
    scenario: 'Someone sends you a message that says "I know where you live" while you\'re playing a game. What would you do?',
    options: [{ label: 'A', text: 'Reply and tell them to stop' }, { label: 'B', text: 'Ignore and keep playing' }, { label: 'C', text: 'Block them and tell a trusted adult immediately' }, { label: 'D', text: 'Ask them what they mean' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'Scary messages should always be reported. Block the person and tell an adult right away.',
    why_text: 'Responding can make things worse. Adults can help you report and stay safe.',
    practice_phrase: '"I\'m going to block this person and show this to my parent right now."',
    help_prompt: 'Show the message to your parent or guardian immediately.',
    difficulty: 2, age_band: '8-10', tags: ['online safety', 'bullying'], status: 'published' },
  { id: 'os-4', deck_id: 'online-safety', title: 'The Photo Request',
    scenario: 'Someone online asks you to send a photo of yourself. What would you do?',
    options: [{ label: 'A', text: 'Send a regular photo — what\'s the harm?' }, { label: 'B', text: 'Say no and tell a trusted adult' }, { label: 'C', text: 'Send a photo of your pet instead' }, { label: 'D', text: 'Ask them why they want it first' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Never send photos of yourself to people online, even if they seem friendly.',
    why_text: 'Once a photo is shared online, you can\'t control where it goes.',
    practice_phrase: '"I don\'t share photos of myself online. I\'m going to tell my parent about this."',
    help_prompt: 'Tell a parent or guardian about any photo requests.',
    difficulty: 2, age_band: '8-10', tags: ['online safety', 'privacy'], status: 'published' },
  // ── 8-10: Bullying & Peer Pressure ──
  { id: 'bp-1', deck_id: 'bullying', title: 'The Lunchtime Bully',
    scenario: 'A kid at school keeps taking your snack at lunch and says "it\'s just a joke." What would you do?',
    options: [{ label: 'A', text: 'Let them have it to avoid trouble' }, { label: 'B', text: 'Take their snack too' }, { label: 'C', text: 'Say "That\'s not a joke. Please stop." and tell a teacher' }, { label: 'D', text: 'Stop bringing snacks to school' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'If something doesn\'t feel like a joke to you, it\'s not a joke. Speaking up and getting help is the right move.',
    why_text: 'Bullying often hides behind "just joking." You deserve to feel safe at school.',
    practice_phrase: '"That\'s not funny to me. Please stop or I\'ll talk to a teacher."',
    help_prompt: 'Talk to a teacher, school counselor, or parent about what\'s happening.',
    difficulty: 1, age_band: '8-10', tags: ['bullying'], status: 'published' },
  { id: 'bp-2', deck_id: 'bullying', title: 'The Dare',
    scenario: 'Your friends dare you to do something that feels unsafe, like climbing a high fence. They say you\'re chicken if you don\'t. What would you do?',
    options: [{ label: 'A', text: 'Do it so they don\'t make fun of you' }, { label: 'B', text: 'Say "No thanks, that\'s not safe" and suggest something else' }, { label: 'C', text: 'Dare them to do something even scarier' }, { label: 'D', text: 'Walk away without saying anything' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Real friends won\'t force you to do unsafe things. It takes courage to say no!',
    why_text: 'Being safe is more important than looking cool. True friends respect your choices.',
    practice_phrase: '"That doesn\'t feel safe to me. Let\'s do something else instead!"',
    help_prompt: 'If friends keep pressuring you, talk to a trusted adult about it.',
    difficulty: 1, age_band: '8-10', tags: ['peer pressure'], status: 'published' },
  { id: 'bp-3', deck_id: 'bullying', title: 'The Group Chat',
    scenario: 'Kids in a group chat are saying mean things about another student. They want you to join in. What would you do?',
    options: [{ label: 'A', text: 'Join in so they don\'t turn on you' }, { label: 'B', text: 'Stay quiet and just watch' }, { label: 'C', text: 'Leave the chat and tell a trusted adult' }, { label: 'D', text: 'Say "This isn\'t cool. Let\'s stop."' }],
    correct_option: 'D', worst_option: 'A', guidance_text: 'Standing up for someone — even online — makes a big difference. If it feels unsafe, leave and tell an adult.',
    why_text: 'Watching and doing nothing still hurts. Being kind takes courage but matters a lot.',
    practice_phrase: '"Hey, this isn\'t okay. How would you feel if someone said this about you?"',
    help_prompt: 'Show a parent or teacher the messages if they continue.',
    difficulty: 2, age_band: '8-10', tags: ['bullying', 'online safety'], status: 'published' },
  { id: 'bp-4', deck_id: 'bullying', title: 'The New Kid',
    scenario: 'A new student joins your class and some kids are leaving them out on purpose. What would you do?',
    options: [{ label: 'A', text: 'Stay with your usual group — it\'s not your problem' }, { label: 'B', text: 'Invite the new kid to sit with you or join your game' }, { label: 'C', text: 'Feel bad but do nothing' }, { label: 'D', text: 'Tell the teacher to handle it' }],
    correct_option: 'B', worst_option: 'C', guidance_text: 'Being kind to someone new can make their whole day better. You might make a great friend!',
    why_text: 'Everyone feels nervous being new. A small act of kindness can change everything.',
    practice_phrase: '"Hey! Want to sit with us? I\'m [your name]."',
    help_prompt: 'Talk to your parent about being welcoming to others.',
    difficulty: 1, age_band: '8-10', tags: ['bullying', 'kindness'], status: 'published' },
  // ── 11-13: Emergencies & Getting Help ──
  { id: 'em-1', deck_id: 'emergencies', title: 'Someone Is Hurt',
    scenario: 'Your friend falls off their bike and is bleeding badly. What would you do?',
    options: [{ label: 'A', text: 'Try to fix it yourself' }, { label: 'B', text: 'Run home and forget about it' }, { label: 'C', text: 'Stay calm, stay with them, and call or get an adult immediately' }, { label: 'D', text: 'Tell them it\'s not that bad' }],
    correct_option: 'C', worst_option: 'B', guidance_text: 'Stay calm and get adult help fast. Don\'t leave an injured friend alone if possible.',
    why_text: 'Adults know how to handle injuries and can call for medical help if needed.',
    practice_phrase: '"Stay calm, I\'m going to get help right now. Don\'t move."',
    help_prompt: 'Know how to call emergency services in your country.',
    difficulty: 1, age_band: '11-13', tags: ['emergencies'], status: 'published' },
  { id: 'em-2', deck_id: 'emergencies', title: 'Home Alone Emergency',
    scenario: 'You\'re home and smell smoke coming from the kitchen. What would you do?',
    options: [{ label: 'A', text: 'Try to find the fire and put it out' }, { label: 'B', text: 'Get out of the house and call for help from a neighbor' }, { label: 'C', text: 'Hide in your room and wait' }, { label: 'D', text: 'Open all the windows' }],
    correct_option: 'B', worst_option: 'C', guidance_text: 'Get out first, then get help. Never try to fight a fire yourself.',
    why_text: 'Your safety comes first. Things can be replaced — you can\'t.',
    practice_phrase: '"I need to get out now and find help!"',
    help_prompt: 'Practice your family\'s fire escape plan regularly.',
    difficulty: 2, age_band: '11-13', tags: ['emergencies'], status: 'published' },
  { id: 'em-3', deck_id: 'emergencies', title: 'The Dangerous Shortcut',
    scenario: 'Walking home from school, your friend wants to take a shortcut through a dark, empty area. What would you do?',
    options: [{ label: 'A', text: 'Go with them — it\'s faster' }, { label: 'B', text: 'Say "Let\'s stick to the main road where it\'s safe"' }, { label: 'C', text: 'Let them go alone and take the normal route' }, { label: 'D', text: 'Go but walk really fast' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Always choose well-lit, busy paths. Suggest a safer route to your friend too.',
    why_text: 'Dark, empty areas can be unsafe. Staying visible keeps you safer.',
    practice_phrase: '"I\'d rather take the safe way. Let\'s go together on the main road."',
    help_prompt: 'Plan safe routes with your family and always let them know where you are.',
    difficulty: 1, age_band: '11-13', tags: ['safe places'], status: 'published' },
  { id: 'em-4', deck_id: 'emergencies', title: 'Witnessing Something Wrong',
    scenario: 'You see an older kid hurting a younger child at the park. What would you do?',
    options: [{ label: 'A', text: 'Walk away — it\'s none of your business' }, { label: 'B', text: 'Jump in and fight the older kid' }, { label: 'C', text: 'Find an adult nearby and tell them what you see' }, { label: 'D', text: 'Yell at the older kid to stop' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'Don\'t put yourself in danger. Find an adult who can safely step in and help.',
    why_text: 'Getting adult help is the safest and most effective way to stop someone from getting hurt.',
    practice_phrase: '"Excuse me, there\'s a kid being hurt over there. Can you please help?"',
    help_prompt: 'Being a good bystander means getting help, not ignoring the situation.',
    difficulty: 2, age_band: '11-13', tags: ['emergencies', 'help'], status: 'published' },
];

/* ─── Final combined cards array ─── */

export const cards: Card[] = [
  ...buildCards('4-6', deckFor_4_6, scenarios_4_6),
  ...buildCards('7-11', deckFor_7_11, scenarios_7_11),
  ...buildCards('12+', () => DECKS.JUDGMENT_12, scenarios_12_plus),
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

/** Shuffle array (Fisher-Yates) and optionally limit count */
export function getCompilationCards(limit = 10): Card[] {
  const published = cards.filter(c => c.status === 'published');
  const shuffled = [...published];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, limit);
}
