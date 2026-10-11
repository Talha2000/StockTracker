import axios, { isAxiosError, type AxiosRequestConfig } from 'axios';
import type { z } from 'zod';
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

// A 401 normally means "your session expired mid-visit, go sign in again"
// (see onUnauthorized below). Two exceptions, both "expected" 401s that must
// not trigger that redirect: AuthProvider's mount-time probe (authApi.me())
// checking whether a session already exists at all — it did at first,
// force-navigating every page (including /register) to /login just from
// visiting it logged out — and a failed login attempt itself (401 is also
// how the server now signals bad credentials, see authController.login;
// redirecting "back to /login" from the login page itself would be a no-op
// at best and clobber the error message at worst).
interface AuthRedirectFlag {
  skipAuthRedirect?: boolean;
}
type RequestConfigWithAuthFlag = AxiosRequestConfig & AuthRedirectFlag;

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
// X-Requested-With on every request: a lightweight CSRF mitigation the API's
// requireCsrfHeader middleware checks for on state-changing routes — a
// cross-site form submission can't set a custom header, only
// same-origin-or-CORS-permitted JS can (see API/Middleware/csrf.ts).
export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

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
    const config: RequestConfigWithAuthFlag = { skipAuthRedirect: true };
    const { data } = await http.post<unknown>('/auth/login', input, config);
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
