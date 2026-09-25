/**
 * Flipkart platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractFlipkart(html, url) -> { name, price, currency, image, brand,
 *                                   sku, availability,
 *                                   extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Flipkart selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * Flipkart class names churn between redesigns, so each field lists
 * several fallbacks (spec Phase 7: best effort, never guaranteed).
 */
import { extractProductFromHtml } from "./shared.js";

const FLIPKART_SELECTORS = {
  name: ["span.VU-ZEz", "h1.x3910o", "div._4rR01T", "span.B_NuCI"],

  price: [
    "div._30jeq3._16Jk6d",
    "div._30jeq3",
    "div.Nx9bqj.CxhGGd",
    "div._16Jk6d",
  ],

  brand: ["span._2WkVRV", "div._2WkVRV", '[itemprop="brand"]'],

  sku: [{ selector: 'meta[itemprop="sku"]', attr: "content" }],

  image: [
    { selector: "img._396cs4", attr: "src" },
    { selector: "img._1Nyybr", attr: "src" },
    { selector: "div._1mXcCf img", attr: "src" },
  ],

  availability: ["div._7qahqV", "div._17IIRD", '[itemprop="availability"]'],
};

export function extractFlipkart(html, url) {
  return extractProductFromHtml(html, url, FLIPKART_SELECTORS);
}
