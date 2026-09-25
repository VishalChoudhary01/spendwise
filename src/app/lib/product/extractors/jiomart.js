/**
 * JioMart platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractJioMart(html, url) -> { name, price, currency, image, brand,
 *                                  sku, availability,
 *                                  extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the JioMart selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * JioMart marks up product data with schema.org itemprops, so those
 * come first; class-based fallbacks follow (spec Phase 7).
 */
import { extractProductFromHtml } from "./shared.js";

const JIOMART_SELECTORS = {
  name: ['[itemprop="name"]', "h1", '[class*="prod-title"]'],

  price: [
    '[itemprop="price"]',
    '[data-testid*="price"]',
    '[class*="price"]',
  ],

  brand: ['[itemprop="brand"]', '[class*="brand"]'],

  sku: [
    { selector: 'meta[itemprop="sku"]', attr: "content" },
    { selector: '[itemprop="sku"]', attr: "content" },
  ],

  image: [
    { selector: '[itemprop="image"]', attr: "content" },
    { selector: '[itemprop="image"]', attr: "src" },
    { selector: '[class*="prod-img"] img', attr: "src" },
  ],

  availability: [
    { selector: 'meta[itemprop="availability"]', attr: "content" },
    '[itemprop="availability"]',
  ],
};

export function extractJioMart(html, url) {
  return extractProductFromHtml(html, url, JIOMART_SELECTORS);
}
