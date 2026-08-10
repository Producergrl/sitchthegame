/**
 * Mission-based progression system.
 * Persisted to localStorage under key "wwyd-progression".
 */

import { safeGetItem, safeSetItem, safeRemoveItem } from './safeStorage';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  missionsRequired: number;
}

export interface PlayerLevel {
  level: number;
  title: string;
  icon: string;
  xpRequired: number;
}

export interface PlayerProgress {
  totalXP: number;
  missionsCompleted: number;
  badgesEarned: string[];
  completedCardIds: string[];
}

// ── Level Definitions ──

export const LEVELS: PlayerLevel[] = [
  { level: 1, title: 'Safety Scout', icon: '🔍', xpRequired: 0 },
  { level: 2, title: 'Boundary Defender', icon: '🛡️', xpRequired: 30 },
  { level: 3, title: 'Truth Defender', icon: '⚔️', xpRequired: 80 },
  { level: 4, title: 'Agency Champion', icon: '🏆', xpRequired: 150 },
];

// ── Badge Definitions (unlocked every 5 missions) ──

export const BADGES: Badge[] = [
  { id: 'first-five', name: 'First Steps', icon: '⭐', description: 'Complete 5 missions', missionsRequired: 5 },
  { id: 'ten-strong', name: 'Getting Stronger', icon: '💪', description: 'Complete 10 missions', missionsRequired: 10 },
  { id: 'fifteen-wise', name: 'Wise Owl', icon: '🦉', description: 'Complete 15 missions', missionsRequired: 15 },
  { id: 'twenty-brave', name: 'Brave Heart', icon: '❤️‍🔥', description: 'Complete 20 missions', missionsRequired: 20 },
  { id: 'twenty-five-hero', name: 'Safety Hero', icon: '🦸', description: 'Complete 25 missions', missionsRequired: 25 },
  { id: 'thirty-legend', name: 'Legend', icon: '👑', description: 'Complete 30 missions', missionsRequired: 30 },
];

// ── XP Awards ──

export const XP_CORRECT = 10;
export const XP_BONUS = 15;
export const XP_DEMERIT = -5;
export const XP_MISSION_COMPLETE = 5;

// ── Helpers ──

const BASE_STORAGE_KEY = 'wwyd-progression';
const STORAGE_KEY = () => profileKey(BASE_STORAGE_KEY);

const DEFAULT_PROGRESS: PlayerProgress = { totalXP: 0, missionsCompleted: 0, badgesEarned: [], completedCardIds: [] };

export function loadProgress(): PlayerProgress {
  const raw = safeGetItem(STORAGE_KEY());
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch { /* corrupted data */ }
  }
  return { ...DEFAULT_PROGRESS };
}

export function saveProgress(p: PlayerProgress) {
  safeSetItem(STORAGE_KEY, JSON.stringify(p));
}

export function resetProgress() {
  safeRemoveItem(STORAGE_KEY);
}

export function getCurrentLevel(xp: number): PlayerLevel {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl;
  }
  return current;
}

export function getNextLevel(xp: number): PlayerLevel | null {
  const current = getCurrentLevel(xp);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export function getXPProgress(xp: number): { current: number; max: number; percent: number } {
  const currentLvl = getCurrentLevel(xp);
  const nextLvl = getNextLevel(xp);
  if (!nextLvl) return { current: xp, max: xp, percent: 100 };
  const current = xp - currentLvl.xpRequired;
  const max = nextLvl.xpRequired - currentLvl.xpRequired;
  return { current, max, percent: Math.min((current / max) * 100, 100) };
}

export function getNewBadges(missions: number, alreadyEarned: string[]): Badge[] {
  return BADGES.filter(b => missions >= b.missionsRequired && !alreadyEarned.includes(b.id));
}

export function completeMission(
  progress: PlayerProgress,
  cardId: string,
  earnedXP: number,
): { progress: PlayerProgress; newBadges: Badge[]; levelledUp: boolean; oldLevel: PlayerLevel } {
  const oldLevel = getCurrentLevel(progress.totalXP);

  const updated: PlayerProgress = {
    totalXP: Math.max(0, progress.totalXP + earnedXP + XP_MISSION_COMPLETE),
    missionsCompleted: progress.missionsCompleted + 1,
    badgesEarned: [...progress.badgesEarned],
    completedCardIds: [...progress.completedCardIds, cardId],
  };

  const newBadges = getNewBadges(updated.missionsCompleted, updated.badgesEarned);
  updated.badgesEarned.push(...newBadges.map(b => b.id));

  const newLevel = getCurrentLevel(updated.totalXP);
  const levelledUp = newLevel.level > oldLevel.level;

  saveProgress(updated);

  return { progress: updated, newBadges, levelledUp, oldLevel };
}
