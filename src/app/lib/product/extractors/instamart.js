/**
 * Instamart (Swiggy) platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractInstamart(html, url) -> { name, price, currency, image, brand,
 *                                    sku, availability,
 *                                    extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Instamart selectors below. Platform selectors are only
 * reached when structured metadata failed (spec Phase 6).
 *
 * Instamart pages are client-rendered behind Swiggy's shared host, so
 * extraction often yields `null` — that is expected best-effort
 * behavior (spec Phase 7): the resolver turns it into
 * EXTRACTION_FAILED → manual fallback.
 */
import { extractProductFromHtml } from "./shared.js";

const INSTAMART_SELECTORS = {
  name: ["h1", '[data-testid="item-name"]', '[class*="item-name"]'],

  price: [
    '[data-testid="item-price"]',
    '[data-testid*="price"]',
    '[class*="price"]',
  ],

  brand: ['[data-testid="brand-name"]', '[class*="brand"]'],

  image: [
    { selector: '[data-testid="item-image"]', attr: "src" },
    { selector: '[class*="item"] img', attr: "src" },
  ],

  availability: ['[data-testid="availability"]', '[class*="stock"]'],
};

export function extractInstamart(html, url) {
  return extractProductFromHtml(html, url, INSTAMART_SELECTORS);
}
