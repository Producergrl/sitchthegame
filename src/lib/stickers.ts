/**
 * Collectible digital sticker reward system.
 * Persisted to localStorage under key "wwyd-stickers".
 */

import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  unlockType: 'missions' | 'streak' | 'level' | 'special';
  unlockValue: number;
}

export const STICKERS: Sticker[] = [
  // Mission milestones
  { id: 'loud-proud', name: 'Loud & Proud', emoji: '📢', description: 'Complete your first mission', color: 'bg-primary', unlockType: 'missions', unlockValue: 1 },
  { id: 'boundary-ranger', name: 'Boundary Ranger', emoji: '🏕️', description: 'Complete 3 missions', color: 'bg-safe', unlockType: 'missions', unlockValue: 3 },
  { id: 'captain-truth', name: 'Captain of Truth', emoji: '⚡', description: 'Complete 7 missions', color: 'bg-accent', unlockType: 'missions', unlockValue: 7 },
  { id: 'safe-champ', name: 'Safe Like A Champ', emoji: '🥊', description: 'Complete 12 missions', color: 'bg-secondary', unlockType: 'missions', unlockValue: 12 },
  { id: 'voice-hero', name: 'Voice Hero', emoji: '🎤', description: 'Complete 18 missions', color: 'bg-help', unlockType: 'missions', unlockValue: 18 },
  { id: 'shield-master', name: 'Shield Master', emoji: '🛡️', description: 'Complete 25 missions', color: 'bg-primary', unlockType: 'missions', unlockValue: 25 },

  // Streak milestones
  { id: 'streak-starter', name: 'On A Roll', emoji: '🔥', description: 'Reach a 3-answer safety streak', color: 'bg-caution', unlockType: 'streak', unlockValue: 3 },
  { id: 'streak-blaze', name: 'Blazing Trail', emoji: '☄️', description: 'Reach a 5-answer safety streak', color: 'bg-destructive', unlockType: 'streak', unlockValue: 5 },
  { id: 'streak-legend', name: 'Unstoppable', emoji: '💎', description: 'Reach a 10-answer safety streak', color: 'bg-gentle', unlockType: 'streak', unlockValue: 10 },

  // Level milestones
  { id: 'scout-star', name: 'Scout Star', emoji: '🔍', description: 'Reach Level 1: Safety Scout', color: 'bg-primary', unlockType: 'level', unlockValue: 1 },
  { id: 'defender-badge', name: 'Defender Badge', emoji: '🛡️', description: 'Reach Level 2: Boundary Defender', color: 'bg-safe', unlockType: 'level', unlockValue: 2 },
  { id: 'truth-seal', name: 'Truth Seal', emoji: '⚔️', description: 'Reach Level 3: Truth Defender', color: 'bg-accent', unlockType: 'level', unlockValue: 3 },
  { id: 'champion-crown', name: 'Champion Crown', emoji: '👑', description: 'Reach Level 4: Agency Champion', color: 'bg-secondary', unlockType: 'level', unlockValue: 4 },
];

// ── Persistence ──

const STORAGE_KEY = 'wwyd-stickers';

export interface StickerProgress {
  earnedIds: string[];
  bestStreak: number;
}

const DEFAULT_STICKER_PROGRESS: StickerProgress = { earnedIds: [], bestStreak: 0 };

export function loadStickerProgress(): StickerProgress {
  const raw = safeGetItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch { /* corrupted data */ }
  }
  return { ...DEFAULT_STICKER_PROGRESS };
}

export function saveStickerProgress(p: StickerProgress) {
  safeSetItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetStickerProgress() {
  safeRemoveItem(STORAGE_KEY);
}

export function checkNewStickers(
  progress: StickerProgress,
  missionsCompleted: number,
  currentStreak: number,
  playerLevel: number,
): Sticker[] {
  const newStickers: Sticker[] = [];

  for (const sticker of STICKERS) {
    if (progress.earnedIds.includes(sticker.id)) continue;

    let earned = false;
    switch (sticker.unlockType) {
      case 'missions':
        earned = missionsCompleted >= sticker.unlockValue;
        break;
      case 'streak':
        earned = currentStreak >= sticker.unlockValue || progress.bestStreak >= sticker.unlockValue;
        break;
      case 'level':
        earned = playerLevel >= sticker.unlockValue;
        break;
    }

    if (earned) newStickers.push(sticker);
  }

  return newStickers;
}

export function awardStickers(
  progress: StickerProgress,
  newStickers: Sticker[],
  currentStreak: number,
): StickerProgress {
  const updated: StickerProgress = {
    earnedIds: [...progress.earnedIds, ...newStickers.map(s => s.id)],
    bestStreak: Math.max(progress.bestStreak, currentStreak),
  };
  saveStickerProgress(updated);
  return updated;
}
