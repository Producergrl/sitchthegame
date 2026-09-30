DROP POLICY IF EXISTS "Anyone can record a checkout event" ON public.checkout_events;
CREATE POLICY "Visitors can record valid checkout events"
ON public.checkout_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  event_type IN ('checkout_click', 'license_verified', 'license_rejected')
  AND source = 'unlock_gate'
  AND created_at BETWEEN now() - interval '1 minute' AND now() + interval '1 minute'
);