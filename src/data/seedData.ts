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
  {
    id: 'body-boundaries', slug: 'body-boundaries',
    name: 'Body Boundaries & Consent',
    description: 'Learn about personal space, safe and unsafe touches, and how to speak up.',
    age_band: '4-6', tags: ['boundaries', 'consent'],
    is_default: true, is_free: true, card_count: 4, icon: '🛡️', color: 'primary',
  },
  {
    id: 'trusted-adults', slug: 'trusted-adults',
    name: 'Trusted Adults & Safe Places',
    description: 'Know who to turn to and where to go when you need help.',
    age_band: '4-6', tags: ['trusted adults', 'safe places'],
    is_default: true, is_free: false, card_count: 4, icon: '🏠', color: 'safe',
  },
  // ── 7-9 age band ──
  {
    id: 'peer-pressure-7-9', slug: 'peer-pressure-7-9',
    name: 'Peer Pressure (7–9)',
    description: 'Handle dares, vapes, and pressure from friends.',
    age_band: '7-9', tags: ['peer-pressure', 'substance-risk'],
    is_default: true, is_free: true, card_count: 0, icon: '🫸', color: 'caution',
  },
  {
    id: 'digital-safety-7-9', slug: 'digital-safety-7-9',
    name: 'Digital Safety (7–9)',
    description: 'Stay safe from strangers and scams online.',
    age_band: '7-9', tags: ['online-safety'],
    is_default: true, is_free: false, card_count: 0, icon: '💻', color: 'help',
  },
  {
    id: 'online-safety', slug: 'online-safety',
    name: 'Online & Device Safety',
    description: 'Stay safe while using phones, tablets, and the internet.',
    age_band: '7-9', tags: ['online safety', 'devices'],
    is_default: true, is_free: true, card_count: 4, icon: '📱', color: 'help',
  },
  {
    id: 'bullying', slug: 'bullying',
    name: 'Bullying & Peer Pressure',
    description: 'Handle tough social situations and stand up for yourself and others.',
    age_band: '7-9', tags: ['bullying', 'peer pressure'],
    is_default: true, is_free: false, card_count: 4, icon: '💪', color: 'secondary',
  },
  // ── 10+ age band ──
  {
    id: 'emergencies', slug: 'emergencies',
    name: 'Emergencies & Getting Help',
    description: 'Learn what to do in scary or dangerous situations.',
    age_band: '10+', tags: ['emergencies', 'help'],
    is_default: true, is_free: true, card_count: 4, icon: '🚨', color: 'caution',
  },
  // ── Teens age band ──
  {
    id: 'real-world-judgment-teens', slug: 'real-world-judgment-teens',
    name: 'Real-World Judgment (Teens)',
    description: 'Navigate adult-ish situations with confidence and common sense.',
    age_band: 'teens', tags: ['judgment', 'digital-awareness'],
    is_default: true, is_free: false, card_count: 0, icon: '🧭', color: 'gentle',
  },
];

/* ─── Helper constants & functions ─── */

const DECKS = {
  BODY_4_6: 'body-boundaries-4-6',
  TRUSTED_4_6: 'trusted-adults-4-6',
  SECRETS_4_6: 'secrets-4-6',
  PEER_7_9: 'peer-pressure-7-9',
  DIGITAL_7_9: 'digital-safety-7-9',
  JUDGMENT_TEENS: 'real-world-judgment-teens',
} as const;

const normalize = (s: string) =>
  s.replace(/[\u201C\u201D]/g, '"').replace(/[\u2019]/g, "'").replace(/\s*What would you do\?\s*$/i, '').trim();

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
  if (age === '7-9') return 'No thanks. I\'m not doing that.';
  return 'I\'m not comfortable with that. I\'m getting help.';
};

