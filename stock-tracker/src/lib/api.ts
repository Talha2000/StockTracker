import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';
import type { z } from 'zod';
// A 401 normally means "your session expired mid-visit, go sign in again"
// (see onUnauthorized below). The one exception is AuthProvider's mount-time
// probe (authApi.me()) to check whether a session already exists at all — a
// 401 there is the *expected*, normal result for a logged-out visitor on any
// page, not an expired session, and must not trigger the same redirect (it
// did at first: visiting /register while logged out force-navigated to
// /login, because the probe's own 401 tripped the global handler).
interface AuthRedirectFlag {
  skipAuthRedirect?: boolean;
}
type RequestConfigWithAuthFlag = AxiosRequestConfig & AuthRedirectFlag;
import {
  bookmarksSchema,
  candlesSchema,
  loginResponseSchema,
  meResponseSchema,
  newsSchema,
  profileSchema,
  quoteSchema,
  searchSchema,
} from './schemas';

// Dev uses the Vite proxy to the local API. Production has no hardcoded
// fallback (the API's host changes with where it's deployed, e.g. Vercel's
// generated URL) — set VITE_API_URL on the client's Vercel project.
const envApiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (!envApiUrl && !import.meta.env.DEV) {
  // Fails loudly instead of silently calling the wrong host.
  throw new Error('VITE_API_URL is not set — the client has no API to call.');
}
export const API_URL: string = envApiUrl ?? '/api';

// Auth is an httpOnly cookie the API sets on login: withCredentials makes
// the browser send it on every request and store a new one from any
// Set-Cookie response, cross-origin (client and API are different Vercel
// domains in production). There is no token for this client to hold or
// attach itself anymore — compare to the old Authorization-header approach,
// which kept the token readable by any injected/XSS'd page JS.
export const http = axios.create({ baseURL: API_URL, withCredentials: true });

let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler;
};

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const config = isAxiosError(error) ? (error.config as AuthRedirectFlag | undefined) : undefined;
    if (isAxiosError(error) && error.response?.status === 401 && !config?.skipAuthRedirect) {
      onUnauthorized?.();
    }
    return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
  },
);

// Every response crosses this boundary validated, so the rest of the app never sees `any`.
const get = async <T extends z.ZodType>(
  path: string,
  schema: T,
  params?: Record<string, string | number>,
  config?: RequestConfigWithAuthFlag,
): Promise<z.infer<T>> => {
  const { data } = await http.get<unknown>(path, { params, ...config });
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
  register: async (input: { username: string; password: string }) => {
    await http.post('/auth/register', input);
  },
  logout: async () => {
    await http.post('/auth/logout');
  },
  // The client can't read an httpOnly cookie to know if it's signed in, so
  // this is how AuthProvider checks on first load: a 200 means the cookie
  // is present and still valid, a 401 means it isn't (the expected state for
  // a logged-out visitor — skipAuthRedirect keeps that 401 from triggering
  // the same redirect a *mid-session* expiry would).
  me: () => get('/users/me', meResponseSchema, undefined, { skipAuthRedirect: true }),
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
