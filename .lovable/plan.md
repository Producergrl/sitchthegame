# Gumroad Sync Is Disabled

## Rule
Do not auto-sync this project to Gumroad.

## Why
Publishing the site must never overwrite the live Gumroad product summary, price point, cover image, files, or checkout copy.

## What is allowed
- The app may link buyers to Gumroad.
- The backend may verify Gumroad license keys so buyers can unlock Sitch.
- Gumroad product details are edited manually in Gumroad only.

## What is not allowed
- No build-time Gumroad product updates.
- No publish-time Gumroad product updates.
- No admin "Sync to Gumroad" button.
- No edge function that edits Gumroad product details.
- No app config file that stores Gumroad product copy or price as a source of truth.