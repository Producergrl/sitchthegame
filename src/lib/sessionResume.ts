/**
 * Saves an in-progress play session so a closed tab can be resumed.
 * Stored per profile in localStorage.
 */

import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';
import { profileKey } from './profiles';

const BASE_KEY = 'sitch_session_resume_v1';
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface SavedSession {
  sessionKey: string;
  cardIds: string[];
  index: number;
  score: number;
  demerits: number;
  bonusPoints: number;
  streak: number;
  bestStreak: number;
  sessionXP: number;
  discussed: string[];
  flagged: string[];
  savedAt: number;
  label: string;
}

export function saveSession(s: SavedSession) {
  safeSetItem(profileKey(BASE_KEY), JSON.stringify(s));
}

export function loadSession(): SavedSession | null {
  try {
    const raw = safeGetItem(profileKey(BASE_KEY));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedSession;
    if (!parsed?.sessionKey || !Array.isArray(parsed.cardIds)) return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      clearSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession() {
  safeRemoveItem(profileKey(BASE_KEY));
}
