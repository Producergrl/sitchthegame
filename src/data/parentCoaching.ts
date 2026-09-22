import { AgeBand } from '@/types/game';

export interface CoachingGuide {
  /** Calm one line the grown-up can open with, whatever the child chose. */
  opener: string;
  /** Two or three gentle moves that keep the conversation going. */
  steps: string[];
  /** What to say if the child picked a risky or tempting answer. */
  ifRiskyChoice: string;
  /** A warm closing line so the card ends on safety, not worry. */
  closer: string;
  /** Short reminder of tone for this age. */
  toneNote: string;
}

export const parentCoaching: Record<AgeBand, CoachingGuide> = {
  '4-6': {
    opener: 'Start warm: "Thanks for telling me what you would do. Can you show me with your voice?"',
    steps: [
      'Let them act out the words once, standing up, using their big voice.',
      'Name the feeling in simple words: "Sometimes our tummy feels funny. That feeling is helping us."',
      'Finish with the plan: "Say no, go, and tell. Who would you tell?"',
    ],
    ifRiskyChoice: 'Keep it light and never scold. Try: "That is what lots of kids would pick. Let us practise a different one together."',
    closer: 'End with a hug and this: "You can always tell me anything, and you will never be in trouble for telling."',
    toneNote: 'Short sentences, playful voice, practise rather than explain.',
  },
  '7-9': {
    opener: 'Open with curiosity: "Tell me why you picked that one. I want to hear your thinking."',
    steps: [
      'Ask what the person in the story might say next, so they plan a second step.',
      'Talk through their safety network: name three people, not just one.',
      'Agree one small practise action, like saying the words out loud or finding a safe place at school.',
    ],
    ifRiskyChoice: 'Normalise it first: "That is a really common choice because it feels polite. What could you do instead if it happened for real?"',
    closer: 'Close with reassurance: "Your job is to tell me. My job is to sort it out."',
    toneNote: 'Concrete and matter of fact. Stay calm even if the topic is heavy.',
  },
  '10+': {
    opener: 'Invite their reasoning: "What made that feel like the right move to you?"',
    steps: [
      'Ask what would make it hard to do the safest thing in real life, then problem solve that together.',
      'Agree on a practical signal, like a code word or a text they can send that means come and get me, no questions.',
      'Name two adults besides you they could go to if you were not reachable.',
    ],
    ifRiskyChoice: 'Avoid correcting straight away. Ask: "What would happen next if you did that?" and let them find the gap themselves.',
    closer: 'Finish with trust: "You will never get in trouble with me for getting yourself out of something."',
    toneNote: 'Respect their independence. Fewer rules, more planning.',
  },
  teens: {
    opener: 'Keep it level: "I am not testing you. I just want to know how you would handle it."',
    steps: [
      'Ask what a friend of theirs would realistically do, which is often easier to talk about than themselves.',
      'Talk about the real cost of the tempting option, socially as well as legally, without lecturing.',
      'Agree an exit plan: who they call, what they say, and how they get home.',
    ],
    ifRiskyChoice: 'Stay neutral and curious: "I get why that feels easiest. What would you want someone to do for you in that moment?"',
    closer: 'End with an open door: "Call me at any hour. I will pick you up first and talk later."',
    toneNote: 'Adult to adult. No judgement, no scare tactics, no interrogation.',
  },
};
