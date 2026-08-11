#!/usr/bin/env node
/**
 * Domain health check for Sitch.
 *
 * Verifies that the live custom domain:
 *  1. Responds with HTTP 200
 *  2. Serves the expected app (title + built JS bundle present)
 *  3. Serves the SAME deployment as the Lovable published URL
 *
 * Usage: node scripts/domain-health-check.mjs
 * Exit code 0 = healthy, 1 = problem found.
 */

const CUSTOM_DOMAIN = process.env.SITCH_DOMAIN_URL || "https://play.sitchthegame.com";
const LOVABLE_URL = process.env.SITCH_LOVABLE_URL || "https://sitchthegame.lovable.app";
const EXPECTED_TITLE_FRAGMENT = "Sitch";
const TIMEOUT_MS = 20000;

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "cache-control": "no-cache" },
    });
    const html = await res.text();
    return {
      url,
      status: res.status,
      html,
      deploymentId: res.headers.get("x-deployment-id"),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function runDomainHealthCheck() {
  const problems = [];
  const [domain, lovable] = await Promise.all([
    fetchPage(CUSTOM_DOMAIN),
    fetchPage(LOVABLE_URL).catch(() => null),
  ]);

  if (domain.status !== 200) {
    problems.push(`${CUSTOM_DOMAIN} returned HTTP ${domain.status} (expected 200)`);
  }
  if (!domain.html.includes(EXPECTED_TITLE_FRAGMENT)) {
    problems.push(`${CUSTOM_DOMAIN} did not contain expected title fragment "${EXPECTED_TITLE_FRAGMENT}"`);
  }
  if (!/<div id="root"/.test(domain.html)) {
    problems.push(`${CUSTOM_DOMAIN} is missing the React root element (marketing page or wrong build?)`);
  }
  if (!/src="\/assets\/[^"]+\.js"/.test(domain.html)) {
    problems.push(`${CUSTOM_DOMAIN} is not serving a built JS bundle from /assets`);
  }
  if (lovable && lovable.deploymentId && domain.deploymentId && lovable.deploymentId !== domain.deploymentId) {
    problems.push(
      `Deployment mismatch: custom domain is on ${domain.deploymentId} but ${LOVABLE_URL} is on ${lovable.deploymentId}`,
    );
  }

  return {
    ok: problems.length === 0,
    problems,
    status: domain.status,
    deploymentId: domain.deploymentId,
    lovableDeploymentId: lovable?.deploymentId ?? null,
  };
}

const isDirectRun = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());

if (isDirectRun) {
  runDomainHealthCheck()
    .then((result) => {
      console.log(`Domain: ${CUSTOM_DOMAIN}`);
      console.log(`HTTP status: ${result.status}`);
      console.log(`Deployment: ${result.deploymentId ?? "unknown"}`);
      console.log(`Lovable deployment: ${result.lovableDeploymentId ?? "unknown"}`);
      if (result.ok) {
        console.log("PASS: domain is healthy and serving the current deployment.");
        process.exit(0);
      }
      console.error("FAIL:");
      for (const p of result.problems) console.error(` - ${p}`);
      process.exit(1);
    })
    .catch((err) => {
      console.error(`FAIL: could not reach ${CUSTOM_DOMAIN}: ${err.message}`);
      process.exit(1);
    });
}
