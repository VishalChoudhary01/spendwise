/**
 * Blinkit platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractBlinkit(html, url) -> { name, price, currency, image, brand,
 *                                  sku, availability,
 *                                  extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Blinkit selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * Blinkit relies heavily on utility-class markup that changes often,
 * so `data-testid` hooks and plain elements are preferred
 * (spec Phase 7: best effort).
 */
import { extractProductFromHtml } from "./shared.js";

const BLINKIT_SELECTORS = {
  name: ["h1", '[data-testid="product-name"]', '[class*="product-name"]'],

  price: [
    '[data-testid="product-price"]',
    "div#price",
    '[class*="price"]',
  ],

  brand: ['[data-testid="brand-name"]', '[class*="brand"]'],

  image: [
    { selector: '[data-testid="product-image"]', attr: "src" },
    { selector: '[class*="product"] img', attr: "src" },
  ],

  availability: ['[data-testid="availability"]', '[class*="stock"]'],
};

export function extractBlinkit(html, url) {
  return extractProductFromHtml(html, url, BLINKIT_SELECTORS);
}
