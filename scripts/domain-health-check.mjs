#!/usr/bin/env node
/**
 * Domain health check for Sitch.
 *
 * Verifies that the live custom domain:
 *  1. Responds with HTTP 200
 *  2. Serves the expected app (title + built JS bundle present)
 *  3. Serves the same fingerprinted assets as the Lovable published URL
 *  4. Has a valid SSL certificate that is not close to expiring
 *
 * Usage: node scripts/domain-health-check.mjs
 * Exit code 0 = healthy, 1 = problem found.
 */

import tls from "node:tls";
import { pathToFileURL } from "node:url";

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

// Hosting response headers can differ between domains for the same app. Compare
// Vite's fingerprinted entry JS/CSS paths instead, retaining headers for diagnosis.
export function buildAssets(html, baseUrl) {
  const assets = new Set();
  for (const tag of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const attribute = tag[1].toLowerCase() === "script" ? "src" : "href";
    const match = tag[0].match(new RegExp(`\\s${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i"));
    if (!match) continue;
    try {
      const url = new URL(match[2], baseUrl);
      if (url.origin === new URL(baseUrl).origin && /^\/assets\/.+\.(js|css)$/.test(url.pathname)) {
        assets.add(url.pathname);
      }
    } catch { /* Invalid asset URLs cannot establish a matching build. */ }
  }
  return [...assets].sort();
}

export function compareDeployments(domain, reference) {
  if (!reference || reference.status !== 200) {
    return ["Cannot confirm the published build: Lovable reference is unavailable"];
  }
  const actual = buildAssets(domain.html, domain.url);
  const expected = buildAssets(reference.html, reference.url);
  if (!actual.some(path => path.endsWith(".js")) || !expected.some(path => path.endsWith(".js"))) {
    return ["Cannot compare builds: a page is missing its built JavaScript assets"];
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    return [`Build mismatch: custom domain assets ${actual.join(", ")} differ from Lovable assets ${expected.join(", ")}`];
  }
  return [];
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
  problems.push(...compareDeployments(domain, lovable));

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
    assets: buildAssets(domain.html, domain.url),
    lovableAssets: lovable ? buildAssets(lovable.html, lovable.url) : [],
    ssl,
  };
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  runDomainHealthCheck()
    .then((result) => {
      console.log(`Domain: ${CUSTOM_DOMAIN}`);
      console.log(`HTTP status: ${result.status}`);
      console.log(`Deployment: ${result.deploymentId ?? "unknown"}`);
      console.log(`Lovable deployment: ${result.lovableDeploymentId ?? "unknown"}`);
      console.log(`Build assets: ${result.assets.join(", ") || "missing"}`);
      console.log(`Lovable assets: ${result.lovableAssets.join(", ") || "missing"}`);
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
