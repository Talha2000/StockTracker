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

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export const formatShortDate = (seconds: number): string => shortDate.format(seconds * 1000);

export const formatDateTime = (seconds: number): string => dateTime.format(seconds * 1000);

const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

export const formatRelativeTime = (seconds: number, now: Date = new Date()): string => {
  const diff = seconds - now.getTime() / 1000;
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(diff) >= size) return relative.format(Math.round(diff / size), unit);
  }
  return 'just now';
};

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
