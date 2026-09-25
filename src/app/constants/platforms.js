/**
 * Central registry of supported product platforms.
 *
 * Single source of truth for:
 *  - host-based URL detection
 *  - store display names
 *  - platform brand assets
 *
 * Detection must always use the native `URL` API + hostname matching.
 * Never `url.includes("amazon")`.
 */

export const PRODUCT_PLATFORMS = {
  amazon: {
    id: "amazon",
    name: "Amazon",
    hosts: ["amazon.in", "www.amazon.in", "amazon.com", "www.amazon.com"],
    // Amazon renders from the project's React icon set (no image asset).
    badgeType: "icon",
    badge: null,
  },

  flipkart: {
    id: "flipkart",
    name: "Flipkart",
    hosts: ["flipkart.com", "www.flipkart.com"],
    badgeType: "image",
    badge: "/images/svg/platform/flipkart.svg",
  },

  myntra: {
    id: "myntra",
    name: "Myntra",
    hosts: ["myntra.com", "www.myntra.com"],
    badgeType: "image",
    badge: "/images/svg/platform/myntra.svg",
  },

  jiomart: {
    id: "jiomart",
    name: "JioMart",
    hosts: ["jiomart.com", "www.jiomart.com"],
    badgeType: "image",
    badge: "/images/svg/platform/jiomart-seeklogo.svg",
  },

  zepto: {
    id: "zepto",
    name: "Zepto",
    hosts: ["zeptonow.com", "www.zeptonow.com"],
    badgeType: "image",
    badge: "/images/svg/platform/Zepto.png",
  },

  blinkit: {
    id: "blinkit",
    name: "Blinkit",
    hosts: ["blinkit.com", "www.blinkit.com"],
    badgeType: "image",
    badge: "/images/svg/platform/blinkit.jpeg",
  },

  instamart: {
    id: "instamart",
    name: "Instamart",
    hosts: ["swiggy.com", "www.swiggy.com"],
    badgeType: "image",
    badge: "/images/svg/platform/instamart.png",
  },

  dmart: {
    id: "dmart",
    name: "DMart",
    hosts: ["dmart.in", "www.dmart.in"],
    badgeType: "image",
    badge: "/images/svg/platform/D-Mart.svg",
  },

  "reliance-fresh": {
    id: "reliance-fresh",
    name: "Reliance Fresh",
    hosts: ["reliancefresh.com", "www.reliancefresh.com"],
    badgeType: "image",
    badge: "/images/svg/platform/reliance-fresh-seeklogo.svg",
  },

  "local-market": {
    id: "local-market",
    name: "Local Market",
    hosts: [],
    badgeType: "image",
    badge: "/images/svg/platform/local-market.svg",
  },
};

/** Platform ids in display order. */
export const PLATFORM_IDS = Object.keys(PRODUCT_PLATFORMS);

/**
 * Store display names offered in the Add Store select.
 * Exactly the 10 approved platforms — removed platforms (Big Bazaar,
 * Walmart, eBay, Target, Custom) must never reappear here.
 */
export const SUPPORTED_STORE_NAMES = PLATFORM_IDS.map(
  (id) => PRODUCT_PLATFORMS[id].name
);

/**
 * Map of normalized store display name -> platform id.
 * "JioMart" and legacy "Jio Mart" both resolve to `jiomart`.
 */
const STORE_NAME_TO_PLATFORM = {};
for (const id of PLATFORM_IDS) {
  const platform = PRODUCT_PLATFORMS[id];
  STORE_NAME_TO_PLATFORM[platform.name.trim().toLowerCase().replace(/\s+/g, " ")] = id;
}
STORE_NAME_TO_PLATFORM["jio mart"] = "jiomart";

/** Lookup helpers ------------------------------------------------------- */

/** Returns the platform registry entry for an id, or null. */
export function getPlatformById(platformId) {
  if (!platformId) return null;
  return PRODUCT_PLATFORMS[platformId] ?? null;
}

/**
 * Returns the platform whose registered hosts include the given
 * normalized (lowercase, www-insensitive) hostname, or null.
 */
export function getPlatformByHost(hostname) {
  if (!hostname) return null;
  const normalized = String(hostname).trim().toLowerCase();
  const bare = normalized.startsWith("www.") ? normalized.slice(4) : normalized;

  for (const id of PLATFORM_IDS) {
    const hosts = PRODUCT_PLATFORMS[id].hosts;
    for (const host of hosts) {
      const bareHost = host.startsWith("www.") ? host.slice(4) : host;
      // Exact match, or a subdomain of the retailer's own domain.
      // The leading dot prevents suffix attacks ("notamazon.in").
      if (
        bare === bareHost ||
        normalized === host ||
        bare.endsWith(`.${bareHost}`)
      ) {
        return PRODUCT_PLATFORMS[id];
      }
    }
  }
  return null;
}

/**
 * Returns the platform id for a store display name (e.g. "Amazon",
 * "Jio Mart"), or null when the store is a custom/manual entry.
 */
export function getPlatformByStoreName(storeName) {
  if (!storeName) return null;
  const key = String(storeName).trim().toLowerCase().replace(/\s+/g, " ");
  const id = STORE_NAME_TO_PLATFORM[key];
  return id ?? null;
}

/**
 * Resolves the platform id for a source that may predate the platform
 * registry. Safe fallback keeps old persisted sources rendering.
 */
export function resolveSourcePlatform(source) {
  if (!source) return null;
  if (source.platform && PRODUCT_PLATFORMS[source.platform]) {
    return source.platform;
  }
  return getPlatformByStoreName(source.store);
}
