import { supabase } from '@/integrations/supabase/client';

export type CheckoutEvent = 'checkout_click' | 'license_verified' | 'license_rejected';

/**
 * Fire-and-forget conversion tracking for the Gumroad funnel.
 * Stores no personal data and never blocks or breaks the UI.
 */
export const trackCheckoutEvent = (event_type: CheckoutEvent, source = 'unlock_gate') => {
  try {
    void supabase.from('checkout_events').insert({ event_type, source }).then(
      () => undefined,
      () => undefined,
    );
  } catch {
    /* analytics must never break gameplay */
  }
};
