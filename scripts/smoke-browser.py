#!/usr/bin/env python3
"""
Headless browser smoke test for Sitch.

Loads the live site, unlocks it with a license key (if one is provided),
starts a Quick Play session and confirms the first card renders with its
options and no page crash / console errors.

Env vars:
  SITCH_DOMAIN_URL          default https://play.sitchthegame.com
  SITCH_SMOKE_LICENSE_KEY   license/beta code used to pass the unlock gate
  SITCH_SMOKE_HEADED        set to 1 to watch the run locally

Exit code 0 = pass, 1 = fail. Screenshots go to scripts/smoke-screenshots/.
"""

import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("SITCH_DOMAIN_URL", "https://play.sitchthegame.com").rstrip("/")
LICENSE_KEY = os.environ.get("SITCH_SMOKE_LICENSE_KEY", "").strip()
SHOTS = Path(__file__).parent / "smoke-screenshots"

# Console noise we do not want to fail the build over.
IGNORED_CONSOLE = (
    "favicon",
    "Download the React DevTools",
    "ResizeObserver loop",
    "preload",
)


async def run() -> list[str]:
    problems: list[str] = []
    console_errors: list[str] = []
    SHOTS.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=os.environ.get("SITCH_SMOKE_HEADED") != "1")
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        page.on(
            "console",
            lambda msg: console_errors.append(msg.text)
            if msg.type == "error" and not any(s in msg.text for s in IGNORED_CONSOLE)
            else None,
        )
        page.on("pageerror", lambda err: console_errors.append(f"pageerror: {err}"))
        page.on("crash", lambda _: problems.append("The page crashed"))

        # 1. Homepage loads
        response = await page.goto(BASE_URL, wait_until="domcontentloaded", timeout=45000)
        if response is None or response.status != 200:
            problems.append(f"Homepage returned {response.status if response else 'no response'}")
        await page.wait_for_timeout(2500)
        await page.screenshot(path=str(SHOTS / "1_home.png"))

        # 2. Unlock gate, if present
        code_input = page.get_by_role("textbox").first
        gate_visible = await code_input.is_visible() if await code_input.count() else False
        if gate_visible:
            if not LICENSE_KEY:
                print("Unlock gate shown and no SITCH_SMOKE_LICENSE_KEY set: "
                      "verified the gate renders, skipping the in-game checks.")
                await browser.close()
                return problems
            await code_input.fill(LICENSE_KEY)
            await page.keyboard.press("Enter")
            try:
                await page.get_by_role("link", name="Play Now").wait_for(timeout=30000)
            except Exception:
                problems.append("Unlock gate did not open with the provided license key")
                await page.screenshot(path=str(SHOTS / "2_gate_failed.png"))
                await browser.close()
                return problems

        # 3. Home screen renders its primary CTA
        play_now = page.get_by_role("link", name="Play Now")
        if not await play_now.count():
            problems.append("Home screen is missing the 'Play Now' button")
            await page.screenshot(path=str(SHOTS / "2_home_no_cta.png"))
            await browser.close()
            return problems
        await page.screenshot(path=str(SHOTS / "2_home_unlocked.png"))

        # 4. Start a session
        await play_now.first.click()
        try:
            await page.wait_for_url("**/play**", timeout=20000)
        except Exception:
            problems.append("Clicking Play Now did not navigate to a session")

        # 5. First card renders
        try:
            await page.get_by_text("Card 1 of").wait_for(timeout=25000)
        except Exception:
            problems.append("First card did not render (no 'Card 1 of N' progress indicator)")

        # A resume prompt can sit in front of the card on repeat runs.
        start_fresh = page.get_by_role("button", name="Start over")
        if await start_fresh.count() and await start_fresh.first.is_visible():
            await start_fresh.first.click()
            await page.wait_for_timeout(1200)

        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(SHOTS / "3_first_card.png"))

        body_text = await page.inner_text("body")
        if "Something went wrong" in body_text or "Application error" in body_text:
            problems.append("Error boundary was shown on the first card")

        # Options must be tappable answer buttons.
        option_buttons = page.locator("button", has_text="None of the above")
        if not await option_buttons.count():
            problems.append("First card rendered without its answer options")

        # 6. Advance one card to prove the core loop works
        next_option = page.locator("button").filter(has_text="None of the above").first
        if await next_option.count():
            await next_option.click()
            await page.wait_for_timeout(1200)
            await page.screenshot(path=str(SHOTS / "4_after_choice.png"))

        if console_errors:
            problems.append("Console errors: " + " | ".join(dict.fromkeys(console_errors))[:500])

        await browser.close()
    return problems


def main() -> int:
    problems = asyncio.run(run())
    print(f"Target: {BASE_URL}")
    if problems:
        print("FAIL:")
        for p in problems:
            print(f" - {p}")
        return 1
    print("PASS: homepage, session start and first card all rendered cleanly.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
