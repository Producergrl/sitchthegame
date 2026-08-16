CREATE TABLE public.checkout_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('checkout_click','license_verified','license_rejected')),
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.checkout_events TO anon, authenticated;
GRANT ALL ON public.checkout_events TO service_role;
ALTER TABLE public.checkout_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record a checkout event" ON public.checkout_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX checkout_events_created_at_idx ON public.checkout_events (created_at DESC);