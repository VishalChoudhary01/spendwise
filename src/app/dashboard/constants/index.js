import { SUPPORTED_STORE_NAMES } from "../../constants/platforms";

export const UNIT_OPTIONS = [
  { value: "piece", label: "Piece (pcs)" },
  { value: "weight", label: "Weight (kg/g)" },
  { value: "litre", label: "Litre (L)" },
];

/**
 * Store options for the Add/Edit source dropdown.
 *
 * Derived from the canonical platform registry so there is exactly ONE
 * source of truth — the 10 approved platforms:
 *
 *   Amazon, Flipkart, Myntra, JioMart, Zepto, Blinkit, Instamart,
 *   DMart, Reliance Fresh, Local Market
 *
 * No duplicates (legacy "Jio Mart" + "JioMart" entry) and no removed
 * platforms (Big Bazaar, Walmart, eBay, Target, Custom). Old items that
 * still carry a removed/legacy store fall back to the free-text store
 * field in ItemForm instead of re-introducing the option.
 */
export const COMMON_STORES = [...SUPPORTED_STORE_NAMES];
