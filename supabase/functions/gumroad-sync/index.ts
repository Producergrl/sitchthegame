// Pushes product details from the website to the Gumroad product listing.
//
// Security:
// - CORS is restricted to the Sitch production domains only. Browsers on any
//   other origin get no CORS headers and their preflight will fail.
// - Every request MUST include `x-sync-token` matching the GUMROAD_SYNC_TOKEN
//   secret. Server-to-server callers (the build hook) send the same header.
// - Body is ignored; the function always pushes the canonical PRODUCT below.
import { corsHeaders as baseCorsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const ALLOWED_ORIGINS = new Set([
  'https://sitchthegame.com',
  'https://www.sitchthegame.com',
  'https://play.sitchthegame.com',
]);

function corsFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  // Server-to-server calls (no Origin header) don't need CORS headers.
  if (!origin) return {};
  if (!ALLOWED_ORIGINS.has(origin)) return {};
  return {
    ...baseCorsHeaders,
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-sync-token',
    'Vary': 'Origin',
  };
}

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
  priceCents: 699,
  currency: 'usd',
  imageUrl: 'https://sitchthegame.com/og-image.png',
} as const;

// Lightweight in-memory throttle so the function can't be hammered.
let lastCallAt = 0;
const MIN_INTERVAL_MS = 5_000;

Deno.serve(async (req) => {
  const cors = corsFor(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }

  const access = Deno.env.get('GUMROAD_ACCESS_TOKEN');
  const productId = Deno.env.get('GUMROAD_PRODUCT_ID');
  const expectedToken = Deno.env.get('GUMROAD_SYNC_TOKEN');

  // Admin token gate.
  const provided = req.headers.get('x-sync-token') ?? '';
  if (!expectedToken || provided !== expectedToken) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }

  if (!access || !productId) {
    return new Response(
      JSON.stringify({ error: 'Server is missing GUMROAD_ACCESS_TOKEN or GUMROAD_PRODUCT_ID.' }),
      { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }

  const now = Date.now();
  if (now - lastCallAt < MIN_INTERVAL_MS) {
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'throttled' }),
      { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }
  lastCallAt = now;

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
      { status: 502, headers: { ...cors, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, pushed: PRODUCT }),
    { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } },
  );
});
