/**
 * Platform extractor registry — Phase 9.
 *
 * Contract (finalized in Phase 9):
 *
 *   extractProduct(platformId, html, url) -> Promise<{
 *     name:            string | null,
 *     price:           number | null,
 *     currency:        string | null,
 *     image:           string | null,
 *     brand:           string | null,
 *     sku:             string | null,
 *     availability:    string | null,
 *     extractionMethod: "json-ld" | "open-graph" | "meta" |
 *                      "selector" | "seo-text" | "unknown"
 *   } | null>
 *
 * Returns `null` when nothing usable could be read from the page.
 * Every platform extractor runs the shared layered pipeline
 * (JSON-LD → Open Graph → meta tags → platform selectors), see
 * shared.js for the layer priority (spec Phase 6 + 9).
 *
 * This module is intentionally the ONLY place the resolver route
 * knows about — extractors can grow without touching the API surface.
 */

import { extractAmazon } from "./amazon.js";
import { extractBlinkit } from "./blinkit.js";
import { extractFlipkart } from "./flipkart.js";
import { extractInstamart } from "./instamart.js";
import { extractJioMart } from "./jiomart.js";
import { extractMyntra } from "./myntra.js";
import { extractZepto } from "./zepto.js";

/** Registry: platform id → single-responsibility extractor. */
const EXTRACTORS = {
  amazon: extractAmazon,
  flipkart: extractFlipkart,
  myntra: extractMyntra,
  jiomart: extractJioMart,
  zepto: extractZepto,
  blinkit: extractBlinkit,
  instamart: extractInstamart,
};

export async function extractProduct(platformId, html, url) {
  const extractor = EXTRACTORS[platformId];
  if (!extractor) return null; // unsupported platform — resolver guards this earlier

  // Technical errors never leave this module: any thrown parser or
  // selector error becomes a plain `null`, which the resolver turns
  // into EXTRACTION_FAILED → manual fallback (spec Phase 7 + 8).
  try {
    const result = extractor(html, url);
    return result ?? null;
  } catch {
    return null;
  }
}
