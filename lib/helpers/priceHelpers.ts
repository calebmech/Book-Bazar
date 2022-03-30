/**
 * Returns the given string price as a float if it is a valid price, and null if the string price is not valid
 *
 * @param price a string that represents a float
 * @returns the given string price as a float if it is a valid price, and null if the string price is not valid
 */
export function getFloatStringPriceAsNumber(price: string): number | null {
  const asFloat = Number.parseFloat(price);
  if (isPriceValid(asFloat)) {
    return asFloat;
  }
  return null;
}

/**
 * Returns the given string price as an int if it is a valid price, and null if the string price is not valid
 *
 * @param price a string that represents an int
 * @returns the given string price as a int if it is a valid price, and null if the string price is not valid
 */
export function getIntStringPriceAsNumber(price: string): number | null {
  const asInt = Number.parseInt(price);
  if (isPriceValid(asInt)) {
    return asInt;
  }
  return null;
}

/**
 * Formats a price and returns it as a string
 *
 * @param price int price
 * @returns formatted price as a string
 */
export function formatIntPrice(price: number): string {
  if (price % 100 == 0) {
    // No cents value
    return (price / 100).toFixed(0);
  }

  return (price / 100).toFixed(2);
}

function isPriceValid(price: number) {
  return !Number.isNaN(price) && Number.isFinite(price) && price >= 0;
}

/**
 * Get suggested used price from a new price
 *
 * Price is approximately 60% of new price
 *
 * @param newPrice int new price
 * @returns formatted used price as a string
 */
export function getSuggestedUsedPrice(newPrice?: number): string {
  return (Math.round(((newPrice ?? 5000) / 1000) * 0.6) * 10).toFixed(2);
}
