import axios, { isAxiosError } from 'axios';
import type { z } from 'zod';
import {
  bookmarksSchema,
  candlesSchema,
  loginResponseSchema,
  newsSchema,
  profileSchema,
  quoteSchema,
  searchSchema,
} from './schemas';
import { getToken } from './session';

// Dev uses the Vite proxy to the local API; production defaults to the hosted API unless overridden.
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.DEV ? '/api' : 'https://stocktrackerapi.onrender.com/api');

export const http = axios.create({ baseURL: API_URL });

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler;
};

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) onUnauthorized?.();
    return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
  },
);

// Every response crosses this boundary validated, so the rest of the app never sees `any`.
const get = async <T extends z.ZodType>(
  path: string,
  schema: T,
  params?: Record<string, string | number>,
): Promise<z.infer<T>> => {
  const { data } = await http.get<unknown>(path, { params });
  return schema.parse(data);
};

export const market = {
  search: (q: string) => get('/market/search', searchSchema, { q }),
  quote: (symbol: string) => get('/market/quote', quoteSchema, { symbol }),
  profile: (symbol: string) => get('/market/profile', profileSchema, { symbol }),
  candles: (symbol: string, resolution: string, from: number, to: number) =>
    get('/market/candles', candlesSchema, { symbol, resolution, from, to }),
  news: (symbol: string, from: string, to: string) =>
    get('/market/news', newsSchema, { symbol, from, to }),
};

export const authApi = {
  login: async (input: { username: string; password: string }) => {
    const { data } = await http.post<unknown>('/auth/login', input);
    return loginResponseSchema.parse(data);
  },
  register: async (input: { username: string; email: string; password: string }) => {
    await http.post('/auth/register', input);
  },
  logout: async () => {
    await http.post('/auth/logout');
  },
};

export const watchlistApi = {
  list: () => get('/stock/getStocks', bookmarksSchema),
  add: async (symbol: string) => {
    await http.post('/stock/saveStock', { symbol });
  },
  remove: async (symbol: string) => {
    await http.post('/stock/removeStock', { symbol });
  },
};
