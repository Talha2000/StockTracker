import { z } from 'zod';

export const quoteSchema = z.object({
  c: z.number(),
  d: z.number().nullable(),
  dp: z.number().nullable(),
  h: z.number(),
  l: z.number(),
  o: z.number(),
  pc: z.number(),
  t: z.number(),
});
export type Quote = z.infer<typeof quoteSchema>;

// Finnhub returns `{}` for unknown symbols, so every field is optional.
export const profileSchema = z.object({
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
export type Profile = z.infer<typeof profileSchema>;

export const candlesSchema = z.object({
  s: z.string(),
  c: z.array(z.number()).optional(),
  t: z.array(z.number()).optional(),
});
export type Candles = z.infer<typeof candlesSchema>;

export const newsItemSchema = z.object({
  id: z.number(),
  headline: z.string(),
  image: z.string(),
  source: z.string(),
  summary: z.string(),
  url: z.string(),
  datetime: z.number(),
});
export type NewsItem = z.infer<typeof newsItemSchema>;
export const newsSchema = z.array(newsItemSchema);

export const searchSchema = z.object({
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
export type SearchResult = z.infer<typeof searchSchema>['result'][number];

export const bookmarksSchema = z.array(z.object({ id: z.string(), stockSymbol: z.string() }));
export type Bookmark = z.infer<typeof bookmarksSchema>[number];

export const loginResponseSchema = z.object({ token: z.string() });
