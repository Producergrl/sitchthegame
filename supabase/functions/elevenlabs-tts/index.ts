import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ElevenLabsErrorDetail = {
  status?: string;
  message?: string;
};

function mapElevenLabsStatus(httpStatus: number, detailStatus?: string) {
  // ElevenLabs sometimes returns 401 for non-auth issues; remap common cases so the client can react appropriately.
  switch (detailStatus) {
    case "quota_exceeded":
      return 402;
    case "missing_permissions":
      return 403;
    case "rate_limited":
      return 429;
    default:
      return httpStatus;
  }
}

async function readElevenLabsError(res: Response): Promise<{ raw: string; detail?: ElevenLabsErrorDetail }> {
  const raw = await res.text();
  try {
    const parsed = JSON.parse(raw);
    const detail = (parsed?.detail ?? parsed?.error?.detail) as ElevenLabsErrorDetail | undefined;
    return { raw, detail };
  } catch {
    return { raw };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'text' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voice = voiceId || "Vy1TILrv7cgImnJ6mEmh"; // Kerry's voice

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
            speed: 0.92,
          },
        }),
      }
    );

    if (!response.ok) {
      const { raw, detail } = await readElevenLabsError(response);
      const mappedStatus = mapElevenLabsStatus(response.status, detail?.status);

      console.error("ElevenLabs API error:", {
        httpStatus: response.status,
        mappedStatus,
        detailStatus: detail?.status,
        detailMessage: detail?.message,
        raw,
      });

      return new Response(
        JSON.stringify({
          error: "ElevenLabs API error",
          httpStatus: response.status,
          mappedStatus,
          elevenlabs: {
            status: detail?.status,
            message: detail?.message,
          },
        }),
        {
          status: mappedStatus,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const audioBuffer = await response.arrayBuffer();

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
