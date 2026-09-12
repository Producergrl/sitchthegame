// Gumroad can report success for refunded or disputed purchases.
export function purchaseAllowsAccess(data: {
  success?: boolean;
  purchase?: { refunded?: boolean; disputed?: boolean; dispute_won?: boolean; chargebacked?: boolean };
} | null | undefined): boolean {
  const purchase = data?.purchase;
  return data?.success === true && !!purchase &&
    purchase.refunded === false &&
    purchase.chargebacked !== true &&
    (purchase.disputed === false || (purchase.disputed === true && purchase.dispute_won === true));
}
