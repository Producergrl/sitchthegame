export type AgeBand = '4-6' | '7-9' | '10+' | 'teens';
export type PlayStyle = 'discussion' | 'quiz' | 'roleplay';
export type CardStatus = 'draft' | 'published';

export interface CardOption {
  label: string;
  text: string;
}

export interface Card {
  id: string;
  deck_id: string;
  title: string;
  scenario: string;
  options: CardOption[];
  correct_option?: string;
  worst_option?: string;
  guidance_text: string;
  why_text: string;
  practice_phrase: string;
  help_prompt: string;
  reflection_prompts?: string[];
  difficulty: 1 | 2 | 3;
  age_band: AgeBand;
  tags: string[];
  status: CardStatus;
}

export interface Deck {
  id: string;
  slug: string;
  name: string;
  description: string;
  age_band: AgeBand;
  tags: string[];
  is_default: boolean;
  is_free: boolean;
  card_count: number;
  icon: string;
  color: string;
}

export interface Session {
  id: string;
  created_at: string;
  mode: PlayStyle;
  selected_decks: string[];
  age_band: AgeBand;
  current_card_index: number;
  cards: Card[];
  discussed_card_ids: string[];
  flagged_card_ids: string[];
  score: number;
}
