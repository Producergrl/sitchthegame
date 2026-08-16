/**
 * Single source of truth for the Gumroad checkout link.
 * Note the capital "S" in /l/Sitch: the lowercase form 301-redirects,
 * which loses UTM parameters on some browsers.
 */
export const GUMROAD_PRODUCT_URL = 'https://sitchthegame.gumroad.com/l/Sitch';

export const gumroadCheckoutUrl = (source: string) =>
  `${GUMROAD_PRODUCT_URL}?utm_source=sitch_app&utm_medium=referral&utm_campaign=${encodeURIComponent(source)}`;
