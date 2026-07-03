/**
 * Public Gumroad link details used by the website only.
 * Gumroad product copy, pricing, images, and files are edited manually in Gumroad.
 * Do not auto-sync this app to Gumroad.
 */
export const gumroadProduct = {
  name: 'Sitch — Family Edition',
  // Website-only fallback text. This is NOT pushed to Gumroad.
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
  // Price in CENTS. e.g. 699 = $6.99
  priceCents: 699,
  currency: 'usd',
  // Public cover image used by the website.
  imageUrl: 'https://sitchthegame.com/og-image.png',
} as const;

export type GumroadProduct = typeof gumroadProduct;
