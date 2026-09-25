/**
 * Myntra platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractMyntra(html, url) -> { name, price, currency, image, brand,
 *                                 sku, availability,
 *                                 extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Myntra selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * Myntra uses obfuscated class names alongside stable `pdp-*` ones,
 * so both are listed (spec Phase 7: best effort).
 */
import { extractProductFromHtml } from "./shared.js";

const MYNTRA_SELECTORS = {
  name: ["h1.pdp-name", "span.pdp-name", '[class*="pdp-name"]', "h1"],

  price: [
    "span.pdp-price",
    "span.pdp-offer-price",
    '[class*="pdp-price"]',
    '[class*="offer-price"]',
  ],

  brand: ["h2.pdp-brand-name", '[class*="pdp-brand"]', '[itemprop="brand"]'],

  image: [
    { selector: "img.pdp-image", attr: "src" },
    { selector: '[class*="pdp-image"]', attr: "src" },
    { selector: "picture img", attr: "src" },
  ],

  availability: ['[itemprop="availability"]', '[class*="pdp-size"]'],
};

export function extractMyntra(html, url) {
  return extractProductFromHtml(html, url, MYNTRA_SELECTORS);
}
