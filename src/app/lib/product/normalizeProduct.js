/**
 * Phase 5 — Normalized product schema.
 *
 * Platform extractors (Phase 9) return a partial result; the resolver
 * completes it through normalizeProduct() so EVERY platform yields the
 * exact same shape:
 *
 *   Required: platform, platformName, url, name, price, currency
 *   Optional: image, brand, sku, availability, extractedAt,
 *             extractionMethod
 *
 * Rules (spec Phase 5 + 10):
 *  - `price` is ALWAYS a number or null — never "₹1,299". Full
 *    ₹-string parsing lives in Phase 10 (normalizePrice) and is
 *    applied by extractors before results reach this module; here we
 *    only coerce plain numbers/numeric strings.
 *  - image / brand / sku / availability are never required — they
 *    default to null and must not fail extraction.
 *  - The original product URL is preserved (trimmed only, query intact)
 *    so it remains the redirect target.
 *  - Pure function: no fetching, no Redux, no side effects.
 */

import { getPlatformById } from "../../constants/platforms.js";

/** Coerces a value to a trimmed string, or null when empty/absent. */
function toText(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

/** Coerces a value to a finite, non-negative number, or null. */
function toPrice(value) {
  if (value === null || value === undefined || value === "") return null;
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

/**
 * Builds the normalized product object.
 *
 * @param {object} [extracted] - Partial extractor result:
 *   { name, price, currency, image, brand, sku, availability,
 *     extractedAt, extractionMethod }
 * @param {object} [context] - Resolver context: { platform, url }
 * @returns {{platform: string|null, platformName: string|null,
 *            url: string|null, name: string|null, price: number|null,
 *            currency: string, image: string|null, brand: string|null,
 *            sku: string|null, availability: string|null,
 *            extractedAt: string, extractionMethod: string}}
 *
 * Never returns null — the caller decides usability (a product with
 * both `name` and `price` equal to null was not actually found).
 */
export function normalizeProduct(extracted = {}, { platform, url } = {}) {
  const entry = getPlatformById(platform);

  return {
    platform: platform ?? null,
    platformName: entry ? entry.name : null,

    url: toText(url),

    // Required, but individually nullable so the UI can offer manual
    // fallback for whichever field could not be read (Phase 36).
    name: toText(extracted.name),
    price: toPrice(extracted.price),
    currency: toText(extracted.currency) || "INR",

    // Optional — never mandatory (Phase 5).
    image: toText(extracted.image),
    brand: toText(extracted.brand),
    sku: toText(extracted.sku),
    availability: toText(extracted.availability),

    extractedAt: toText(extracted.extractedAt) || new Date().toISOString(),
    extractionMethod: toText(extracted.extractionMethod) || "unknown",
  };
}
