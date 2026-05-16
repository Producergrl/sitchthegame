import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

/**
 * Regression guard: TTS / Read-Aloud was fully removed by user request.
 * See mem://constraints/no-read-aloud — do not re-introduce narration.
 *
 * This test fails if any of the forbidden strings reappear in the app code.
 * Excludes: node_modules, dist, lockfiles, generated Supabase types,
 * historical SQL migrations, and this test file itself.
 */
describe("No Read-Aloud / TTS regression", () => {
  it("contains no narration/TTS references in app code", () => {
    const patterns = [
      "read[- ]?aloud",
      "\\btts\\b",
      "elevenlabs",
      "speechsynthesis",
      "speechSynthesisUtterance",
      "narration",
      "narrate",
      "text[- ]to[- ]speech",
    ];

    const args = [
      "rg -ni --hidden",
      "-g '!node_modules'",
      "-g '!dist'",
      "-g '!*.lock'",
      "-g '!bun.lockb'",
      "-g '!src/integrations/supabase/types.ts'",
      "-g '!supabase/migrations/*'",
      "-g '!src/test/noTtsRegression.test.ts'",
      ...patterns.map((p) => `-e '${p}'`),
      ".",
    ].join(" ");

    let output = "";
    try {
      output = execSync(args, { encoding: "utf8" });
    } catch (err: unknown) {
      // ripgrep exits 1 when no matches — that's the success path.
      const e = err as { status?: number; stdout?: string };
      if (e.status === 1) return;
      output = e.stdout ?? "";
    }

    expect(
      output.trim(),
      `Forbidden TTS/Read-Aloud strings found:\n${output}`,
    ).toBe("");
  });
});
