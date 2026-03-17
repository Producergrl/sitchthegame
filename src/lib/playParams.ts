import { decks, COMPILATION_DECK_ID } from '@/data/seedData';
import type { AgeBand, PlayStyle } from '@/types/game';

const VALID_AGE_BANDS: AgeBand[] = ['4-6', '7-9', '10+', 'teens'];
const VALID_MODES: PlayStyle[] = ['discussion', 'quiz', 'roleplay'];

export interface PlayParams {
  deckIds: string[];
  age: AgeBand;
  mode: PlayStyle;
}

export interface ParseResult {
  params: PlayParams;
  isValid: boolean;
}

/** Available deck slugs */
export const getAvailableDeckSlugs = (): string[] => decks.map(d => d.slug);

/** Parse raw query string values into structured params with defaults */
export function parsePlayParams(raw: {
  decks?: string | null;
  age?: string | null;
  mode?: string | null;
}): ParseResult {
  // Parse decks – match by slug or id
  const rawDecks = (raw.decks || '').split(',').map(s => s.trim()).filter(Boolean);
  const validDecks: string[] = [];
  for (const slug of rawDecks) {
    if (slug === COMPILATION_DECK_ID) {
      validDecks.push(COMPILATION_DECK_ID);
    } else {
      const found = decks.find(d => d.slug === slug || d.id === slug);
      if (found) validDecks.push(found.id);
    }
  }

  // Parse age
  const rawAge = raw.age as AgeBand;
  const validAge = VALID_AGE_BANDS.includes(rawAge) ? rawAge : null;

  // Parse mode
  const rawMode = raw.mode as PlayStyle;
  const validMode = VALID_MODES.includes(rawMode) ? rawMode : null;

  // Determine if we have enough valid params for auto-start
  const hasDecks = validDecks.length > 0;
  const isValid = hasDecks && validAge !== null && validMode !== null;

  return {
    params: {
      deckIds: hasDecks ? validDecks : [],
      age: validAge ?? '7-9',
      mode: validMode ?? 'discussion',
    },
    isValid,
  };
}

/** Build a shareable URL from current params */
export function buildPlayUrl(params: PlayParams, origin: string): string {
  const sp = new URLSearchParams({
    decks: params.deckIds.join(','),
    age: params.age,
    mode: params.mode,
  });
  return `${origin}/play?${sp.toString()}`;
}
