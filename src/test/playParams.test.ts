import { describe, it, expect } from 'vitest';
import { parsePlayParams, buildPlayUrl } from '@/lib/playParams';

describe('parsePlayParams', () => {
  it('returns isValid=true when all params are valid', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: '11-13', mode: 'discussion' });
    expect(result.isValid).toBe(true);
    expect(result.params.deckIds).toEqual(['emergencies']);
    expect(result.params.age).toBe('11-13');
    expect(result.params.mode).toBe('discussion');
  });

  it('accepts multiple comma-separated decks', () => {
    const result = parsePlayParams({ decks: 'emergencies,bullying', age: '8-10', mode: 'quiz' });
    expect(result.isValid).toBe(true);
    expect(result.params.deckIds).toEqual(['emergencies', 'bullying']);
  });

  it('filters out invalid deck slugs', () => {
    const result = parsePlayParams({ decks: 'emergencies,fake-deck', age: '11-13', mode: 'discussion' });
    expect(result.isValid).toBe(true);
    expect(result.params.deckIds).toEqual(['emergencies']);
  });

  it('returns isValid=false when decks param is missing', () => {
    const result = parsePlayParams({ decks: null, age: '8-10', mode: 'discussion' });
    expect(result.isValid).toBe(false);
    expect(result.params.deckIds).toEqual([]);
  });

  it('returns isValid=false when all deck slugs are invalid', () => {
    const result = parsePlayParams({ decks: 'nope,bad', age: '8-10', mode: 'quiz' });
    expect(result.isValid).toBe(false);
  });

  it('returns isValid=false when age is invalid', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: '99', mode: 'discussion' });
    expect(result.isValid).toBe(false);
  });

  it('falls back age to 8-10 when invalid', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: 'bad', mode: 'discussion' });
    expect(result.params.age).toBe('8-10');
  });

  it('returns isValid=false when mode is invalid', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: '11-13', mode: 'battle' });
    expect(result.isValid).toBe(false);
  });

  it('falls back mode to discussion when invalid', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: '11-13', mode: '' });
    expect(result.params.mode).toBe('discussion');
  });

  it('handles empty/null for all params', () => {
    const result = parsePlayParams({ decks: null, age: null, mode: null });
    expect(result.isValid).toBe(false);
    expect(result.params.age).toBe('8-10');
    expect(result.params.mode).toBe('discussion');
  });
});

describe('buildPlayUrl', () => {
  it('constructs a valid URL', () => {
    const url = buildPlayUrl({ deckIds: ['emergencies'], age: '10+', mode: 'discussion' }, 'https://example.com');
    expect(url).toBe('https://example.com/play?decks=emergencies&age=11-13&mode=discussion');
  });

  it('joins multiple decks with commas', () => {
    const url = buildPlayUrl({ deckIds: ['emergencies', 'bullying'], age: '8-10', mode: 'quiz' }, 'https://x.com');
    expect(url).toContain('decks=emergencies%2Cbullying');
  });
});

describe('smoke: /play?decks=emergencies&age=11-13&mode=discussion', () => {
  it('parses the canonical deep-link and marks it valid for auto-start', () => {
    const result = parsePlayParams({ decks: 'emergencies', age: '11-13', mode: 'discussion' });
    expect(result.isValid).toBe(true);
    expect(result.params).toEqual({
      deckIds: ['emergencies'],
      age: '11-13',
      mode: 'discussion',
    });
  });
});
