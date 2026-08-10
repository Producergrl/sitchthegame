/**
 * Multi-child profiles.
 * Each profile gets its own XP, badges, and sticker collection by
 * namespacing the underlying localStorage keys.
 *
 * The first ("default") profile keeps the original un-suffixed keys so
 * existing players never lose progress.
 */

import { safeGetItem, safeSetItem } from './safeStorage';

export interface PlayerProfile {
  id: string;
  name: string;
  emoji: string;
}

const PROFILES_KEY = 'sitch_profiles_v1';
const ACTIVE_KEY = 'sitch_active_profile_v1';

export const DEFAULT_PROFILE_ID = 'default';
export const MAX_PROFILES = 6;

export const PROFILE_EMOJIS = ['🦊', '🐼', '🦁', '🐨', '🦄', '🐯', '🐸', '🦉', '🐙', '🐢'];

const DEFAULT_PROFILE: PlayerProfile = { id: DEFAULT_PROFILE_ID, name: 'Player 1', emoji: '🦊' };

export function loadProfiles(): PlayerProfile[] {
  try {
    const raw = safeGetItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as PlayerProfile[];
    }
  } catch { /* corrupted */ }
  return [{ ...DEFAULT_PROFILE }];
}

export function saveProfiles(profiles: PlayerProfile[]) {
  safeSetItem(PROFILES_KEY, JSON.stringify(profiles.slice(0, MAX_PROFILES)));
}

export function getActiveProfileId(): string {
  const id = safeGetItem(ACTIVE_KEY);
  if (!id) return DEFAULT_PROFILE_ID;
  const exists = loadProfiles().some(p => p.id === id);
  return exists ? id : DEFAULT_PROFILE_ID;
}

export function setActiveProfileId(id: string) {
  safeSetItem(ACTIVE_KEY, id);
  try {
    window.dispatchEvent(new CustomEvent('sitch:profile-changed', { detail: { id } }));
  } catch { /* SSR / no window */ }
}

export function getActiveProfile(): PlayerProfile {
  const id = getActiveProfileId();
  return loadProfiles().find(p => p.id === id) ?? { ...DEFAULT_PROFILE };
}

export function addProfile(name: string, emoji: string): PlayerProfile {
  const profiles = loadProfiles();
  const profile: PlayerProfile = {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim().slice(0, 20) || `Player ${profiles.length + 1}`,
    emoji,
  };
  saveProfiles([...profiles, profile]);
  return profile;
}

export function renameProfile(id: string, name: string, emoji?: string) {
  const profiles = loadProfiles().map(p =>
    p.id === id ? { ...p, name: name.trim().slice(0, 20) || p.name, emoji: emoji ?? p.emoji } : p,
  );
  saveProfiles(profiles);
}

export function deleteProfile(id: string) {
  if (id === DEFAULT_PROFILE_ID) return;
  const remaining = loadProfiles().filter(p => p.id !== id);
  saveProfiles(remaining.length > 0 ? remaining : [{ ...DEFAULT_PROFILE }]);
  // Clear that profile's saved data
  try {
    localStorage.removeItem(`wwyd-progression__${id}`);
    localStorage.removeItem(`wwyd-stickers__${id}`);
  } catch { /* storage unavailable */ }
  if (getActiveProfileId() === id) setActiveProfileId(DEFAULT_PROFILE_ID);
}

/** Namespaces a storage key to the active profile. */
export function profileKey(baseKey: string): string {
  const id = getActiveProfileId();
  return id === DEFAULT_PROFILE_ID ? baseKey : `${baseKey}__${id}`;
}