const reflectionPromptsFor = (age: AgeBand): string[] => {
  if (age === '4-6') return ['What did your tummy feel like?', 'Who is your safe grown-up to tell?'];
  if (age === '7-9') return ['Who is the best trusted adult to tell first?', 'What is one safe boundary you can set?'];
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

const deckFor_7_9 = (scenario: string) => {
  const s = scenario.toLowerCase();
  if (s.includes('online') || s.includes('text') || s.includes('phone') || s.includes('picture') || s.includes('social media') || s.includes('naked') || s.includes('photo') || s.includes('call'))
    return DECKS.DIGITAL_7_9;
  return DECKS.PEER_7_9;
};

/* ═══════════════════════════════════════════════════════════════
   Scenario data with unique, context-specific answer choices
   ═══════════════════════════════════════════════════════════════ */

interface ScenarioData {
  scenario: string;
  options: string[];          // exactly 4 options (A, B, C, D)
  correct_option: string;     // label: A, B, C, or D
  worst_option: string;       // label of the most harmful choice
}

const scenarios_4_6: ScenarioData[] = [
  { scenario: "Your friend asks you to share your snack, but you really want it all.",
    options: ["Say no and eat it all by yourself", "Share a little bit and say 'Let's share!'", "Throw the snack away so nobody gets it", "Grab their snack instead"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A grown-up at the park asks for your help finding their dog.",
    options: ["Go with them to help look for the dog", "Say 'No' and run to your grown-up right away", "Help them look but stay at the park", "Ask the grown-up what the dog looks like"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone tells you a secret that makes you feel yucky inside.",
    options: ["Keep the secret because they told you to", "Tell a grown-up you trust how you feel", "Try to forget about it", "Tell all your friends the secret"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You want to play with a toy your friend is using.",
    options: ["Grab the toy from them", "Ask 'Can I have a turn when you're done?'", "Cry until they give it to you", "Go tell a grown-up to make them share"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your teacher asks you to clean up, but you're still playing.",
    options: ["Keep playing and pretend you didn't hear", "Say 'Okay!' and start cleaning up", "Tell the teacher 'No, I'm busy'", "Hide the toys so you don't have to clean"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A grown-up you don't know offers you candy.",
    options: ["Take the candy because it looks yummy", "Say 'No thank you' and go to your grown-up", "Take it but don't eat it", "Ask them what kind of candy it is"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend wants to play rough, but it hurts.",
    options: ["Keep playing even though it hurts", "Say 'That hurts! Let's play something gentler'", "Hit them back harder", "Run away and hide"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "You accidentally knock over a tower someone built.",
    options: ["Walk away and pretend it wasn't you", "Say 'I'm sorry!' and help rebuild it", "Laugh and knock over more things", "Blame someone else for knocking it over"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "A bigger kid at school takes your ball.",
    options: ["Push them to get it back", "Tell a teacher what happened", "Let them keep it and say nothing", "Kick them until they drop it"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone says they'll only play with you if you give them your toy.",
    options: ["Give them your toy so they'll be your friend", "Say 'Real friends don't make trades to play'", "Take one of their toys first", "Give them everything they ask for"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You can't find your grown-up at the store.",
    options: ["Walk outside to look for them", "Find a store worker with a name badge and ask for help", "Go with a stranger who offers to help", "Keep walking around the store by yourself"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "A grown-up you know wants you to sit on their lap but you don't want to.",
    options: ["Sit on their lap to be polite", "Say 'No thank you, I want to sit here'", "Sit on their lap but feel bad about it", "Run to your room without saying anything"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: 'Your friend says, "Let\'s hide from the teacher."',
    options: ["Hide with them because it sounds fun", "Say 'No, the teacher needs to know where we are'", "Hide but tell the teacher later", "Dare them to hide somewhere more dangerous"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone wants to tickle you, but you don't like it.",
    options: ["Let them tickle you so they're happy", "Say 'Stop! I don't like being tickled'", "Tickle them back even harder", "Laugh and pretend you like it"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see a bug in your food.",
    options: ["Eat it anyway because you're hungry", "Tell a grown-up so they can help", "Throw the food on the floor", "Feed it to someone else"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: '"If you don\'t do this, I won\'t be your friend." What would you do?',
    options: ["Do what they say so they stay your friend", "Say 'A real friend wouldn't say that'", "Find someone else to be mean to", "Cry and do whatever they want"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone calls you a mean name.",
    options: ["Call them a meaner name back", "Tell a grown-up and say 'That hurt my feelings'", "Pretend it doesn't bother you and walk away", "Push them for being mean"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A teacher gives you the wrong snack.",
    options: ["Eat it anyway even if you can't have it", "Raise your hand and politely tell the teacher", "Throw the snack in the trash", "Take someone else's snack instead"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone says they want to take a picture of you alone.",
    options: ["Let them take the picture", "Say 'No' and tell your grown-up", "Take a picture of them first", "Go somewhere alone with them for the picture"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend is crying because they miss their mom.",
    options: ["Tell them to stop crying", "Sit with them and say 'It's okay, let's tell the teacher'", "Ignore them and keep playing", "Laugh at them for crying"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A grown-up tells you to keep a secret from your parents.",
    options: ["Keep the secret like they asked", "Tell your parents right away", "Keep the secret but feel worried about it", "Ask the grown-up why it's a secret"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You don't want to hug someone, but they keep asking.",
    options: ["Hug them so they stop asking", "Say 'I don't want a hug, but I can wave!'", "Push them away", "Hide behind your grown-up and say nothing"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone asks to see your private parts.",
    options: ["Show them because they asked nicely", "Say 'NO! That's not okay' and tell a trusted adult", "Ignore them and walk away quietly", "Show them if they promise to keep it secret"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend doesn't want to share their toy with you.",
    options: ["Grab the toy from them", "Say 'Okay, can I play with something else?'", "Tell the teacher to make them share", "Break one of their other toys"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You spill juice on the floor.",
    options: ["Walk away and pretend it wasn't you", "Tell a grown-up and help clean it up", "Blame someone else for the spill", "Pour more juice on the floor"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A grown-up says they'll give you a toy if you keep a secret.",
    options: ["Keep the secret and take the toy", "Say 'No' and tell your parents what happened", "Take the toy but tell later", "Keep the secret because you really want the toy"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You feel sick at school.",
    options: ["Don't tell anyone and try to be tough", "Tell your teacher that your tummy feels bad", "Go home without telling anyone", "Keep playing and hope it goes away"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your friend falls down and cries.",
    options: ["Laugh because it looked funny", "Help them up and ask 'Are you okay?'", "Walk away because it's not your problem", "Tell them it didn't hurt that much"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone says they will hurt your pet if you tell on them.",
    options: ["Stay quiet so they don't hurt your pet", "Tell a trusted grown-up right away — they can keep you and your pet safe", "Try to handle it by yourself", "Do whatever the person says"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You don't like the game your friend wants to play.",
    options: ["Play it anyway even though you hate it", "Say 'How about we try this game instead?'", "Get angry and refuse to play anything", "Walk away without saying anything"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "A grown-up asks you to go with them to their car.",
    options: ["Go with them because they seem nice", "Say 'No!' and run to your safe grown-up", "Go but stay near the car door", "Ask what they have in their car"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend hits you.",
    options: ["Hit them back harder", "Say 'Don't hit me!' and tell a grown-up", "Pretend it didn't hurt", "Hit them and then run away"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: 'Someone says they want to play "doctor" with you and take off clothes.',
    options: ["Play along because it sounds like a game", "Say 'No! That's not a safe game' and tell a grown-up", "Take off some clothes but not all", "Play the game if they go first"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see someone taking something that isn't theirs.",
    options: ["Help them take it", "Tell a grown-up what you saw", "Take something too", "Pretend you didn't see anything"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You lose your favorite toy at school.",
    options: ["Take someone else's toy to replace it", "Ask your teacher for help looking for it", "Cry all day and don't do anything else", "Blame someone for stealing it"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone makes fun of your clothes.",
    options: ["Make fun of their clothes back", "Say 'That's not nice' and walk to a friend or teacher", "Go home and change immediately", "Never wear those clothes again"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: 'Your friend says, "Let\'s not tell anyone what we just did."',
    options: ["Promise not to tell anyone", "Say 'If it's something wrong, I need to tell a grown-up'", "Don't tell but feel worried", "Tell all the other kids but not grown-ups"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A grown-up keeps tickling you even when you say stop.",
    options: ["Let them keep going and try to laugh", "Say 'STOP! I said stop!' and walk to another grown-up", "Kick them to make them stop", "Laugh so they think you like it"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see your friend push another kid.",
    options: ["Push the other kid too", "Say 'That's not okay' and check on the kid who got pushed", "Walk away and pretend you didn't see it", "Cheer your friend on"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone asks you to come into a room alone with them.",
    options: ["Go with them because they asked politely", "Say 'No' and stay where other people can see you", "Go but leave the door open", "Go if they promise it will be quick"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You feel scared about going to a friend's house.",
    options: ["Go anyway and don't tell anyone you're scared", "Tell your grown-up how you feel before you go", "Refuse to go but don't say why", "Go but hide how you feel"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your teacher yells loudly and it scares you.",
    options: ["Yell back at the teacher", "Tell another trusted adult how it made you feel", "Cry quietly and don't tell anyone", "Act like you're not scared"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone touches your bottom and says it's a game.",
    options: ["Play the game since they said it's just playing", "Say 'Don't touch me there!' and tell a trusted grown-up", "Move away but don't tell anyone", "Touch them back because it's a game"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend wants you to run away from school with them.",
    options: ["Run away with them for an adventure", "Say 'That's not safe, let's stay at school'", "Let them go alone and say nothing", "Run away but come back before anyone notices"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone shows you a phone picture that makes you uncomfortable.",
    options: ["Look at it and don't say anything", "Say 'I don't want to see that' and tell a grown-up", "Show the picture to your friends", "Take the phone and delete the picture"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "You need to go potty but you're shy to ask.",
    options: ["Hold it until you get home", "Raise your hand and ask your teacher to go", "Have an accident because you're too shy", "Ask a friend to tell the teacher for you"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "A grown-up wants you to keep a surprise from your parents.",
    options: ["Keep it if it's a happy surprise like a birthday", "Ask your parents if it's okay to have secrets from them", "Always keep any secret a grown-up tells you", "Keep the surprise but feel worried about it"],
    correct_option: 'A', worst_option: 'C' },
  { scenario: "Someone hugs you too tightly and it hurts.",
    options: ["Let them keep hugging because they mean well", "Say 'Too tight! Please let go' and step back", "Push them away as hard as you can", "Cry but don't say anything"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You don't know where your classroom is.",
    options: ["Walk around the whole school by yourself", "Ask a teacher or staff member to help you find it", "Go outside the school to look", "Sit on the floor and cry"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your friend won't let you sit with them at lunch.",
    options: ["Knock their food off the table", "Find another friend to sit with and tell a teacher if it keeps happening", "Skip lunch because you're too sad", "Sit there anyway and force your way in"],
    correct_option: 'B', worst_option: 'A' },
];

const scenarios_7_11: ScenarioData[] = [
  { scenario: "Your friend wants to cheat on a test and asks for your answers.",
    options: ["Give them your answers so they don't get in trouble", "Say 'I can't do that, but I can help you study later'", "Cheat together so you both get good grades", "Ignore them and hope they stop asking"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Someone keeps sending you mean texts.",
    options: ["Send mean texts back to them", "Save the texts, block them, and show a trusted adult", "Delete the texts and pretend it's not happening", "Forward the texts to everyone you know"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A teacher says something that makes you feel uncomfortable.",
    options: ["Ignore it because teachers are always right", "Tell a parent or another trusted adult what the teacher said", "Talk back to the teacher in class", "Post about it on social media"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend dares you to steal candy from the store.",
    options: ["Steal it because it's just candy", "Say 'No, that's stealing' and suggest buying it instead", "Watch while your friend steals it", "Dare them to steal something bigger"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone you trust asks you to lie for them.",
    options: ["Lie for them because you trust them", "Say 'I'm not comfortable lying — let's talk about what happened'", "Lie but feel bad about it later", "Tell them you'll lie but then tell the truth"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A stranger online asks where you live.",
    options: ["Tell them your city but not your address", "Don't share any personal info and tell a trusted adult", "Give them a fake address", "Tell them so they can send you something cool"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend invites you over, but their older sibling makes you feel uneasy.",
    options: ["Go and try to avoid the sibling", "Tell your parent how you feel and make a plan together", "Go but pretend everything is fine", "Tell your friend you don't like their sibling"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Someone offers you a vape pen at school.",
    options: ["Try it once to see what it's like", "Say 'No thanks' and walk away", "Hold it for them but don't use it", "Take a video of yourself trying it"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You see your friend getting bullied.",
    options: ["Join in so the bully likes you", "Get a teacher or trusted adult to help right away", "Walk away because it's not your problem", "Film it on your phone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend says they want to run away.",
    options: ["Help them pack and plan their escape", "Listen to them and tell a trusted adult who can help", "Ignore them — they probably don't mean it", "Dare them to do it"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone touches your leg under the table and it feels wrong.",
    options: ["Stay quiet so it doesn't get awkward", "Move away, say 'Don't touch me,' and tell a trusted adult", "Touch their leg back to show it's uncomfortable", "Move away but don't tell anyone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend wants to watch a movie your parents wouldn't allow.",
    options: ["Watch it and don't tell your parents", "Say 'My parents wouldn't want me to watch this, let's pick something else'", "Watch part of it and stop if it gets bad", "Watch it and lie if your parents ask"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone says they'll hurt you if you tell.",
    options: ["Stay quiet because you're scared", "Tell a trusted adult right away — they can keep you safe", "Try to handle it on your own", "Threaten them back"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You're at a friend's house and their parents start fighting loudly.",
    options: ["Try to stop the fight yourself", "Call your parent and ask to be picked up", "Stay and pretend nothing is happening", "Record the fight on your phone"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You see a teacher hitting a student.",
    options: ["Assume the student deserved it", "Tell another trusted adult or your parent immediately", "Film it and post it online", "Confront the teacher yourself"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A grown-up buys you gifts often but asks for hugs and kisses in return.",
    options: ["Give hugs and kisses because they bought you gifts", "Tell a trusted adult — gifts shouldn't come with conditions", "Accept the gifts but feel uneasy", "Ask for more gifts and give the hugs"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone says they can make you famous if you keep a secret.",
    options: ["Keep the secret because you want to be famous", "Say 'No' and tell a trusted adult what they said", "Ask what the secret is first", "Agree and tell your friends about it"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend asks you to sneak out at night.",
    options: ["Sneak out because it sounds exciting", "Say 'That's not safe — let's make plans for the weekend instead'", "Sneak out but come back quickly", "Go but tell your parents where you're going"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone sends you a picture of themselves naked.",
    options: ["Send one back since they shared first", "Don't look, close it, and tell a trusted adult", "Save it on your phone", "Forward it to your friends"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You see your friend stealing lunch money.",
    options: ["Help them steal so you both get lunch", "Talk to your friend privately and suggest they get help", "Steal money too since they're doing it", "Tell everyone in the class what they did"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your coach keeps asking you to come to practice early, alone.",
    options: ["Go early alone because the coach asked", "Tell your parent about the request before going", "Go early but bring a friend", "Go early and don't tell anyone"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone calls you names because of how you look.",
    options: ["Call them names back about their looks", "Tell a trusted adult and remember their words aren't true", "Change how you look so they stop", "Post about them online to get back at them"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You find out your friend is self-harming.",
    options: ["Promise to keep it a secret", "Tell a trusted adult right away — your friend needs help", "Try to fix it yourself by talking to them", "Ignore it because it's their body"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your teacher tells you to keep a secret from your parents.",
    options: ["Keep the secret because the teacher said to", "Tell your parents what the teacher said", "Keep the secret but worry about it", "Ask the teacher why it has to be a secret"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone says they want to be your boyfriend/girlfriend but asks for photos.",
    options: ["Send photos because they like you", "Say 'I'm not sending photos' and tell a trusted adult", "Send a regular selfie — what's the harm?", "Send photos if they send theirs first"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend brings a weapon to school.",
    options: ["Think it's cool and ask to see it", "Tell a teacher or trusted adult immediately", "Keep it a secret so your friend doesn't get in trouble", "Take the weapon and hide it yourself"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A grown-up touches your back and it feels uncomfortable.",
    options: ["Let them because they probably don't mean anything by it", "Move away and say 'Please don't touch me' and tell another adult", "Touch their back the same way", "Freeze and don't say anything"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend dares you to jump off something dangerous.",
    options: ["Jump to prove you're brave", "Say 'That's not safe, and I don't need to prove anything'", "Tell someone else to jump first", "Jump but try to land carefully"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone wants you to go into a room alone with them after school.",
    options: ["Go with them since they seem friendly", "Say 'No' and stay where other people are", "Go but text a friend where you are", "Go if they promise to leave the door open"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend starts crying and says they want to die.",
    options: ["Tell them they're being dramatic", "Stay with them and tell a trusted adult right away", "Promise not to tell anyone", "Try to cheer them up with a joke"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A classmate keeps copying your homework.",
    options: ["Let them copy every time to stay friends", "Say 'I can help you learn it, but I can't let you copy'", "Start giving them wrong answers on purpose", "Copy someone else's work too"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You lose your lunch money.",
    options: ["Take money from someone else's bag", "Tell a teacher or lunch staff so they can help", "Skip lunch and don't tell anyone", "Steal food from the cafeteria"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone tries to pull your pants down as a joke.",
    options: ["Laugh it off because everyone else is laughing", "Say 'That's not funny' and report it to a teacher", "Pull their pants down to get even", "Ignore it and hope it doesn't happen again"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "You see someone being mean to your sibling.",
    options: ["Fight the person being mean", "Tell a trusted adult and comfort your sibling", "Ignore it because siblings need to handle their own problems", "Join in to make the bully like you"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend keeps asking to touch you.",
    options: ["Let them because they're your friend", "Say 'No means no' firmly and tell a trusted adult", "Touch them back so it's even", "Avoid them without telling anyone why"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You're invited to a sleepover but feel uneasy.",
    options: ["Go and push through the uneasy feeling", "Talk to your parent about why you feel uneasy", "Go but sneak your phone to call if needed", "Make up a lie about why you can't go"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A coach tells you to change in front of them.",
    options: ["Change in front of them because they're the coach", "Say 'I'd like to change in private' and tell your parent", "Change quickly and don't think about it", "Ask other players if the coach asks them too"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You're offered a ride home by someone you don't know well.",
    options: ["Get in because they know your name", "Say 'No thank you' and call your parent for a ride", "Get in but sit near the door", "Ask them questions to see if they're safe"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone tells you their parents hurt them.",
    options: ["Tell them it's probably not that bad", "Believe them and help them tell a trusted adult", "Promise to keep it a secret", "Tell them to just behave better at home"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend keeps asking you to swear or use bad words.",
    options: ["Start swearing so they stop bothering you", "Say 'I don't want to do that' and change the topic", "Swear but only when no adults are around", "Record them swearing and show a teacher"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see inappropriate pictures on someone's phone.",
    options: ["Look at them because you're curious", "Walk away and tell a trusted adult what you saw", "Take a photo of them to show others", "Ask to see more pictures"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your teacher blames you for something you didn't do.",
    options: ["Yell 'That's not fair!' in front of everyone", "Stay calm and explain what happened — ask to talk privately", "Accept the blame and stay quiet", "Storm out of the classroom"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend wants to skip school.",
    options: ["Skip school together for a fun day", "Say 'I can't miss class, let's hang out after school'", "Skip school but go back before it ends", "Tell on them immediately in front of everyone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend keeps calling you at night and you're tired.",
    options: ["Stay up all night talking to be a good friend", "Say 'I need sleep — let's talk tomorrow at school'", "Block their number without telling them", "Get angry and yell at them to stop calling"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone asks you to keep a secret about touching.",
    options: ["Keep the secret because they asked you to", "Tell a trusted adult right away — touching secrets are never okay", "Wait and see if it happens again first", "Tell your friends but not an adult"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend wants to prank call someone.",
    options: ["Do it because it's just a joke", "Say 'That could scare someone or get us in trouble'", "Do it but block your number first", "Film the prank call for social media"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You see someone hurting an animal.",
    options: ["Ignore it because it's just an animal", "Tell a trusted adult or call animal control", "Try to take the animal away by yourself", "Join in because everyone else is watching"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your parents are fighting loudly.",
    options: ["Try to stop the fight by getting between them", "Go to a safe spot and call a trusted adult like a grandparent", "Scream at them to stop", "Leave the house alone without telling anyone"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone touches your hair or face without permission.",
    options: ["Let them because it's not a big deal", "Step back and say 'Please don't touch me without asking'", "Grab their hand and push it away roughly", "Touch their face back"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend pressures you to do something you know is wrong.",
    options: ["Do it so they don't think you're boring", "Say 'No, that's not something I want to do' and walk away", "Do it but blame them if you get caught", "Pressure someone else to do it instead"],
    correct_option: 'B', worst_option: 'D' },
];

const scenarios_12_plus: ScenarioData[] = [
  { scenario: "Someone you like offers you alcohol at a party.",
    options: ["Have a drink to fit in and impress them", "Say 'No thanks, I'm good' and hold a non-alcoholic drink", "Take it but just hold it without drinking", "Drink it fast so nobody notices"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your coach texts you late at night about personal things.",
    options: ["Reply because they're your coach and you respect them", "Show the texts to a parent or guardian right away", "Reply but keep it short", "Delete the texts and pretend it didn't happen"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You find out your friend is being abused at home.",
    options: ["Mind your own business — family stuff is private", "Believe them and help them talk to a trusted adult or counselor", "Confront their parents yourself", "Post about it online to get attention for their situation"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "A friend shares nudes and asks for yours.",
    options: ["Send yours since they shared first", "Say 'I'm not doing that' — sharing nudes can have serious consequences", "Take a photo but don't send it yet", "Save their photos on your phone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone older offers you a modeling job with photos in a private place.",
    options: ["Go because it could be a real opportunity", "Say no and tell a trusted adult — legitimate jobs don't work this way", "Go but bring a friend", "Research them online and then decide"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend says they want to end their life.",
    options: ["Tell them they're overreacting", "Take them seriously, stay with them, and tell a trusted adult immediately", "Promise to keep it between you two", "Give them space and check on them later"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see someone being sexually harassed in the hallway.",
    options: ["Keep walking — it's not your problem", "Find a teacher or staff member and report what you saw", "Film it as evidence on your phone", "Confront the harasser yourself"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A teacher keeps commenting on your body.",
    options: ["Take it as a compliment and say thanks", "Document what they say and tell a parent or school counselor", "Ignore it — teachers say weird things", "Confront the teacher in front of the class"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone threatens to share your secrets online.",
    options: ["Do whatever they want so they don't share", "Tell a trusted adult and save evidence of the threats", "Threaten to share their secrets too", "Pay them to keep quiet"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You're offered drugs at school.",
    options: ["Try them once to see what the big deal is", "Say 'No' firmly and remove yourself from the situation", "Take them but don't use them", "Report the person anonymously"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A stranger online wants to meet you in person.",
    options: ["Meet them in a public place to be safe", "Never meet anyone from online alone — tell a parent", "Meet them but tell a friend where you'll be", "Video call them first to make sure they're real"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend wants to shoplift at the mall.",
    options: ["Go along with it since everyone does it", "Say 'That's stealing — I don't want any part of it'", "Stand watch while they do it", "Film them shoplifting as a joke"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You see a friend harming themselves in the bathroom.",
    options: ["Walk out and pretend you didn't see anything", "Stay calm, let them know you care, and get a trusted adult immediately", "Promise to keep it secret if they stop", "Take a photo as proof"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your boyfriend/girlfriend pressures you to have sex.",
    options: ["Do it because you don't want to lose them", "Say 'I'm not ready, and a good partner would respect that'", "Give in but feel bad about it", "Break up with them immediately without talking"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone shares a sexual video in your group chat.",
    options: ["Watch it since everyone else did", "Leave the chat, don't share it, and tell a trusted adult", "Save it but don't forward it", "Reply with laughing emojis so nobody thinks you're weird"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "You're at a party where everyone is drinking.",
    options: ["Have a few drinks to blend in", "Find the people not drinking and call a parent if you need a ride", "Hold a cup but don't drink from it", "Challenge someone to a drinking game"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend drives drunk.",
    options: ["Get in the car — they seem fine to drive", "Refuse to get in and call a trusted adult for a ride", "Get in but tell them to drive slowly", "Take their keys and drive yourself even without a license"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your teacher singles you out for special treatment.",
    options: ["Enjoy the attention — you must be their favorite", "Tell a parent or counselor — special treatment can be a warning sign", "Keep it a secret so other students don't get jealous", "Ask the teacher for even more special treatment"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You're in a car and the driver starts speeding dangerously.",
    options: ["Stay quiet because you don't want to distract them", "Calmly ask them to slow down and call for help if they won't", "Encourage them to go faster", "Grab the steering wheel"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Someone makes racist or sexist jokes around you.",
    options: ["Laugh along so you're not the odd one out", "Say 'That's not cool' or walk away and talk to an adult if needed", "Make an even worse joke to show them how it feels", "Post about them online to publicly shame them"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your friend gets very sick at a party.",
    options: ["Leave them to sleep it off", "Stay with them, turn them on their side, and call for help", "Give them more water and hope they get better", "Film them and post it as a joke"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone you know says they were sexually assaulted.",
    options: ["Ask them what they were wearing or doing", "Believe them, listen, and help them talk to a trusted adult", "Tell them to just forget about it", "Spread the story to warn others"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend asks you to cover for them with their parents.",
    options: ["Lie for them no matter what", "Ask what they're actually doing — if it's unsafe, say 'I can't lie about that'", "Agree but feel uncomfortable about it", "Lie for them but hold it over them later"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You get sent a nude photo by someone.",
    options: ["Forward it to your friends", "Delete it and tell a trusted adult — possessing it can be illegal", "Save it in case you need it later", "Send one back since they sent theirs first"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend shows you a weapon they brought to school.",
    options: ["Ask to hold it because you're curious", "Tell a teacher, counselor, or administrator immediately", "Keep it secret so your friend doesn't get expelled", "Post about it on social media"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone keeps staring at your body at the gym.",
    options: ["Stare back at them aggressively", "Move to a different area and tell a staff member if it continues", "Change your workout clothes to cover up more", "Take their photo and post it online"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend says they're pregnant and scared.",
    options: ["Tell them it's their own fault", "Listen without judging and help them find a trusted adult to talk to", "Tell everyone at school about it", "Tell them what you think they should do"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your teacher asks to connect with you on social media.",
    options: ["Accept — they're just being friendly", "Politely decline and tell a parent — teachers have professional boundaries", "Accept but don't interact with their posts", "Screenshot it and show your friends"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone wants you to skip school for a day out.",
    options: ["Skip because one day won't matter", "Say 'Let's plan something for the weekend instead'", "Skip but go back before last period", "Skip and post about your day on social media"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend is vaping and offers it to you.",
    options: ["Try it once — it can't hurt", "Say 'No thanks, I'm good' — vaping has real health risks", "Hold it but don't inhale", "Tell them vaping is for losers"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see a stranger following you on the way home.",
    options: ["Confront them and ask why they're following you", "Go to the nearest safe public place and call a trusted adult", "Run home and lock the door", "Speed up but keep walking alone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend wants to send hate messages to someone.",
    options: ["Help write the messages", "Say 'That's cyberbullying and could have serious consequences'", "Let them send the messages — it's not from your account", "Watch them type it but don't participate"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone wants you to come to their house but no one else is home.",
    options: ["Go because you know them", "Say 'I'll check with my parent first' and only go if a parent approves", "Go but tell a friend where you are", "Go but keep your phone ready"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your partner asks you to send something you're uncomfortable with.",
    options: ["Send it to keep the relationship going", "Say 'I'm not comfortable with that, and you should respect that'", "Send it but make sure your face isn't in it", "Ask them to send first before you decide"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend keeps asking to borrow money but never pays back.",
    options: ["Keep lending because friends help each other", "Say 'I can't lend more until you pay back what you owe'", "Lend but complain about it to everyone", "Take something of theirs until they pay you back"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "You feel unsafe walking home alone after dark.",
    options: ["Walk fast and hope nothing happens", "Call a parent for a ride or walk with a group on a well-lit path", "Take a shortcut through a dark alley to get home faster", "Put headphones on to feel braver"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Someone grabs you at a crowded event.",
    options: ["Stay quiet because it's crowded and nobody will hear", "Move away firmly, say 'Don't touch me!' and find security or a trusted adult", "Grab them back to make them stop", "Leave the event by yourself"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see a drink left unattended at a party.",
    options: ["Drink it if you're thirsty", "Don't touch it — tell the person their drink was unattended", "Move it so nobody else drinks it", "Pour it out without telling anyone"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone offers you pills to help you study.",
    options: ["Take them because exams are important", "Say 'No' — taking someone else's medication is dangerous and illegal", "Take one and see how it goes", "Save them for when you really need them"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend wants to hack someone's account.",
    options: ["Help them because it sounds fun", "Say 'That's illegal and could ruin both your lives'", "Let them do it but don't get involved yourself", "Hack a different account together instead"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your sibling is crying and won't tell you why.",
    options: ["Tell them to grow up and stop crying", "Sit with them, let them know you're there, and tell a parent if you're worried", "Force them to tell you what's wrong", "Ignore them — everyone cries sometimes"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "A friend is dating someone much older.",
    options: ["Think it's cool that they have an older partner", "Express concern and tell a trusted adult — large age gaps can be predatory", "Mind your own business", "Tell everyone at school about the relationship"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone threatens to hurt your family if you tell.",
    options: ["Stay silent to protect your family", "Tell a trusted adult immediately — they can protect your family and you", "Try to handle the situation by yourself", "Make counter-threats to scare them"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Your friend wants to run away from home.",
    options: ["Help them pack and plan where to go", "Listen to why they want to leave and help them talk to a counselor or trusted adult", "Tell them running away will solve everything", "Go with them so they're not alone"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "A teacher offers you a ride home.",
    options: ["Accept because you know them", "Politely decline and call your parent — teachers shouldn't give solo rides", "Accept but text your parent where you are", "Accept because the weather is bad"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Someone touches you in a way that feels wrong but says it's \"normal.\"",
    options: ["Believe them since they're older and know more", "Trust your instincts — if it feels wrong, it IS wrong. Tell a trusted adult.", "Ask other people if it's normal", "Let it continue but feel uncomfortable"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "Your friend keeps making jokes about harming themselves.",
    options: ["Laugh along because they're just jokes", "Take it seriously, ask if they're okay, and tell a trusted adult", "Make jokes back to show them it's not funny", "Ignore it — people joke about everything"],
    correct_option: 'B', worst_option: 'A' },
  { scenario: "You see a child being yelled at aggressively by a parent in public.",
    options: ["Confront the parent yourself", "If the child seems in danger, tell a trusted adult or call for help", "Film it and post it online", "Walk away — it's none of your business"],
    correct_option: 'B', worst_option: 'C' },
  { scenario: "Your friend is unconscious after drinking.",
    options: ["Leave them to sleep it off", "Put them in the recovery position and call emergency services immediately", "Give them coffee or water to wake them up", "Take funny photos of them"],
    correct_option: 'B', worst_option: 'D' },
  { scenario: "Someone tells you they put something in another person's drink.",
    options: ["Keep quiet because you don't want drama", "Warn the person immediately and tell a trusted adult or security", "Pour the drink out secretly and say nothing", "Film the situation as evidence but don't intervene"],
    correct_option: 'B', worst_option: 'A' },
];

/* ─── Card builder ─── */

const LABELS = ['A', 'B', 'C', 'D'];

const buildCards = (age: AgeBand, deckFn: (scenario: string) => string, scenarios: ScenarioData[]): Card[] =>
  scenarios.map((data, idx) => {
    const scenario = normalize(data.scenario);
    const id = `${age === 'teens' ? 'TEENS' : age === '10+' ? '10PLUS' : age}-${String(idx + 1).padStart(3, '0')}`;
    return {
      id,
      deck_id: deckFn(scenario),
      title: makeTitle(scenario),
      scenario,
      options: data.options.map((text, i) => ({ label: LABELS[i], text })),
      correct_option: data.correct_option,
      worst_option: data.worst_option,
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
  // ── 4-6: Body Boundaries & Consent ──
  { id: 'bb-1', deck_id: 'body-boundaries', title: 'The Unwanted Hug',
    scenario: 'A family friend wants to give you a big hug, but you don\'t feel like being hugged right now. What would you do?',
    options: [{ label: 'A', text: 'Hug them even though you don\'t want to' }, { label: 'B', text: 'Say "No thank you, I\'d rather wave hello!"' }, { label: 'C', text: 'Run away without saying anything' }, { label: 'D', text: 'Ask a parent if you have to hug them' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'You always have the right to say no to any touch that makes you uncomfortable, even from people you know.',
    why_text: 'Your body belongs to you. Politely saying no teaches others to respect your boundaries.',
    practice_phrase: '"No thank you — I\'d prefer a wave or a high-five!"',
    help_prompt: 'Talk to your parent or guardian about body boundaries.',
    difficulty: 1, age_band: '4-6', tags: ['boundaries', 'consent'], status: 'published' },
  { id: 'bb-2', deck_id: 'body-boundaries', title: 'The Secret Touch',
    scenario: 'Someone touches you in a way that feels wrong and tells you to keep it a secret. What would you do?',
    options: [{ label: 'A', text: 'Keep the secret because they told you to' }, { label: 'B', text: 'Tell a trusted adult right away' }, { label: 'C', text: 'Forget about it and move on' }, { label: 'D', text: 'Tell your best friend' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Safe secrets are fun surprises. Unsafe secrets make you feel bad inside. Always tell a trusted adult about unsafe secrets.',
    why_text: 'No one should ever ask you to keep a secret about touching. Telling an adult is brave and the right thing to do.',
    practice_phrase: '"This doesn\'t feel right. I need to tell someone I trust."',
    help_prompt: 'Tell a parent, teacher, or another trusted adult immediately.',
    difficulty: 2, age_band: '4-6', tags: ['boundaries', 'secrets'], status: 'published' },
  { id: 'bb-3', deck_id: 'body-boundaries', title: 'Changing Clothes',
    scenario: 'You\'re changing clothes at a friend\'s house and their older sibling walks in without knocking. What would you do?',
    options: [{ label: 'A', text: 'Say "Please knock! I\'m changing" and cover up' }, { label: 'B', text: 'Ignore it because it\'s not a big deal' }, { label: 'C', text: 'Feel embarrassed but say nothing' }, { label: 'D', text: 'Tell your friend\'s parent what happened' }],
    correct_option: 'A', worst_option: 'C', guidance_text: 'Everyone deserves privacy when changing. Speaking up helps set a clear boundary.',
    why_text: 'Asking for privacy is not rude — it\'s healthy. If it keeps happening, tell a trusted adult.',
    practice_phrase: '"Please knock before coming in — I need privacy!"',
    help_prompt: 'Talk to your parent about rules for privacy at other homes.',
    difficulty: 1, age_band: '4-6', tags: ['boundaries', 'privacy'], status: 'published' },
  { id: 'bb-4', deck_id: 'body-boundaries', title: 'The Tickle Game',
    scenario: 'Your cousin keeps tickling you and won\'t stop even though you said stop. What would you do?',
    options: [{ label: 'A', text: 'Laugh and hope they stop eventually' }, { label: 'B', text: 'Say "STOP! I said stop and I mean it!"' }, { label: 'C', text: 'Hit them back' }, { label: 'D', text: 'Walk away and tell an adult' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'When you say stop, people must listen. If they don\'t, walk away and get help.',
    why_text: 'Stop means stop — always. This is an important boundary everyone should respect.',
    practice_phrase: '"I said stop. Please respect that."',
    help_prompt: 'Tell a parent or guardian if someone won\'t stop when you ask.',
    difficulty: 1, age_band: '4-6', tags: ['boundaries', 'consent'], status: 'published' },
  // ── 4-6: Trusted Adults & Safe Places ──
  { id: 'ta-1', deck_id: 'trusted-adults', title: 'Who Do You Trust?',
    scenario: 'Something is making you worried and you need to talk to someone. Who would be the best person to tell?',
    options: [{ label: 'A', text: 'A stranger who seems nice' }, { label: 'B', text: 'A parent, teacher, or family member you trust' }, { label: 'C', text: 'Nobody — you should handle it yourself' }, { label: 'D', text: 'Post about it online' }],
    correct_option: 'B', worst_option: 'C', guidance_text: 'Trusted adults are people you know well who always want to keep you safe.',
    why_text: 'You never have to handle scary things alone. Trusted adults are there to help.',
    practice_phrase: '"I need to talk to you about something that\'s worrying me."',
    help_prompt: 'Make a list of 3-5 trusted adults you can always go to.',
    difficulty: 1, age_band: '4-6', tags: ['trusted adults'], status: 'published' },
  { id: 'ta-2', deck_id: 'trusted-adults', title: 'Lost at the Store',
    scenario: 'You get separated from your parent at a big store and can\'t find them. What would you do?',
    options: [{ label: 'A', text: 'Walk out of the store to look for them' }, { label: 'B', text: 'Go with a stranger who offers to help find them' }, { label: 'C', text: 'Find a store worker (with a name badge) and ask for help' }, { label: 'D', text: 'Stay where you are and cry' }],
    correct_option: 'C', worst_option: 'B', guidance_text: 'Store workers with name badges are safe people to ask for help. They can make an announcement to find your parent.',
    why_text: 'Staying in the store and finding an employee is the safest choice.',
    practice_phrase: '"I\'m lost. Can you help me find my mom/dad? Their name is ___."',
    help_prompt: 'Practice a plan with your parent about what to do if you get separated.',
    difficulty: 1, age_band: '4-6', tags: ['safe places', 'strangers'], status: 'published' },
  { id: 'ta-3', deck_id: 'trusted-adults', title: 'The Offer of a Ride',
    scenario: 'Someone you don\'t know well pulls up in a car and offers you a ride home. What would you do?',
    options: [{ label: 'A', text: 'Get in if they know your name' }, { label: 'B', text: 'Say "No thank you" and quickly go to a safe place' }, { label: 'C', text: 'Ask them who sent them' }, { label: 'D', text: 'Get in because it\'s a long walk' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Never get in a car with someone unless your parent told you it was okay. Go to a safe place and tell a trusted adult.',
    why_text: 'Safe adults won\'t ask kids they don\'t know well to get in their car.',
    practice_phrase: '"No thank you! My parent didn\'t tell me about this."',
    help_prompt: 'Have a family password that only trusted people know.',
    difficulty: 2, age_band: '4-6', tags: ['strangers', 'safe places'], status: 'published' },
  { id: 'ta-4', deck_id: 'trusted-adults', title: 'The Worried Feeling',
    scenario: 'You told a trusted adult about a problem, but nothing seems to change. What would you do?',
    options: [{ label: 'A', text: 'Give up and stop talking about it' }, { label: 'B', text: 'Keep telling trusted adults until someone helps' }, { label: 'C', text: 'Decide it\'s not important' }, { label: 'D', text: 'Handle it by yourself' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'If one adult doesn\'t help, tell another one. Keep speaking up until you get the help you need.',
    why_text: 'Sometimes the first person you tell might not understand. Never stop speaking up.',
    practice_phrase: '"I told someone before but I still need help. Can you help me?"',
    help_prompt: 'Remember: it\'s never your fault, and you deserve to be helped.',
    difficulty: 2, age_band: '4-6', tags: ['trusted adults'], status: 'published' },
  // ── 7-9: Online & Device Safety ──
  { id: 'os-1', deck_id: 'online-safety', title: 'The Friend Request',
    scenario: 'Someone you don\'t know sends you a friend request on a game and says they\'re a kid your age. What would you do?',
    options: [{ label: 'A', text: 'Accept — they said they\'re your age' }, { label: 'B', text: 'Don\'t accept and tell a parent about it' }, { label: 'C', text: 'Accept but don\'t share personal info' }, { label: 'D', text: 'Ask them to prove they\'re a kid first' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'People online can pretend to be anyone. Never accept requests from strangers.',
    why_text: 'You can\'t verify who someone really is online. A trusted adult can help you decide.',
    practice_phrase: '"I don\'t accept friend requests from people I don\'t know in real life."',
    help_prompt: 'Show your parent the request and talk about online safety rules.',
    difficulty: 1, age_band: '7-9', tags: ['online safety', 'strangers'], status: 'published' },
  { id: 'os-2', deck_id: 'online-safety', title: 'The Personal Info Quiz',
    scenario: 'A fun quiz online asks for your full name, school name, and birthday. What would you do?',
    options: [{ label: 'A', text: 'Fill it in — it\'s just a fun quiz' }, { label: 'B', text: 'Make up fake answers' }, { label: 'C', text: 'Skip the quiz and tell a parent about it' }, { label: 'D', text: 'Only share your first name' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'Quizzes that ask for personal information can be tricks to collect your data.',
    why_text: 'Personal info can be used to find or trick you. Always check with a parent first.',
    practice_phrase: '"I never share my personal information online without asking a parent first."',
    help_prompt: 'Ask your parent before filling out anything online.',
    difficulty: 1, age_band: '7-9', tags: ['online safety', 'privacy'], status: 'published' },
  { id: 'os-3', deck_id: 'online-safety', title: 'The Scary Message',
    scenario: 'Someone sends you a message that says "I know where you live" while you\'re playing a game. What would you do?',
    options: [{ label: 'A', text: 'Reply and tell them to stop' }, { label: 'B', text: 'Ignore and keep playing' }, { label: 'C', text: 'Block them and tell a trusted adult immediately' }, { label: 'D', text: 'Ask them what they mean' }],
    correct_option: 'C', worst_option: 'A', guidance_text: 'Scary messages should always be reported. Block the person and tell an adult right away.',
    why_text: 'Responding can make things worse. Adults can help you report and stay safe.',
    practice_phrase: '"I\'m going to block this person and show this to my parent right now."',
    help_prompt: 'Show the message to your parent or guardian immediately.',
    difficulty: 2, age_band: '7-9', tags: ['online safety', 'bullying'], status: 'published' },
  { id: 'os-4', deck_id: 'online-safety', title: 'The Photo Request',
    scenario: 'Someone online asks you to send a photo of yourself. What would you do?',
    options: [{ label: 'A', text: 'Send a regular photo — what\'s the harm?' }, { label: 'B', text: 'Say no and tell a trusted adult' }, { label: 'C', text: 'Send a photo of your pet instead' }, { label: 'D', text: 'Ask them why they want it first' }],
    correct_option: 'B', worst_option: 'A', guidance_text: 'Never send photos of yourself to people online, even if they seem friendly.',
    why_text: 'Once a photo is shared online, you can\'t control where it goes.',
    practice_phrase: '"I don\'t share photos of myself online. I\'m going to tell my parent about this."',
    help_prompt: 'Tell a parent or guardian about any photo requests.',
    difficulty: 2, age_band: '7-9', tags: ['online safety', 'privacy'], status: 'published' },
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
  ...buildCards('7-9', deckFor_7_9, scenarios_7_11),
  ...buildCards('teens', () => DECKS.JUDGMENT_TEENS, scenarios_12_plus),
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
