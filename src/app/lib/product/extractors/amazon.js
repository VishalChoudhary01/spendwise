/**
 * Amazon platform extractor (spec Phase 6 priority 3 + Phase 9).
 *
 * Contract:
 *   extractAmazon(html, url) -> { name, price, currency, image, brand,
 *                                 sku, availability,
 *                                 extractionMethod } | null
 *
 * Runs the shared layered pipeline: JSON-LD → Open Graph → meta tags
 * → the Amazon selectors below. Platform selectors are only reached
 * when structured metadata failed (spec Phase 6).
 *
 * Best effort by design (spec Phase 7): anti-bot walls, CAPTCHAs and
 * login walls simply yield `null` → manual fallback.
 */
import { extractProductFromHtml } from "./shared.js";

const AMAZON_SELECTORS = {
  name: ["#productTitle", "h1#title", "span#productTitle"],

  price: [
    "#corePrice_feature_div .a-offscreen",
    ".a-price .a-offscreen",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    "#price_inside_buybox",
    "#dealprice_savings .a-color-price",
  ],

  brand: ["#bylineInfo", "#brand"],

  sku: [{ selector: "input#ASIN", attr: "value" }],

  image: [
    { selector: "#landingImage", attr: "src" },
    { selector: "#imgBlkFront", attr: "src" },
    { selector: "div.imgTagWrapper img", attr: "src" },
  ],

  availability: ["#availability span", "#availability"],
};

export function extractAmazon(html, url) {
  return extractProductFromHtml(html, url, AMAZON_SELECTORS);
}
