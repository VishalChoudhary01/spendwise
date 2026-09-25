/**
 * Price normalization (spec Phase 10 examples; used by the Phase 6–9
 * extractors before results reach normalizeProduct).
 *
 *   ₹499        → 499
 *   ₹1,299      → 1299
 *   ₹1,299.50   → 1299.50
 *   Rs. 499     → 499
 *   21499.00    → 21499
 *   499/1kg     → 499        (unit text is ignored — quantity/unit
 *                             belong to the item, never to the price)
 *   "" / free   → null
 *
 * Internal state must store `price: 1299`, never "₹1,299" —
 * formatting happens only at render time (existing comparison UI).
 */

/**
 * Converts an arbitrary price-ish value into a finite, non-negative
 * number, or `null` when no valid price can be read.
 *
 * @param {unknown} value - number | "₹1,299" | "499" | null | ...
 * @returns {number|null}
 */
export function normalizePrice(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  const cleaned = String(value).replace(/[₹$€£]|Rs\.?|INR/gi, " ");

  // First number in the string (commas allowed as thousands
  // separators; a leading "-" is kept so negatives can be rejected).
  const match = cleaned.match(/-?\d[\d,]*\.?\d*/);
  if (!match) return null;

  const price = Number(match[0].replace(/,/g, ""));
  return Number.isFinite(price) && price >= 0 ? price : null;
}
