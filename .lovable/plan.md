# Gumroad Sync Plan

## What this will do
When you publish your Lovable site, the product name, description, price, and cover image on your Gumroad product page will update to match what's on the site. This is one-way sync: Lovable → Gumroad.

## What we need from you first

### 1. Gumroad Access Token
This is a secret password that lets the site talk to Gumroad on your behalf.

How to get it:
1. Go to https://gumroad.com/settings/advanced
2. Scroll to the **"Applications"** section
3. Click **"Create a new application"** or **"Generate Access Token"**
4. Copy the long token that appears

### 2. Gumroad Product ID
This is the ID of the product you already created for Sitch.

How to get it:
1. Go to https://gumroad.com/products
2. Click **Edit** on the Sitch product
3. Look at the URL in your browser. It will look like:
   `https://gumroad.com/dash/products/abc123/edit`
4. The part after `/products/` and before `/edit` is your product ID (e.g., `abc123`)

## How the sync will work

Because Lovable does not expose a "publish" webhook, the sync will happen in two ways:

1. **Automatic on every build** (including publish): a small script runs as part of the site build and calls the backend sync function. This is the closest we can get to "on publish" without a native Lovable hook.
2. **Manual button**: an admin-only "Sync to Gumroad" button on the site that you can press anytime to force an update.

## What we will build

### Backend
- A new secure edge function `gumroad-sync` that:
  - Receives product details from the site build
  - Calls the Gumroad API to update the product
  - Uses your saved access token
  - Returns a success or error message

### Frontend config
- A single source-of-truth file `src/config/gumroad.ts` that holds:
  - Product name
  - Short description
  - Price (in cents, e.g., `1999` for $19.99)
  - Currency
- The existing home page SEO title and description will be read from this file so the public site and Gumroad always match.

### Build-time automation
- A Vite plugin that runs at the end of every build and calls the `gumroad-sync` function.
- If the sync fails, the build still completes and the site still publishes; the error is logged.

### Manual admin button
- A hidden admin button at the bottom of the home page (after the adult gate) that says "Sync to Gumroad" and triggers the sync immediately.

## Secrets we will store
- `GUMROAD_ACCESS_TOKEN`: your long access token from Gumroad
- `GUMROAD_PRODUCT_ID`: your product ID
- Both are stored securely and never sent to the browser.

## Next step
Please confirm you want to proceed, then create your Gumroad token and product ID and paste them when I ask. I will then build the sync and store the secrets for you.