/**
 * Stores "Wow-Me" custom answers per session so an adult facilitator
 * can review them later from the session recap.
 */
import { safeGetItem, safeSetItem } from './safeStorage';

const STORAGE_KEY = 'sitch_wow_responses_v1';
const MAX_SESSIONS = 20;

export interface WowResponse {
  cardId: string;
  cardTitle: string;
  scenario: string;
  answer: string;
  timestamp: number;
}

export interface WowSession {
  sessionId: string;
  startedAt: number;
  ageBand: string;
  mode: string;
  responses: WowResponse[];
}

function readAll(): WowSession[] {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: WowSession[]) {
  const trimmed = sessions.slice(-MAX_SESSIONS);
  safeSetItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function saveWowResponse(
  sessionId: string,
  meta: { ageBand: string; mode: string },
  response: WowResponse,
) {
  const all = readAll();
  let session = all.find(s => s.sessionId === sessionId);
  if (!session) {
    session = {
      sessionId,
      startedAt: Date.now(),
      ageBand: meta.ageBand,
      mode: meta.mode,
      responses: [],
    };
    all.push(session);
  }
  // Replace any prior answer for the same card in this session
  session.responses = session.responses.filter(r => r.cardId !== response.cardId);
  session.responses.push(response);
  writeAll(all);
}

export function getSessionResponses(sessionId: string): WowResponse[] {
  return readAll().find(s => s.sessionId === sessionId)?.responses ?? [];
}

export function getAllWowSessions(): WowSession[] {
  return readAll().sort((a, b) => b.startedAt - a.startedAt);
}
