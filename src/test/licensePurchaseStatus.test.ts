import { describe, expect, it } from 'vitest';
import { purchaseAllowsAccess } from '../../supabase/functions/verify-license/purchase-status';

describe('Gumroad purchase entitlement', () => {
  const purchase = { refunded: false, disputed: false, dispute_won: false, chargebacked: false };
  it('allows an active purchase', () => expect(purchaseAllowsAccess({ success: true, purchase })).toBe(true));
  it.each([
    { refunded: true }, { disputed: true }, { chargebacked: true },
    { refunded: true, disputed: true, dispute_won: true },
  ])('denies revoked purchase %j even with API success', flags => {
    expect(purchaseAllowsAccess({ success: true, purchase: { ...purchase, ...flags } })).toBe(false);
  });
  it('restores a won dispute when neither refunded nor charged back', () => {
    expect(purchaseAllowsAccess({ success: true, purchase: { ...purchase, disputed: true, dispute_won: true } })).toBe(true);
  });
  it('fails closed for incomplete or unsuccessful responses', () => {
    for (const data of [null, {}, { success: true }, { success: true, purchase: {} }, { success: false, purchase }]) {
      expect(purchaseAllowsAccess(data)).toBe(false);
    }
  });
});
