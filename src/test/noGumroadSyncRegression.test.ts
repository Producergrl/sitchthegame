import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";

/**
 * Regression guard: publishing Sitch must never modify Gumroad product details.
 * Gumroad is only used for checkout links and server-side license verification.
 */
describe("No Gumroad product sync regression", () => {
  it("does not contain Gumroad product update automation", () => {
    const forbiddenPatterns = [
      "gumroad-sync",
      "Sync to Gumroad",
      "GUMROAD_ACCESS_TOKEN",
      "GUMROAD_SYNC_TOKEN",
      "priceCents",
      "product copy, pricing, images, and files",
      "api\\.gumroad\\.com/v2/products",
      "api\\.gumroad\\.com/v2/products/.*PUT",
    ];

    const args = [
      "rg -ni --hidden",
      "-g '!node_modules'",
      "-g '!dist'",
      "-g '!*.lock'",
      "-g '!bun.lockb'",
      "-g '!tsconfig*.tsbuildinfo'",
      "-g '!src/test/noGumroadSyncRegression.test.ts'",
      ...forbiddenPatterns.map((pattern) => `-e '${pattern}'`),
      ".",
    ].join(" ");

    let output = "";
    try {
      output = execSync(args, { encoding: "utf8" });
    } catch (err: unknown) {
      const e = err as { status?: number; stdout?: string };
      if (e.status === 1) return;
      output = e.stdout ?? "";
    }

    expect(
      output.trim(),
      `Forbidden Gumroad product sync references found:\n${output}`,
    ).toBe("");
  });
});