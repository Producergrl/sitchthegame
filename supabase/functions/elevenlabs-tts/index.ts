import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-sitch-license",
};

const BUCKET = "tts-cache";
const MAX_TEXT_LENGTH = 500;

const ALLOWED_VOICE_IDS = new Set<string>(["Vy1TILrv7cgImnJ6mEmh"]);
const DEFAULT_VOICE_ID = "Vy1TILrv7cgImnJ6mEmh";

const MONTHLY_CHAR_LIMIT = 500_000;
const PER_LICENSE_MONTHLY_CHAR_LIMIT = 50_000;
const PER_IP_PER_MINUTE = 20;

const ALLOWED_ORIGINS = new Set<string>([
  "https://sitchthegame.com",
  "https://www.sitchthegame.com",
  "https://sitchthegame.lovable.app",
]);
const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovableproject.com"];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // non-browser callers (curl/tests) — license check still gates them
  try {
    const u = new URL(origin);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    if (ALLOWED_ORIGINS.has(origin)) return true;
    return ALLOWED_ORIGIN_SUFFIXES.some((s) => u.hostname.endsWith(s));
  } catch {
    return false;
  }
}

function currentMonthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0].trim() || req.headers.get("cf-connecting-ip") || "unknown";
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function cacheKey(text: string, voiceId: string): Promise<string> {
  const data = new TextEncoder().encode(`${voiceId}::${text}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const hex = new TextDecoder().decode(hexEncode(new Uint8Array(hash)));
  return `${hex}.mp3`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Origin allowlist ────────────────────────────────────────
    const origin = req.headers.get("origin");
    if (!isOriginAllowed(origin)) {
      console.warn("Blocked origin:", origin);
      return new Response(
        JSON.stringify({ error: "Origin not allowed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Best-effort cleanup of stale rate-limit rows (ignore errors).
    supabase
      .from("tts_ip_hits")
      .delete()
      .lt("hit_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .then(({ error }) => { if (error) console.warn("ip_hits cleanup:", error.message); });

    // ── Server-side license check ───────────────────────────────
    const licenseKey = req.headers.get("x-sitch-license")?.trim() ?? "";
    if (!licenseKey || licenseKey.length > 200) {
      return new Response(
        JSON.stringify({ error: "License required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const licenseHash = await sha256Hex(licenseKey);
    const { data: licenseRow, error: licenseErr } = await supabase
      .from("tts_license_cache")
      .select("license_hash, expires_at")
      .eq("license_hash", licenseHash)
      .maybeSingle();
    if (licenseErr || !licenseRow) {
      return new Response(
        JSON.stringify({ error: "License not recognized. Please re-enter your unlock code." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (licenseRow.expires_at && new Date(licenseRow.expires_at).getTime() < Date.now()) {
      return new Response(
        JSON.stringify({ error: "License needs to be re-verified. Please re-enter your unlock code." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { text, voiceId } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    // ── Input validation ────────────────────────────────────────
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return new Response(JSON.stringify({ error: "Text cannot be empty" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const requestedVoice = typeof voiceId === "string" && voiceId.length > 0 ? voiceId : DEFAULT_VOICE_ID;
    if (!ALLOWED_VOICE_IDS.has(requestedVoice)) {
      return new Response(JSON.stringify({ error: "Voice not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const voice = requestedVoice;

    const fileName = await cacheKey(trimmedText, voice);

    // ── 1. Check cache ──────────────────────────────────────────
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(fileName, 60);

    if (existing?.signedUrl) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
      return new Response(JSON.stringify({ cachedUrl: publicUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── 2. Generate via ElevenLabs ──────────────────────────────
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    // Persistent per-IP rate limit (only counts cache misses).
    const ip = getClientIp(req);
    const windowStartIso = new Date(Date.now() - 60_000).toISOString();
    const { count: recentHits } = await supabase
      .from("tts_ip_hits")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("hit_at", windowStartIso);

    if ((recentHits ?? 0) >= PER_IP_PER_MINUTE) {
      console.warn("Rate limited IP:", ip);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    await supabase.from("tts_ip_hits").insert({ ip });

    // Persistent monthly character cap.
    const monthKey = currentMonthKey();
    const { data: usageRow } = await supabase
      .from("tts_usage")
      .select("chars_used")
      .eq("month_key", monthKey)
      .maybeSingle();
    const usedThisMonth = Number(usageRow?.chars_used ?? 0);

    if (usedThisMonth + trimmedText.length > MONTHLY_CHAR_LIMIT) {
      console.error("Monthly TTS quota reached:", { monthKey, usedThisMonth, limit: MONTHLY_CHAR_LIMIT });
      return new Response(
        JSON.stringify({ error: "Monthly audio quota reached. Please try again next month." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (usedThisMonth + trimmedText.length > MONTHLY_CHAR_LIMIT * 0.8) {
      console.warn("TTS usage above 80% of monthly quota:", { monthKey, usedThisMonth, limit: MONTHLY_CHAR_LIMIT });
    }

    // Per-license monthly cap so a single buyer can't drain the global quota.
    const { data: licUsageRow } = await supabase
      .from("tts_license_usage")
      .select("chars_used")
      .eq("license_hash", licenseHash)
      .eq("month_key", monthKey)
      .maybeSingle();
    const licUsedThisMonth = Number(licUsageRow?.chars_used ?? 0);
    if (licUsedThisMonth + trimmedText.length > PER_LICENSE_MONTHLY_CHAR_LIMIT) {
      console.warn("Per-license quota reached", { monthKey, licUsedThisMonth });
      return new Response(
        JSON.stringify({ error: "Monthly audio limit reached for this unlock code." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const elResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.15,
            use_speaker_boost: true,
            speed: 0.90,
          },
        }),
      }
    );

    if (!elResponse.ok) {
      const errorText = await elResponse.text();
      let detail: any = {};
      try { detail = JSON.parse(errorText)?.detail ?? {}; } catch {}

      const mappedStatus =
        detail?.status === "quota_exceeded" ? 402 :
        detail?.status === "missing_permissions" ? 403 :
        detail?.status === "rate_limited" ? 429 :
        elResponse.status;

      console.error("ElevenLabs API error:", { httpStatus: elResponse.status, detail });

      return new Response(
        JSON.stringify({
          error: "ElevenLabs API error",
          httpStatus: elResponse.status,
          mappedStatus,
          elevenlabs: { status: detail?.status, message: detail?.message },
        }),
        {
          status: mappedStatus,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const audioBuffer = await elResponse.arrayBuffer();

    // Persist monthly usage counters (chars actually sent).
    const newTotal = usedThisMonth + trimmedText.length;
    const newLicTotal = licUsedThisMonth + trimmedText.length;
    await Promise.all([
      supabase
        .from("tts_usage")
        .upsert({ month_key: monthKey, chars_used: newTotal, updated_at: new Date().toISOString() }),
      supabase
        .from("tts_license_usage")
        .upsert({
          license_hash: licenseHash,
          month_key: monthKey,
          chars_used: newLicTotal,
          updated_at: new Date().toISOString(),
        }),
    ]);

    // ── 3. Store in cache (fire-and-forget) ─────────────────────
    supabase.storage
      .from(BUCKET)
      .upload(fileName, audioBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      })
      .then(({ error }) => {
        if (error) console.error("Cache upload error:", error.message);
        else console.log("Cached TTS audio:", fileName);
      });

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (e) {
    console.error("TTS error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
