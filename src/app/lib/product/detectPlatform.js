/**
 * Phase 3 — URL normalization & platform detection.
 *
 * Contract:
 *   detectPlatform(url) -> {
 *     platform:   "amazon" | "flipkart" | "myntra" | "jiomart"
 *                 | "zepto" | "blinkit" | "instamart" | null,
 *     confidence: "high" | "none",
 *     reason:     null | "empty" | "malformed" | "unsupported-scheme"
 *                 | "private-host" | "unsupported-host",
 *     url:        trimmed original URL (preserved for saving/redirect),
 *     hostname:   lowercased hostname ("" when unparsable)
 *   }
 *
 * Rules (spec Phase 3 + 25):
 *  - Accept only http:// and https://.
 *  - Reject empty, malformed, javascript:, data:, file:, localhost,
 *    private IP ranges, and unsupported hosts.
 *  - Detect via the native URL API + registered hostname match.
 *    Never `url.includes("amazon")`.
 *  - Normalize only for comparison: trim, lowercase hostname,
 *    ignore "www.". The original URL is preserved untouched
 *    (query parameters can carry variant/routing info).
 */

import { getPlatformByHost } from "../../constants/platforms.js";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

const PRIVATE_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "0.0.0.0",
  "::1",
  "[::1]",
]);

const PRIVATE_HOST_SUFFIXES = [".local", ".internal", ".localhost"];

/** IPv4 ranges that must never be fetched server-side. */
const PRIVATE_IPV4_PATTERNS = [
  /^127\./, // loopback
  /^10\./, // 10.0.0.0/8
  /^192\.168\./, // 192.168.0.0/16
  /^169\.254\./, // link-local
  /^172\.(1[6-9]|2\d|3[01])\./, // 172.16.0.0/12
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, // CGNAT 100.64.0.0/10
  /^0\./, // "this network"
];

/**
 * Returns true when the hostname points at an internal/private target
 * (localhost, loopback, private IPv4, IPv6 literal, .local, ...).
 */
function isPrivateHostname(hostname) {
  if (!hostname) return false;

  if (PRIVATE_HOSTNAMES.has(hostname)) return true;
  if (hostname.startsWith("[")) return true; // IPv6 literal

  for (const suffix of PRIVATE_HOST_SUFFIXES) {
    if (hostname.endsWith(suffix)) return true;
  }

  return PRIVATE_IPV4_PATTERNS.some((pattern) => pattern.test(hostname));
}

/**
 * Instamart shares swiggy.com with regular Swiggy food pages, so the
 * shared host alone is not enough — the path/query must point at
 * Instamart (spec: inspect pathname for shared hosts / page types).
 */
function hasInstamartEvidence(parsedUrl) {
  const haystack = `${parsedUrl.pathname}${parsedUrl.search}`.toLowerCase();
  return haystack.includes("instamart");
}

/**
 * Detects the product platform for a pasted URL.
 *
 * @param {string} rawUrl - Untrusted, user-pasted URL.
 * @returns {{platform: string|null, confidence: string, reason: string|null,
 *            url: string, hostname: string}}
 */
export function detectPlatform(rawUrl) {
  const fail = (reason, url = "", hostname = "") => ({
    platform: null,
    confidence: "none",
    reason,
    url,
    hostname,
  });

  if (typeof rawUrl !== "string" || rawUrl.trim() === "") {
    return fail("empty");
  }

  // Preserve the original (only trimmed) for saving/redirecting.
  const url = rawUrl.trim();

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return fail("malformed", url);
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return fail("unsupported-scheme", url);
  }

  // URL API already lowercases the hostname.
  const hostname = parsed.hostname.toLowerCase();

  if (isPrivateHostname(hostname)) {
    return fail("private-host", url, hostname);
  }

  const platform = getPlatformByHost(hostname);
  if (!platform) {
    return fail("unsupported-host", url, hostname);
  }

  if (platform.id === "instamart" && !hasInstamartEvidence(parsed)) {
    return fail("unsupported-host", url, hostname);
  }

  return {
    platform: platform.id,
    confidence: "high",
    reason: null,
    url,
    hostname,
  };
}

/** Convenience boolean wrapper around detectPlatform(). */
export function isSupportedProductUrl(rawUrl) {
  return detectPlatform(rawUrl).confidence === "high";
}
