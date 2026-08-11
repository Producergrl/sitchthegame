import { describe, it, expect } from "vitest";
import { runDomainHealthCheck } from "../../scripts/domain-health-check.mjs";

/**
 * Live smoke test for the custom domain.
 * Skipped by default so offline/CI-without-network runs stay green.
 * Enable with: RUN_DOMAIN_HEALTH_CHECK=1 bunx vitest run src/test/domainHealth.test.ts
 */
const enabled = process.env.RUN_DOMAIN_HEALTH_CHECK === "1";

describe.skipIf(!enabled)("play.sitchthegame.com health", () => {
  it(
    "returns HTTP 200 and serves the current build",
    async () => {
      const result = (await runDomainHealthCheck()) as {
        ok: boolean;
        problems: string[];
        status: number;
      };
      expect(result.problems).toEqual([]);
      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
    },
    30000,
  );
});
