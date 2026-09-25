/**
 * Phases 6–9 — shared server-side extraction pipeline (Cheerio).
 *
 * Layer priority (spec Phase 6 + 9):
 *   1. JSON-LD        <script type="application/ld+json"> with
 *                     Product / Offer / AggregateOffer
 *   2. Open Graph     og:title, og:image, product:price:*
 *   3. Product meta   itemprop price / name / brand / image /
 *                     availability
 *   4. Platform selectors — per-platform config passed by each
 *                     extractor (only reached when structured
 *                     metadata failed)
 *   5. SEO text       currency-tagged price embedded in
 *                     meta[description] / og:title / <title>
 *                     (last resort — some retailers, e.g. Flipkart,
 *                     serve no structured price markup at all)
 *
 * First non-empty value wins per field. `extractionMethod` records
 * the layer that supplied the price, or — when no price was found —
 * the layer that supplied the name.
 *
 * Best effort by design (spec Phase 7): anti-bot walls, CAPTCHAs,
 * login walls and client-rendered pages simply yield `null`, which
 * the resolver turns into EXTRACTION_FAILED → manual fallback.
 *
 * Technical errors never leave this module — every layer is guarded.
 */

import { load } from "cheerio";
import { normalizePrice } from "../normalizePrice.js";

const emptyFields = () => ({
  name: null,
  price: null,
  currency: null,
  image: null,
  brand: null,
  sku: null,
  availability: null,
});

/** Trimmed text with collapsed whitespace, or null. */
function text(value) {
  if (value === null || value === undefined) return null;
  const result = String(value).trim().replace(/\s+/g, " ");
  return result === "" ? null : result;
}

/* ===============================================================
 *  Priority 1 — JSON-LD
 * ============================================================== */

function typeMatches(node, types) {
  const raw = node?.["@type"];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.some((entry) => typeof entry === "string" && types.includes(entry));
}

/** Collects nodes from arrays, @graph and common entity containers. */
function collectNodes(data, out = []) {
  if (Array.isArray(data)) {
    for (const entry of data) collectNodes(entry, out);
    return out;
  }
  if (!data || typeof data !== "object") return out;

  out.push(data);

  for (const key of ["@graph", "mainEntity", "item", "itemListElement"]) {
    if (data[key]) collectNodes(data[key], out);
  }
  return out;
}

/**
 * Parses a JSON-LD block.
 *
 * Pretty-printed blocks sometimes contain raw control characters
 * (tabs/newlines) *inside* string values — legal for the retailer's
 * purpose, invalid JSON (Myntra ships one). JSON only forbids them
 * inside strings, so replacing every control character with a space
 * keeps the tokens intact and makes the block parseable.
 */
