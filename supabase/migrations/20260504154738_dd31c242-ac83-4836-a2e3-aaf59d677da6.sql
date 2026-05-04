
-- 1. License cache TTL
ALTER TABLE public.tts_license_cache
  ADD COLUMN IF NOT EXISTS expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days');

-- Backfill existing rows (already covered by default, but make explicit)
UPDATE public.tts_license_cache SET expires_at = now() + interval '30 days' WHERE expires_at IS NULL;

-- 2. Per-license monthly usage
CREATE TABLE IF NOT EXISTS public.tts_license_usage (
  license_hash text NOT NULL,
  month_key text NOT NULL,
  chars_used bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (license_hash, month_key)
);

ALTER TABLE public.tts_license_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny all client access" ON public.tts_license_usage;
CREATE POLICY "Deny all client access"
  ON public.tts_license_usage
  AS PERMISSIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 3. Index for tts_ip_hits cleanup / lookups
CREATE INDEX IF NOT EXISTS idx_tts_ip_hits_ip_time ON public.tts_ip_hits (ip, hit_at DESC);
CREATE INDEX IF NOT EXISTS idx_tts_ip_hits_hit_at ON public.tts_ip_hits (hit_at);
