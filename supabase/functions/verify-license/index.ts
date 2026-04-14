import { corsHeaders } from "@supabase/supabase-js/cors";

const GUMROAD_VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";
const PRODUCT_PERMALINK = "Sitch";

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

    const formData = new URLSearchParams();
    formData.append("product_permalink", PRODUCT_PERMALINK);
    formData.append("license_key", license_key.trim());

    const response = await fetch(GUMROAD_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();

    if (data.success === true) {
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
