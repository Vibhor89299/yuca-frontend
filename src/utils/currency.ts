/**
 * Formats a number as Indian Rupees
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted price string
 */
export function formatIndianPrice(amount: number, options: { compact?: boolean } = {}) {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...(options.compact && {
      notation: 'compact',
      compactDisplay: 'short',
    }),
  });

  return formatter.format(amount);
}

/**
 * Example usage:
 * formatIndianPrice(199999) => "₹1,99,999"
 * formatIndianPrice(1999999, { compact: true }) => "₹20L"
 */
