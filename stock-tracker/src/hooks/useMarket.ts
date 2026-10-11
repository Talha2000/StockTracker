import { useQueries, useQuery } from '@tanstack/react-query';
import { market } from '@/lib/api';
import { chartRanges, type ChartRange } from '@/lib/chartRanges';
import { daysAgo, toIsoDate, toUnixSeconds } from '@/lib/format';

const MINUTE = 60_000;

const quoteQuery = (symbol: string) => ({
  queryKey: ['quote', symbol],
  queryFn: () => market.quote(symbol),
  refetchInterval: MINUTE,
});

const profileQuery = (symbol: string) => ({
  queryKey: ['profile', symbol],
  queryFn: () => market.profile(symbol),
  staleTime: 60 * MINUTE,
});

export const useQuote = (symbol: string) => useQuery(quoteQuery(symbol));

export const useProfile = (symbol: string) => useQuery(profileQuery(symbol));

/** One result per symbol, same order; shares the cache with useQuote/useProfile. */
export const useQuotes = (symbols: string[]) => useQueries({ queries: symbols.map(quoteQuery) });

export const useProfiles = (symbols: string[]) =>
  useQueries({ queries: symbols.map(profileQuery) });

export const useNews = (symbol: string) =>
  useQuery({
    queryKey: ['news', symbol],
    queryFn: () => {
      const now = new Date();
      return market.news(symbol, toIsoDate(daysAgo(30, now)), toIsoDate(now));
    },
    staleTime: 5 * MINUTE,
  });

export const useCandles = (symbol: string, range: ChartRange) =>
  useQuery({
    queryKey: ['candles', symbol, range],
    queryFn: async () => {
      const { resolution, days } = chartRanges[range];
      const now = new Date();
      const candles = await market.candles(
        symbol,
        resolution,
        toUnixSeconds(daysAgo(days, now)),
        toUnixSeconds(now),
      );
      const closes = candles.c ?? [];
      const times = candles.t ?? [];
      return closes.flatMap((value, index) => {
        const time = times[index];
        return time === undefined ? [] : [{ value, time }];
      });
    },
    staleTime: 5 * MINUTE,
    retry: false,
  });

export const useSymbolSearch = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: () => market.search(query),
    enabled: query.length > 0,
    staleTime: 5 * MINUTE,
  });
