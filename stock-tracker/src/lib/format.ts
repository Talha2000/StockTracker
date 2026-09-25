const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value: number | null | undefined): string =>
  value == null ? '—' : usd.format(value);

export const formatChange = (value: number | null | undefined): string =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(2)}`;

export const formatPercent = (value: number | null | undefined): string =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;

// Finnhub reports market cap in millions.
export const formatMarketCap = (millions: number | undefined): string => {
  if (millions == null) return '—';
  return millions >= 1_000_000
    ? `${(millions / 1_000_000).toFixed(2)}T`
    : `${(millions / 1000).toFixed(2)}B`;
};

// Finnhub takes unix seconds.
export const toUnixSeconds = (date: Date): number => Math.floor(date.getTime() / 1000);

export const fromUnixSeconds = (seconds: number): string =>
  new Date(seconds * 1000).toLocaleDateString();

export const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const daysAgo = (days: number, from: Date = new Date()): Date => {
  const date = new Date(from);
  date.setDate(date.getDate() - days);
  return date;
};

// News URLs come from a third party: only ever link http(s) to avoid `javascript:` hrefs.
export const safeUrl = (url: string): string | undefined => {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:' ? url : undefined;
  } catch {
    return undefined;
  }
};

// Symbols are user-controlled route params.
export const isValidSymbol = (symbol: string | undefined): symbol is string =>
  symbol !== undefined && /^[A-Za-z0-9.\-:^]{1,20}$/.test(symbol);
