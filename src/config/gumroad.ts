/**
 * Single source of truth for Sitch product details.
 * Edit these values to update both the website and the Gumroad listing
 * (the sync runs automatically on every build/publish).
 */
export const gumroadProduct = {
  name: 'Sitch — Family Edition',
  // Plain-text description shown on the Gumroad product page.
  description: [
    'A premium child-safety card game of choice and consequence.',
    '',
    'Real-life scenarios kids choose — and parents talk through, together.',
    '',
    'What\'s inside:',
    '• Age-banded decks (4–6, 7–9, 10+, Teens)',
    '• Discussion, Quiz, and Roleplay modes',
    '• A Safety Hub with parent resources',
    '• Earnable stickers and a progression system',
    '',
    'Play at https://play.sitchthegame.com',
  ].join('\n'),
  // Price in CENTS. e.g. 1999 = $19.99
  priceCents: 699,
  currency: 'usd',
  // Public cover image used by the website and pushed to Gumroad.
  imageUrl: 'https://sitchthegame.com/og-image.png',
} as const;

export type GumroadProduct = typeof gumroadProduct;
