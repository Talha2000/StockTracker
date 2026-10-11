import type { Page } from '@playwright/test';

export const quoteFixture = {
  c: 512.34,
  d: 4.21,
  dp: 0.83,
  h: 515,
  l: 508,
  o: 509,
  pc: 508.13,
  t: 1,
};
export const profileFixture = {
  name: 'Meta Platforms Inc',
  ticker: 'META',
  country: 'US',
  currency: 'USD',
  exchange: 'NASDAQ NMS - GLOBAL MARKET',
  finnhubIndustry: 'Media',
  marketCapitalization: 1_300_000,
};

const json = (body: unknown, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body),
});

/** Mocks every /api call so tests never touch real market data or the real backend. */
export const mockApi = async (page: Page, options: { watchlist?: string[] } = {}) => {
  const watchlist = options.watchlist ?? ['META'];
  // Auth is a real httpOnly cookie in prod, which the browser manages for
  // us even against a mocked route — so a plain server-side flag here is
  // enough to fake "is there a valid session" across the mocked /login and
  // /me endpoints, without needing to fabricate a real cookie.
  let loggedInAs: string | null = null;

  await page.route('**/api/auth/login', async (route) => {
    const body = route.request().postDataJSON() as { username?: string; password?: string };
    if (body.password === 'Correct1!' && body.username) {
      loggedInAs = body.username;
      await route.fulfill(json({ username: body.username }));
    } else {
      await route.fulfill(json('Wrong username or password!', 400));
    }
  });
  await page.route('**/api/auth/logout', async (route) => {
    loggedInAs = null;
    await route.fulfill(json('ok'));
  });
  await page.route('**/api/users/me', async (route) => {
    if (loggedInAs) {
      await route.fulfill(json({ id: 'u1', username: loggedInAs }));
    } else {
      await route.fulfill(json({ message: 'Unauthorized' }, 401));
    }
  });
  await page.route('**/api/stock/getStocks', (route) =>
    route.fulfill(json(watchlist.map((stockSymbol) => ({ id: 'u1', stockSymbol })))),
  );
  await page.route('**/api/market/quote*', (route) => route.fulfill(json(quoteFixture)));
  await page.route('**/api/market/profile*', (route) => route.fulfill(json(profileFixture)));
  await page.route('**/api/market/news*', (route) => route.fulfill(json([])));
  await page.route('**/api/market/candles*', (route) =>
    route.fulfill(
      json({ s: 'ok', c: [500, 505, 512], t: [1_700_000_000, 1_700_086_400, 1_700_172_800] }),
    ),
  );
  await page.route('**/api/market/search*', (route) =>
    route.fulfill(
      json({
        count: 1,
        result: [
          {
            description: 'META PLATFORMS INC',
            displaySymbol: 'META',
            symbol: 'META',
            type: 'Common Stock',
          },
        ],
      }),
    ),
  );
};
