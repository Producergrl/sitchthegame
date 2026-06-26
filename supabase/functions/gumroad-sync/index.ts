// Pushes product details from the website to the Gumroad product listing.
// Auth: requires header `x-sync-token` matching the GUMROAD_SYNC_TOKEN secret.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const BodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(10000),
  priceCents: z.number().int().min(0).max(10_000_00),
  currency: z.string().min(3).max(8).optional(),
  imageUrl: z.string().url().optional(),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const token = Deno.env.get('GUMROAD_SYNC_TOKEN');
  const access = Deno.env.get('GUMROAD_ACCESS_TOKEN');
  const productId = Deno.env.get('GUMROAD_PRODUCT_ID');

  if (!token || !access || !productId) {
    return new Response(
      JSON.stringify({ error: 'Server is missing Gumroad configuration.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  if (req.headers.get('x-sync-token') !== token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let raw: unknown;
  try { raw = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
  const { name, description, priceCents, currency, imageUrl } = parsed.data;

  // Gumroad PUT /v2/products/:id — form-encoded, access_token in body.
  const form = new URLSearchParams();
  form.set('access_token', access);
  form.set('name', name);
  form.set('description', description);
  form.set('price', String(priceCents));
  if (currency) form.set('currency', currency);
  if (imageUrl) form.set('preview_url', imageUrl);

  const gumroadRes = await fetch(
    `https://api.gumroad.com/v2/products/${encodeURIComponent(productId)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    },
  );

  const bodyText = await gumroadRes.text();
  let bodyJson: unknown = null;
  try { bodyJson = JSON.parse(bodyText); } catch { /* keep text */ }

  if (!gumroadRes.ok) {
    return new Response(
      JSON.stringify({
        error: 'Gumroad update failed',
        status: gumroadRes.status,
        details: bodyJson ?? bodyText,
      }),
      { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, gumroad: bodyJson ?? bodyText }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
