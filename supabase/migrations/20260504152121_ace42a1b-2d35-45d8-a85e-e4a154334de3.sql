-- Add explicit deny-all policies on service-only tables so RLS lint passes.
-- These tables are only accessed by edge functions using the service role,
-- which bypasses RLS. Anon/authenticated clients must have zero access.

CREATE POLICY "Deny all client access" ON public.tts_ip_hits
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "Deny all client access" ON public.tts_license_cache
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "Deny all client access" ON public.tts_usage
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);