function parseJsonLd(raw) {
  const sanitized = raw.replace(/[\u0000-\u001F]/g, " ");
  try {
    return JSON.parse(sanitized);
  } catch {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

function pickOffer(offers) {
  if (!offers) return null;
  if (Array.isArray(offers)) {
    return (
      offers.find(
        (offer) =>
          offer &&
          typeof offer === "object" &&
          (offer.price !== undefined || offer.lowPrice !== undefined)
      ) ??
      offers.find((offer) => offer && typeof offer === "object") ??
      null
    );
  }
  return typeof offers === "object" ? offers : null;
}

function pickImage(image) {
  if (!image) return null;
  if (typeof image === "string") return text(image);
  if (Array.isArray(image)) {
    for (const entry of image) {
      const picked = pickImage(entry);
      if (picked) return picked;
    }
    return null;
  }
  if (typeof image === "object") {
    return text(image.url ?? image.contentUrl ?? image["@id"]);
  }
  return null;
}

function pickBrand(brand) {
  if (!brand) return null;
  if (typeof brand === "string") return text(brand);
  if (Array.isArray(brand)) return pickBrand(brand[0]);
  if (typeof brand === "object") return text(brand.name ?? brand.title);
  return null;
}

/** "https://schema.org/InStock" → "InStock" */
function normalizeAvailability(value) {
  const raw = text(value);
  if (!raw) return null;
  const match = raw.match(/\/([A-Za-z]+)\/?$/);
  return match ? match[1] : raw;
}

function fromProductNode(node) {
  const out = emptyFields();

  out.name = text(node.name);

  out.sku =
    text(node.sku) ??
    text(node.gtin13) ??
    text(node.gtin12) ??
    text(node.gtin8) ??
    text(node.gtin) ??
    text(node.mpn);

  out.brand = pickBrand(node.brand);
  out.image = pickImage(node.image);

  const offer = pickOffer(node.offers);
  if (offer) {
    const priceRaw =
      offer.price ??
      offer.lowPrice ??
      offer.highPrice ??
      offer.priceSpecification?.price;
    out.price = normalizePrice(priceRaw);
    out.currency = text(offer.priceCurrency);
    out.availability = normalizeAvailability(offer.availability);
  }

  out.availability ??= normalizeAvailability(node.availability);
  return out;
}

function extractFromJsonLd($) {
  const out = { method: "json-ld", ...emptyFields() };

  $('script[type*="ld+json"]').each((_, element) => {
    const raw = ($(element).html() || $(element).text() || "").trim();
    if (!raw) return;

    let data;
    try {
      data = parseJsonLd(raw);
    } catch {
      return; // unreachable — parseJsonLd never throws
    }
    if (!data) return; // malformed structured data — next layer takes over

    const nodes = collectNodes(data);
    const productNode =
      nodes.find((node) =>
        typeMatches(node, ["Product", "ProductGroup", "IndividualProduct"])
      ) ?? null;

    if (!productNode) return;

    const found = fromProductNode(productNode);
    if (found.name !== null || found.price !== null) {
      Object.assign(out, found);
      return false; // stop scanning — first real product wins
    }
  });

  return out;
}

/* ===============================================================
 *  Priority 2 — Open Graph (name/image + opportunistic price tags)
 * ============================================================== */

function metaContent($, ...selectors) {
  for (const selector of selectors) {
    const value = $(selector).first().attr("content");
    if (value && String(value).trim()) return String(value).trim();
  }
  return null;
}

function extractFromOpenGraph($) {
  const out = { method: "open-graph", ...emptyFields() };

  out.name = text(metaContent($, 'meta[property="og:title"]'));
  out.image = text(
    metaContent($, 'meta[property="og:image"]', 'meta[property="og:image:url"]')
  );
  // Structured-product OG properties — read opportunistically, never
  // assumed to exist (spec: OG does not guarantee a reliable price).
  out.price = normalizePrice(
    metaContent(
      $,
      'meta[property="product:price:amount"]',
      'meta[property="og:price:amount"]'
    )
  );
  out.currency = text(
    metaContent(
      $,
      'meta[property="product:price:currency"]',
      'meta[property="og:price:currency"]'
    )
  );
  out.availability = text(
    metaContent($, 'meta[property="product:availability"]')
  );

  return out;
}

/* ===============================================================
 *  Priority 3 — product meta tags (itemprop)
 * ============================================================== */

function extractFromMetaTags($) {
  const out = { method: "meta", ...emptyFields() };

  out.name = text(metaContent($, 'meta[itemprop="name"]'));
  out.price = normalizePrice(metaContent($, 'meta[itemprop="price"]'));
  out.currency = text(metaContent($, 'meta[itemprop="priceCurrency"]'));
  out.brand = text(metaContent($, 'meta[itemprop="brand"]'));
  out.image = text(metaContent($, 'meta[itemprop="image"]'));
  out.availability = text(metaContent($, 'meta[itemprop="availability"]'));

  return out;
}

/* ===============================================================
 *  Priority 4 — platform-specific selectors
 * ============================================================== */

/**
 * @typedef {string | { selector: string, attr?: string | null }} SelectorEntry
 */

/**
 * Runs a platform selector config:
 *   { name: [...], price: [...], brand: [...], sku: [...],
 *     image: [...], availability: [...] }
 * Entries are tried in order; first non-empty wins per field.
 */
function extractFromSelectors($, config) {
  const out = { method: "selector", ...emptyFields() };
  if (!config || typeof config !== "object") return out;

  for (const field of Object.keys(out)) {
    if (field === "method" || field === "price") continue;
    const entries = config[field];
    if (!entries) continue;

    for (const entry of Array.isArray(entries) ? entries : [entries]) {
      const selector = typeof entry === "string" ? entry : entry?.selector;
      const attr = typeof entry === "string" ? null : (entry?.attr ?? null);
      if (!selector) continue;

      let node;
      try {
        node = $(selector).first();
      } catch {
        continue; // defensive: never let one bad selector kill a layer
      }
      if (!node?.length) continue;

      const value = text(attr ? node.attr(attr) : node.text());
      if (value !== null) {
        out[field] = value;
        break;
      }
    }
  }

  const priceEntries = config.price;
  if (priceEntries) {
    for (const entry of Array.isArray(priceEntries)
      ? priceEntries
      : [priceEntries]) {
      const selector = typeof entry === "string" ? entry : entry?.selector;
      if (!selector) continue;

      let node;
      try {
        node = $(selector).first();
      } catch {
        continue;
      }
      if (!node?.length) continue;

      const price = normalizePrice(node.text());
      if (price !== null) {
        out.price = price;
        break;
      }
    }
  }

  return out;
}

/* ===============================================================
 *  Priority 5 — SEO text (currency-tagged price in title copy)
 * ============================================================== */

/** Matches a currency-tagged amount: ₹1,45,000 · Rs. 103000 · INR 499 */
const SEO_PRICE_PATTERN = /(?:₹|Rs\.?\s*|INR\s*)\s*\d[\d,]*(?:\.\d+)?/i;

/**
 * Shipping/offer thresholds are not product prices — skip matches like
 * "free delivery above Rs. 999" or "minimum order Rs. 499".
 */
const SEO_PRICE_NOISE = /(?:free|above|below|minimum|min\.|upto|up to)\s*(?:delivery|shipping|order|purchase|price)?\s*$/i;

/**
 * Last-resort layer for pages that ship no structured price markup.
 * Flipkart, for example, renders its price client-side and only embeds
 * it in the SEO copy: "… Gaming Laptop Rs.103000 Price in India - Buy …"
 *
 * Only an explicitly currency-tagged amount is accepted — bare numbers
 * in titles (model numbers, screen sizes) are never treated as prices.
 * Name/image are intentionally left to the earlier layers.
 */
function extractFromSeoText($) {
  const out = { method: "seo-text", ...emptyFields() };

  const candidates = [
    metaContent($, 'meta[name="description"]'),
    metaContent($, 'meta[property="og:title"]'),
    text($("title").first().text()),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    // Scan every currency-tagged amount, ignoring threshold noise.
    const pattern = new RegExp(SEO_PRICE_PATTERN.source, "gi");
    let match;
    while ((match = pattern.exec(candidate)) !== null) {
      const lead = candidate.slice(Math.max(0, match.index - 40), match.index);
      if (SEO_PRICE_NOISE.test(lead)) continue;

      const price = normalizePrice(match[0]);
      if (price !== null) {
        out.price = price;
        return out;
      }
    }
  }

  return out;
}

/* ===============================================================
 *  Pipeline
 * ============================================================== */

/** Resolves a possibly relative/protocol-relative image against the page URL. */
function absolutizeUrl(value, baseUrl) {
  if (!value || !baseUrl) return value;
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

/**
 * Runs all four extraction layers against a retailer HTML document.
 *
 * @param {string} html - Raw retailer HTML.
 * @param {string} url - Final page URL (base for relative assets).
 * @param {object} [selectors] - Platform selector config.
 * @returns {object|null} Partial product ({ name, price, currency,
 *   image, brand, sku, availability, extractionMethod }) or `null`
 *   when neither a name nor a price could be read.
 */
export function extractProductFromHtml(html, url, selectors = {}) {
  if (typeof html !== "string" || html.trim() === "") return null;

  let $;
  try {
    $ = load(html);
  } catch {
    return null;
  }

  const layers = [
    extractFromJsonLd($),
    extractFromOpenGraph($),
    extractFromMetaTags($),
    extractFromSelectors($, selectors),
    extractFromSeoText($),
  ];

  const result = { ...emptyFields(), extractionMethod: "unknown" };
  let nameMethod = null;
  let priceMethod = null;

  for (const layer of layers) {
    if (!layer) continue;

    if (result.name === null && layer.name !== null) {
      result.name = layer.name;
      nameMethod = layer.method;
    }
    if (result.price === null && layer.price !== null) {
      result.price = layer.price;
      priceMethod = layer.method;
    }
    if (result.currency === null && layer.currency !== null) {
      result.currency = layer.currency;
    }
    if (result.image === null && layer.image !== null) {
      result.image = layer.image;
    }
    if (result.brand === null && layer.brand !== null) {
      result.brand = layer.brand;
    }
    if (result.sku === null && layer.sku !== null) {
      result.sku = layer.sku;
    }
    if (result.availability === null && layer.availability !== null) {
      result.availability = layer.availability;
    }
  }

  if (result.price !== null) {
    result.extractionMethod = priceMethod ?? "unknown";
  } else if (result.name !== null) {
    result.extractionMethod = nameMethod ?? "unknown";
  }

  result.image = absolutizeUrl(result.image, url);

  if (result.name === null && result.price === null) return null;
  return result;
}
