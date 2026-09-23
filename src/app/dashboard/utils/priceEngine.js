/**
 * Finds the cheapest price source from an array of price sources.
 *
 * @param {Array} priceSources - Array of { store, price, url }
 * @returns {Object} Cheapest source object or default
 */
export const getCheapestSource = (priceSources) => {
  if (!priceSources || !Array.isArray(priceSources) || priceSources.length === 0) {
    return { store: "No Source", price: 0, url: "" };
  }

  const validSources = priceSources.filter(
    (src) => src && src.price !== undefined && src.price !== ""
  );

  if (validSources.length === 0) {
    return { store: "No Source", price: 0, url: "" };
  }

  return validSources.reduce((min, src) => {
    const minPrice = Number(min.price) || 0;
    const srcPrice = Number(src.price) || 0;
    return srcPrice < minPrice ? src : min;
  }, validSources[0]);
};

/**
 * Calculates the total cost for an item based on the cheapest source price and quantity.
 *
 * @param {Object} item - Item object containing priceSources and quantity
 * @returns {number} Item total price
 */
export const getItemTotal = (item) => {
  if (!item) return 0;
  const cheapest = getCheapestSource(item.priceSources);
  const price = Number(cheapest.price) || 0;
  const quantity = Number(item.quantity) || 1;
  return price * quantity;
};

/**
 * Calculates the total estimated cost for a collection of items.
 *
 * @param {Array} items - Array of item objects
 * @returns {number} Total estimated cost for all items
 */
export const getListTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + getItemTotal(item), 0);
};
