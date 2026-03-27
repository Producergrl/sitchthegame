

## Problem

The deck selection section shows **all decks from every age band** regardless of which age group is selected. When "4-6" is chosen, users see decks for 7-9, 10+, and Teens — and most 4-6 decks are locked (`is_free: false`), making them unclickable.

## Solution

**Filter decks by the selected age band** so only relevant decks appear when an age group is chosen.

## Changes

### 1. Filter decks in SessionSetup.tsx

In the deck selection grid, filter `decks` to only show those matching the current `ageBand`:

```tsx
{decks.filter(deck => deck.age_band === ageBand).map(deck => { ... })}
```

This single change ensures:
- Selecting "4-6" shows only 4-6 decks
- Switching age bands updates the visible decks immediately
- The Compilation Mix option stays visible for all age bands (it's rendered separately above the loop)

### 2. Clear deck selection on age band change

When the user switches age bands, previously selected decks from a different age band should be cleared:

```tsx
const handleAgeBandChange = (newBand: AgeBand) => {
  setAgeBand(newBand);
  setSelectedDecks([]);
};
```

### 3. Make all 4-6 decks accessible (optional consideration)

Currently only 2 of the 5 decks in the 4-6 band are `is_free: true`. There are also duplicate deck entries (e.g., both `body-boundaries-4-6` and `body-boundaries` target 4-6). If you want all decks playable, the `is_free` flags in `seedData.ts` would need updating — but that's a content/business decision.

---

**Files to modify:**
- `src/pages/SessionSetup.tsx` — filter decks by age band + clear selection on age change

