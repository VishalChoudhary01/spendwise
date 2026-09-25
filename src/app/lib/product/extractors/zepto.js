/**
 * Zepto platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractZepto(html, url) -> { name, price, currency, image, brand,
 *                                sku, availability,
 *                                extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Zepto selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * Quick-commerce PDPs are light on structured data, so the selector
 * layer matters more here (spec Phase 7: best effort, manual
 * fallback when the page cannot be read).
 */
import { extractProductFromHtml } from "./shared.js";

const ZEPTO_SELECTORS = {
  name: ["h1", '[data-testid="product-name"]', '[class*="product-name"]'],

  price: [
    '[data-testid="product-price"]',
    '[class*="selling-price"]',
    '[class*="Price"]',
    '[class*="price"]',
  ],

  brand: ['[data-testid="brand-name"]', '[class*="brand"]'],

  image: [
    { selector: '[data-testid="product-image"]', attr: "src" },
    { selector: '[class*="product"] img', attr: "src" },
  ],

  availability: ['[data-testid="availability"]', '[class*="stock"]'],
};

export function extractZepto(html, url) {
  return extractProductFromHtml(html, url, ZEPTO_SELECTORS);
}
