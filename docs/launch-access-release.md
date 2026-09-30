# Sitch access fixes — release notes

Prepared September 12, 2026. This branch is not a production deployment.

## Changes

- Public /legal, /privacy, /terms and /access-help routes. Gameplay remains gated.
- Receipt recovery link, returning-player guidance, device-local progress explanation and Safari/Chrome home-screen instructions.
- Preserve saved keys on temporary verification errors without granting access.
- Use ordinary checkout-link navigation to prevent duplicate checkout windows.
- Reject refunded, charged-back and unresolved disputed Gumroad purchases even when the API reports success. Won disputes restore access only when not refunded or charged back. Existing server-configured beta keys remain supported.
- Update privacy descriptions to match license transmission, hashed records, rate-limit IP records and local nicknames.

## Release dependencies

1. Review and merge the branch, then publish the frontend through the existing Lovable workflow.
2. Deploy the `verify-license` Supabase function together with `purchase-status.ts` through the project's existing backend deployment workflow. Publishing the frontend alone does not establish that the function was deployed. Preserve existing environment secrets and product IDs.
3. Confirm /privacy, /terms and /access-help work without a key on the live domain. Confirm /play still requires a key.
4. Use an owner-provided test purchase/key to check normal verification, recovery after an outage and revoked purchase behavior. Do not create a real charge merely to test. Unit tests use simulated responses; they do not certify live Gumroad or deployed backend state.
5. Check Safari on a physical iPhone and Chrome on Android: add the icon, reopen, verify access, close and return. Internet is still required; progress is browser-local and installation may require entering the key again.

## Separate marketing homepage change

The source for sitchthegame.com was not located in this game repository or saved project files. In the homepage header and near its purchase button add:

`<a href="https://play.sitchthegame.com/">Already purchased? Play Sitch</a>`

The public Gumroad description should also use https://play.sitchthegame.com/ as its play address. The owner confirmed the private purchase receipt already links directly to the game. These external page edits are not included in this branch.

## Validation

Production build and TypeScript checks pass. 37 tests pass; the existing opt-in live-domain test is skipped. Tests cover public legal/help routes, gated gameplay routes, successful retry after an outage, rejected keys, refunds, chargebacks, disputes and incomplete API responses. Physical phone installation and a real licensed game session still need validation before release.

References: https://gumroad.com/help/article/76-license-keys and https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt
