// Pushes product details from the website to the Gumroad product listing.
//
// Design notes:
// - The product fields below are the SINGLE SOURCE OF TRUTH for Gumroad.
//   Keep them in sync with `src/config/gumroad.ts` (the site's SEO/meta uses that one).
// - The function takes no body. It is idempotent: every call pushes the same canonical
//   values to the seller's single product, so it's safe to expose publicly.
// - Triggered automatically on every site build via a Vite plugin, and manually via
//   the "Sync to Gumroad" admin button.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PRODUCT = {
  name: 'Sitch — Family Edition',
  description: [
    'A premium child-safety card game of choice and consequence.',
    '',
    'Real-life scenarios kids choose — and parents talk through, together.',
    '',
    "What's inside:",
    '• Age-banded decks (4–6, 7–9, 10+, Teens)',
    '• Discussion, Quiz, and Roleplay modes',
    '• A Safety Hub with parent resources',
    '• Earnable stickers and a progression system',
    '',
    'Play at https://sitchthegame.com',
  ].join('\n'),
  priceCents: 1999,
  currency: 'usd',
  imageUrl: 'https://sitchthegame.com/og-image.png',
} as const;

// Lightweight in-memory throttle so the function can't be hammered.
let lastCallAt = 0;
const MIN_INTERVAL_MS = 5_000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const access = Deno.env.get('GUMROAD_ACCESS_TOKEN');
  const productId = Deno.env.get('GUMROAD_PRODUCT_ID');

  if (!access || !productId) {
    return new Response(
      JSON.stringify({ error: 'Server is missing GUMROAD_ACCESS_TOKEN or GUMROAD_PRODUCT_ID.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  const now = Date.now();
  if (now - lastCallAt < MIN_INTERVAL_MS) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'throttled' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  lastCallAt = now;

  // Gumroad PUT /v2/products/:id — form-encoded, access_token in body.
  const form = new URLSearchParams();
  form.set('access_token', access);
  form.set('name', PRODUCT.name);
  form.set('description', PRODUCT.description);
  form.set('price', String(PRODUCT.priceCents));
  form.set('currency', PRODUCT.currency);
  form.set('preview_url', PRODUCT.imageUrl);

  const res = await fetch(
    `https://api.gumroad.com/v2/products/${encodeURIComponent(productId)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    },
  );

  const bodyText = await res.text();
  let bodyJson: unknown = null;
  try { bodyJson = JSON.parse(bodyText); } catch { /* keep text */ }

  const gumroadOk = res.ok && (bodyJson as any)?.success !== false;
  if (!gumroadOk) {
    console.error('Gumroad update failed', res.status, bodyText);
    return new Response(
      JSON.stringify({ ok: false, status: res.status, error: 'Gumroad update failed' }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, pushed: PRODUCT }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
