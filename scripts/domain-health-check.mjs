#!/usr/bin/env node
/**
 * Domain health check for Sitch.
 *
 * Verifies that the live custom domain:
 *  1. Responds with HTTP 200
 *  2. Serves the expected app (title + built JS bundle present)
 *  3. Serves the SAME deployment as the Lovable published URL
 *  4. Has a valid SSL certificate that is not close to expiring
 *
 * Usage: node scripts/domain-health-check.mjs
 * Exit code 0 = healthy, 1 = problem found.
 */

import tls from "node:tls";

const CUSTOM_DOMAIN = process.env.SITCH_DOMAIN_URL || "https://play.sitchthegame.com";
const LOVABLE_URL = process.env.SITCH_LOVABLE_URL || "https://sitchthegame.lovable.app";
const EXPECTED_TITLE_FRAGMENT = "Sitch";
const TIMEOUT_MS = 20000;
// Warn loudly while there is still time to fix a renewal problem.
const SSL_MIN_DAYS = Number(process.env.SITCH_SSL_MIN_DAYS || 14);

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

export function checkSsl(hostname, port = 443) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      { host: hostname, port, servername: hostname, timeout: TIMEOUT_MS },
      () => {
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const authorizationError = socket.authorizationError;
        socket.end();
        if (!cert || !cert.valid_to) {
          reject(new Error("No certificate returned"));
          return;
        }
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.floor((validTo.getTime() - Date.now()) / 86400000);
        resolve({
          authorized,
          authorizationError: authorizationError ? String(authorizationError) : null,
          issuer: cert.issuer?.O ?? "unknown",
          validTo: validTo.toISOString(),
          daysRemaining,
        });
      },
    );
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("TLS connection timed out"));
    });
    socket.on("error", reject);
  });
}

export async function runDomainHealthCheck() {
  const problems = [];
  const hostname = new URL(CUSTOM_DOMAIN).hostname;

  const [domain, lovable, ssl] = await Promise.all([
    fetchPage(CUSTOM_DOMAIN),
    fetchPage(LOVABLE_URL).catch(() => null),
    checkSsl(hostname).catch((err) => ({ error: err.message })),
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

  if (ssl.error) {
    problems.push(`SSL check failed for ${hostname}: ${ssl.error}`);
  } else {
    if (!ssl.authorized) {
      problems.push(`SSL certificate for ${hostname} is not trusted: ${ssl.authorizationError}`);
    }
    if (ssl.daysRemaining < 0) {
      problems.push(`SSL certificate for ${hostname} EXPIRED on ${ssl.validTo}`);
    } else if (ssl.daysRemaining < SSL_MIN_DAYS) {
      problems.push(
        `SSL certificate for ${hostname} expires in ${ssl.daysRemaining} day(s) on ${ssl.validTo} (threshold ${SSL_MIN_DAYS})`,
      );
    }
  }

  return {
    ok: problems.length === 0,
    problems,
    status: domain.status,
    deploymentId: domain.deploymentId,
    lovableDeploymentId: lovable?.deploymentId ?? null,
    ssl,
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
      if (result.ssl?.error) {
        console.log(`SSL: could not check (${result.ssl.error})`);
      } else {
        console.log(
          `SSL: ${result.ssl.issuer}, expires ${result.ssl.validTo} (${result.ssl.daysRemaining} days left)`,
        );
      }
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
