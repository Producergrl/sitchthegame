
CREATE TABLE IF NOT EXISTS public.tts_usage (
  month_key TEXT PRIMARY KEY,
  chars_used BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tts_ip_hits (
  id BIGSERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  hit_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tts_ip_hits_ip_time ON public.tts_ip_hits (ip, hit_at DESC);

CREATE TABLE IF NOT EXISTS public.tts_license_cache (
  license_hash TEXT PRIMARY KEY,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tts_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tts_ip_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tts_license_cache ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role (which bypasses RLS) can access these.
