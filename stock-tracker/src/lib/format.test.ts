import { describe, expect, it } from 'vitest';
import {
  daysAgo,
  formatChange,
  formatMarketCap,
  formatPercent,
  formatPrice,
  isValidSymbol,
  safeUrl,
} from './format';

describe('formatters', () => {
  it('formats prices and handles missing values', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50');
    expect(formatPrice(null)).toBe('—');
  });

  it('signs positive changes only', () => {
    expect(formatChange(1.234)).toBe('+1.23');
    expect(formatChange(-1.234)).toBe('-1.23');
    expect(formatPercent(0.5)).toBe('+0.50%');
    expect(formatPercent(undefined)).toBe('—');
  });

  it('converts market cap from millions', () => {
    expect(formatMarketCap(250_000)).toBe('250.00B');
    expect(formatMarketCap(2_500_000)).toBe('2.50T');
    expect(formatMarketCap(undefined)).toBe('—');
  });

  it('computes past dates without mutating the input', () => {
    const now = new Date('2026-03-10T12:00:00Z');
    expect(daysAgo(7, now).getUTCDate()).toBe(3);
    expect(now.getUTCDate()).toBe(10);
  });
});

describe('safeUrl', () => {
  it('allows http(s) and rejects other schemes', () => {
    expect(safeUrl('https://example.com/a')).toBe('https://example.com/a');
    expect(safeUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeUrl('not a url')).toBeUndefined();
  });
});

describe('isValidSymbol', () => {
  it('accepts tickers and rejects junk', () => {
    expect(isValidSymbol('META')).toBe(true);
    expect(isValidSymbol('BRK.B')).toBe(true);
    expect(isValidSymbol('a/b')).toBe(false);
    expect(isValidSymbol('<script>')).toBe(false);
    expect(isValidSymbol(undefined)).toBe(false);
  });
});
