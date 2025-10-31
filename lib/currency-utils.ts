export const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.85 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.73 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.25 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 750 },
  { code: "ZAR", symbol: "R", name: "South African Rand", rate: 18.5 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 110 },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi", rate: 12 },
  { code: "EGP", symbol: "£E", name: "Egyptian Pound", rate: 31 },
  { code: "MAD", symbol: "DH", name: "Moroccan Dirham", rate: 10 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 110 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 6.5 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 83 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.35 },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", rate: 0.92 },
];

export function getCurrencySymbol(currencyCode: string): string {
  const currency = currencies.find((c) => c.code === currencyCode);
  return currency?.symbol || "$";
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString()}`;
}

export function getSelectedCurrency(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedCurrency") || "NGN";
  }
  return "NGN";
}

// Function to convert snake_case to Title Case
export function snakeToTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Function to get a random color from an array
export function getRandomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to shuffle an array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
