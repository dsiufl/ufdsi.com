#!/usr/bin/env node
/**
 * SEO Validator for ufdsi.com
 * Run: node scripts/seo-validate.mjs
 *
 * Reads the built .next/server/app HTML output and checks key SEO rules.
 * Fails CI (exit code 1) if any P0 checks fail.
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");
const BUILD_DIR = join(ROOT, ".next", "server", "app");

// ─── Config ──────────────────────────────────────────────────────────────────

/** Indexable routes: must have title, description, canonical, og:title, og:description, og:image */
const INDEXABLE_ROUTES = [
  { route: "/", file: "page.html" },
  { route: "/about", file: "about/page.html" },
  { route: "/calendar", file: "calendar/page.html" },
  { route: "/contact", file: "contact/page.html" },
  { route: "/newsletter", file: "newsletter/page.html" },
  { route: "/sponsors", file: "sponsors/page.html" },
  { route: "/symposium", file: "symposium/page.html" },
  { route: "/symposium-new", file: "symposium-new/page.html" },
  { route: "/team", file: "team/page.html" },
  { route: "/workshops-list", file: "workshops-list/page.html" },
];

/** Non-indexable routes: must have noindex */
const NOINDEX_ROUTES = [
  { route: "/error", file: "error/page.html" },
  { route: "/unsubscribe", file: "unsubscribe/page.html" },
];

/** Banned strings in production HTML (indicate leftover template/staging content) */
const BANNED_STRINGS = [
  "Free Next.js Template",
  "Startup and SaaS",
  "localhost",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

let failures = 0;
let warnings = 0;

function fail(msg) {
  console.error(`  ❌ FAIL: ${msg}`);
  failures++;
}

function warn(msg) {
  console.warn(`  ⚠️  WARN: ${msg}`);
  warnings++;
}

function pass(msg) {
  console.log(`  ✅ PASS: ${msg}`);
}

function readHtml(relPath) {
  const full = join(BUILD_DIR, relPath);
  if (!existsSync(full)) return null;
  return readFileSync(full, "utf-8");
}

function extractMeta(html, property) {
  const match = html.match(
    new RegExp(`<meta[^>]+(?:name|property)=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
  ) || html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:name|property)=["']${property}["']`, "i")
  );
  return match ? match[1] : null;
}

function extractTitle(html) {
  const match = html.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1] : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return match ? match[1] : null;
}

function hasNoindex(html) {
  return /noindex/i.test(html);
}

function hasJsonLd(html) {
  return /application\/ld\+json/i.test(html);
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log("\n=== UF DSI SEO Validator ===\n");

if (!existsSync(BUILD_DIR)) {
  console.error(`Build directory not found: ${BUILD_DIR}`);
  console.error("Run `next build` before running this validator.");
  process.exit(1);
}

// ── Check indexable routes ──
console.log("── Indexable Routes ──");
for (const { route, file } of INDEXABLE_ROUTES) {
  console.log(`\n[${route}]`);
  const html = readHtml(file);

  if (!html) {
    fail(`HTML file not found at .next/server/app/${file}`);
    continue;
  }

  const title = extractTitle(html);
  const desc = extractMeta(html, "description");
  const canonical = extractCanonical(html);
  const ogTitle = extractMeta(html, "og:title");
  const ogDesc = extractMeta(html, "og:description");
  const ogImage = extractMeta(html, "og:image");
  const twCard = extractMeta(html, "twitter:card");

  if (!title) fail("Missing <title>");
  else if (title.length < 10) warn(`Title too short (${title.length} chars): "${title}"`);
  else if (title.length > 70) warn(`Title may be too long (${title.length} chars): "${title}"`);
  else pass(`title: "${title}"`);

  if (!desc) fail("Missing meta description");
  else if (desc.length < 50) warn(`Description too short (${desc.length} chars)`);
  else if (desc.length > 165) warn(`Description too long (${desc.length} chars)`);
  else pass(`description length: ${desc.length} chars`);

  if (!canonical) warn("Missing canonical URL");
  else if (canonical.includes("localhost")) fail(`Canonical contains localhost: ${canonical}`);
  else pass(`canonical: ${canonical}`);

  if (!ogTitle) fail("Missing og:title");
  else pass("og:title present");

  if (!ogDesc) fail("Missing og:description");
  else pass("og:description present");

  if (!ogImage) fail("Missing og:image");
  else if (ogImage.includes("localhost")) fail(`og:image contains localhost: ${ogImage}`);
  else pass("og:image present");

  if (!twCard) warn("Missing twitter:card");
  else pass("twitter:card present");

  if (hasNoindex(html)) fail(`Indexable page has noindex: ${route}`);

  // Banned strings
  for (const banned of BANNED_STRINGS) {
    if (html.includes(banned)) fail(`Banned string found: "${banned}"`);
  }
}

// ── Check noindex routes ──
console.log("\n── Non-Indexable Routes ──");
for (const { route, file } of NOINDEX_ROUTES) {
  console.log(`\n[${route}]`);
  const html = readHtml(file);

  if (!html) {
    warn(`HTML file not found at .next/server/app/${file} (page may not be pre-rendered)`);
    continue;
  }

  if (!hasNoindex(html)) fail(`Non-indexable page missing noindex: ${route}`);
  else pass("noindex present");

  for (const banned of BANNED_STRINGS) {
    if (html.includes(banned)) fail(`Banned string found: "${banned}"`);
  }
}

// ── Check JSON-LD on homepage ──
console.log("\n── Structured Data ──");
const homeHtml = readHtml("page.html");
if (homeHtml) {
  if (!hasJsonLd(homeHtml)) fail("Homepage missing JSON-LD structured data");
  else pass("JSON-LD found on homepage");
}

// ── Summary ──
console.log("\n── Summary ──");
console.log(`Failures: ${failures}`);
console.log(`Warnings: ${warnings}`);

if (failures > 0) {
  console.error(`\n❌ SEO validation FAILED with ${failures} failure(s). Fix the issues above before deploying.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ SEO validation PASSED${warnings > 0 ? ` (${warnings} warning(s) to review)` : ""}.\n`);
  process.exit(0);
}
