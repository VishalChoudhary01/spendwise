/**
 * POST /api/product/resolve — Phase 4 resolver architecture.
 *
 *   Client
 *     ↓ POST { url }
 *   Validate URL (native URL API + private-host rejection)
 *     ↓
 *   Detect platform (registry hosts only)
 *     ↓
 *   Safe server-side fetch (retailer host only, timeout, redirect guard)
 *     ↓
 *   Platform extractor (Phase 6–9)
 *     ↓
 *   Normalized product JSON → Client
 *
 * Security rules (spec Phase 4 + 25):
 *  - This endpoint resolves ONLY recognized retailer hosts.
 *  - There is deliberately no `/api/fetch?url=anything` open proxy.
 *  - Invalid / unsupported / private targets are rejected before any
 *    network request is made.
 *  - Redirects that land off-platform are treated as failures.
 *  - Technical errors (status codes, selectors, parser errors) never
 *    reach the client — only generic, user-safe messages.
 */

import { detectPlatform } from "../../../lib/product/detectPlatform.js";
import { extractProduct } from "../../../lib/product/extractors/index.js";
import { normalizeProduct } from "../../../lib/product/normalizeProduct.js";

const FETCH_TIMEOUT_MS = 10000;

/**
 * User-agent candidates, tried in order.
 *
 * A browser-looking UA first (it is what most CDNs expect), then an
 * honest tool UA: some retailers fingerprint the TLS stack against the
 * declared UA and hand an interstitial (bot wall) to a Chrome UA coming
 * from a server runtime — the honest UA gets the real page. One retry,
 * never a loop of requests.
 */
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Spendwise/1.0 (+https://spendwise.app; product link price reader)",
];

/** Interstitial / bot-wall pages contain no product markup at all. */
function looksLikeBotWall(html) {
  if (!html) return true;
  if (html.length < 20000) return true;
  return /automated access|api-services-support|unusual traffic|are you a robot|verify you are|enable javascript and cookies/i.test(
    html
  );
}

/** Ordinary browser-ish request headers; no cookies, no credentials.
 *  User-Agent is supplied per attempt (see USER_AGENTS). */
const REQUEST_HEADERS = {
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

const EXTRACTION_FAILED_MESSAGE =
  "Product details could not be read from this URL.";

function json(status, body) {
  return Response.json(body, { status });
}

function failure(status, code, message) {
  return json(status, { success: false, code, message });
}

function extractionFailed() {
  return failure(502, "EXTRACTION_FAILED", EXTRACTION_FAILED_MESSAGE);
}

/** Rejects every non-POST probe with a JSON 405. */
export function GET() {
  return failure(405, "METHOD_NOT_ALLOWED", "Use POST to resolve a product URL.");
}

export async function POST(request) {
  /* ---------------------------------------------------------------
   * 1. Parse body
   * ------------------------------------------------------------- */
  let body;
  try {
    body = await request.json();
  } catch {
    return failure(400, "INVALID_URL", "Invalid product URL.");
  }

  const rawUrl = typeof body?.url === "string" ? body.url : "";

  /* ---------------------------------------------------------------
   * 2. Validate URL + detect platform BEFORE any network activity
   * ------------------------------------------------------------- */
  const detection = detectPlatform(rawUrl);

  if (
    detection.reason === "empty" ||
    detection.reason === "malformed" ||
    detection.reason === "unsupported-scheme" ||
    detection.reason === "private-host"
  ) {
    return failure(400, "INVALID_URL", "Invalid product URL.");
  }

  if (detection.reason === "unsupported-host") {
    return failure(400, "UNSUPPORTED_URL", "This store is not supported.");
  }

  const platformId = detection.platform;

  // Dev logging (spec Phase 37): platform + method only, never
  // cookies/headers/full responses.
  console.log(
    `[ProductResolver] Platform: ${platformId} · Host: ${detection.hostname}`
  );

  /* ---------------------------------------------------------------
   * 3. Safe server-side fetch (browser UA, then one honest-UA retry
   *    when the response looks like a bot wall)
   * ------------------------------------------------------------- */
  let response = null;
  let html = null;

  for (const userAgent of USER_AGENTS) {
    let attempt;
    try {
      attempt = await fetch(detection.url, {
        method: "GET",
        headers: { ...REQUEST_HEADERS, "User-Agent": userAgent },
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch {
      continue; // timeout / network error → next candidate
    }

    // Redirect guard: the final URL must still resolve to the same
    // supported platform, otherwise a retailer page tried to bounce the
    // request somewhere else and we stop here.
    let finalDetection;
    try {
      finalDetection = detectPlatform(attempt.url);
    } catch {
      return extractionFailed();
    }
    if (finalDetection.platform !== platformId) {
      return extractionFailed();
    }

    if (!attempt.ok) continue;

    const contentType = attempt.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) continue;

    let body;
    try {
      body = await attempt.text();
    } catch {
      continue;
    }

    response = attempt;
    html = body;

    if (!looksLikeBotWall(body)) break;
  }

  if (!html) {
    return extractionFailed();
  }

  /* ---------------------------------------------------------------
   * 4. Extract → normalize (Phase 5 schema, Phase 6–9 extractors)
   * ------------------------------------------------------------- */
  let extracted;
  try {
    extracted = await extractProduct(platformId, html, response.url);
  } catch {
    // Parser/selector errors stay server-side.
    return extractionFailed();
  }

  if (!extracted) {
    return extractionFailed();
  }

  // Schema (Phase 5): every platform yields the exact same shape,
  // with the original pasted URL preserved for saving/redirecting.
  const product = normalizeProduct(extracted, {
    platform: platformId,
    url: detection.url,
  });

  // A result counts as "found" only when at least a name or a price
  // was read. Missing price alone (or name alone) still succeeds so
  // the UI can offer manual fallback for just the missing field.
  if (product.name === null && product.price === null) {
    return extractionFailed();
  }

  console.log(
    `[ProductResolver] Method: ${product.extractionMethod} · Name: ${
      product.name !== null
    } · Price: ${product.price !== null}`
  );

  return json(200, { success: true, product });
}
