import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAssets, compareDeployments } from './domain-health-check.mjs';

const html = '<div id="root"></div><script type="module" crossorigin src="/assets/index-abc123.js"></script><link rel="stylesheet" href="/assets/index-def456.css">';
const custom = { url: 'https://play.sitchthegame.com', status: 200, html, deploymentId: 'response-1' };
const reference = { url: 'https://sitchthegame.lovable.app', status: 200, html, deploymentId: 'response-2' };

test('identical builds pass even when deployment headers differ', () => {
  assert.deepEqual(compareDeployments(custom, reference), []);
});
test('a different JavaScript build still fails', () => {
  assert.match(compareDeployments(custom, { ...reference, html: html.replace('abc123', 'new789') })[0], /Build mismatch/);
});
test('a different stylesheet still fails', () => {
  assert.match(compareDeployments(custom, { ...reference, html: html.replace('def456', 'new789') })[0], /Build mismatch/);
});
test('unavailable reference cannot produce a healthy result', () => {
  for (const value of [null, { ...reference, status: 503 }]) {
    assert.match(compareDeployments(custom, value)[0], /unavailable/);
  }
});
test('a marketing page or empty reference cannot establish a matching game build', () => {
  assert.match(compareDeployments(custom, { ...reference, html: '<h1>Sitch</h1>' })[0], /missing/);
  assert.match(compareDeployments({ ...custom, html: '<h1>Sitch</h1>' }, reference)[0], /missing/);
});
test('asset comparison accepts reordered attributes, quotes and same-host absolute URLs', () => {
  const reordered = "<link href='https://sitchthegame.lovable.app/assets/index-def456.css' rel='stylesheet'><script src='./assets/index-abc123.js' type='module'></script>";
  assert.deepEqual(compareDeployments(custom, { ...reference, html: reordered }), []);
});
test('ignores external scripts and does not mistake data-src for a loaded asset', () => {
  assert.deepEqual(buildAssets('<script data-src="/assets/fake.js"></script><script src="https://external.example/assets/fake.js"></script>', custom.url), []);
});
