import { z } from 'zod';

// Validates what Finnhub/Twelve Data actually send back, mirroring the
// client's own schemas (stock-tracker/src/lib/schemas.ts) — the client
// already validates these, but the server trusting an upstream response
// unchecked means a malformed/unexpected payload gets cached and forwarded
// as-is. Previously: none of this was checked server-side at all.

export const finnhubQuoteSchema = z.object({
  c: z.number(),
  d: z.number().nullable(),
  dp: z.number().nullable(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  pc: z.number(),
  t: z.number(),
});

// Finnhub returns {} for an unknown symbol, so every field is optional.
export const finnhubProfileSchema = z.object({
  name: z.string().optional(),
  ticker: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  exchange: z.string().optional(),
  finnhubIndustry: z.string().optional(),
  marketCapitalization: z.number().optional(),
  logo: z.string().optional(),
  weburl: z.string().optional(),
});

export const finnhubSearchSchema = z.object({
  count: z.number(),
  result: z.array(
    z.object({
      description: z.string(),
      displaySymbol: z.string(),
      symbol: z.string(),
      type: z.string(),
    }),
  ),
});

export const finnhubNewsSchema = z.array(
  z.object({
    id: z.number(),
    headline: z.string(),
    image: z.string(),
    source: z.string(),
    summary: z.string(),
    url: z.string(),
    datetime: z.number(),
  }),
);

export const twelveDataTimeSeriesSchema = z.object({
  status: z.literal('ok'),
  values: z.array(
    z.object({
      datetime: z.string(),
      close: z.string(),
    }),
  ),
});

export const twelveDataErrorSchema = z.object({
  status: z.literal('error'),
  message: z.string().optional(),
});
