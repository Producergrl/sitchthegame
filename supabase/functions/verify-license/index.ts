import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GUMROAD_VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";
const PRODUCT_ID = "mUZK2cfq7Yxo5xNEIQzS7g==";

async function hashLicense(key: string): Promise<string> {
  const data = new TextEncoder().encode(key);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function cacheValidLicense(key: string): Promise<void> {
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE) return;
    const supabase = createClient(SUPABASE_URL, SERVICE);
    const license_hash = await hashLicense(key);
    await supabase.from("tts_license_cache").upsert({ license_hash });
  } catch (e) {
    console.error("license cache write failed:", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { license_key } = await req.json();

    if (!license_key || typeof license_key !== "string" || license_key.trim().length === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "License key is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmed = license_key.trim();
    if (trimmed.length > 200) {
      return new Response(
        JSON.stringify({ valid: false, error: "License key is too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Server-side beta tester bypass codes (comma-separated in BETA_CODES secret).
    const betaCodesRaw = Deno.env.get("BETA_CODES") ?? "";
    const betaCodes = betaCodesRaw
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    if (betaCodes.length > 0 && betaCodes.includes(trimmed.toUpperCase())) {
      await cacheValidLicense(trimmed);
      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = new URLSearchParams();
    formData.append("product_id", PRODUCT_ID);
    formData.append("license_key", trimmed);
    formData.append("increment_uses_count", "false");

    const response = await fetch(GUMROAD_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.success === true) {
      await cacheValidLicense(trimmed);
      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ valid: false, error: "Invalid license key" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("License verification error:", err);
    return new Response(
      JSON.stringify({ valid: false, error: "Verification failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
