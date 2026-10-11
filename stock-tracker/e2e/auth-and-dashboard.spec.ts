import { expect, test } from '@playwright/test';
import { mockApi } from './fixtures/mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('unauthenticated visitors are sent to login', async ({ page }) => {
  await page.goto('/META');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
});

test('visiting /register while logged out stays on /register', async ({ page }) => {
  // Regression test: the mount-time "am I already logged in?" check
  // (GET /users/me) used to share the same 401-handler as a mid-session
  // expiry, so its *expected* 401 for a logged-out visitor force-navigated
  // away to /login from every page, including /register itself.
  await page.goto('/register');
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();
});

test('shows an error for wrong credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('nope');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Incorrect credentials');
});

test('signs in and shows the stock dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('Correct1!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/META$/);
  await expect(page.getByRole('heading', { name: 'META' })).toBeVisible();
  await expect(page.getByText('$512.34')).toBeVisible();
  await expect(page.getByText('Meta Platforms Inc')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove META from watchlist' })).toBeVisible();
});

test('stays signed in across a reload (session cookie, not client-held token)', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('Correct1!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/META$/);

  await page.reload();
  // Should land back on the dashboard, not get bounced to /login — proves
  // the auth check (GET /users/me) runs and is awaited before any redirect.
  await expect(page).toHaveURL(/\/META$/);
  await expect(page.getByRole('heading', { name: 'META' })).toBeVisible();
});

test('rejects invalid symbols in the URL', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('Correct1!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.goto('/%3Cscript%3E');
  await expect(page.getByText('That is not a valid stock symbol.')).toBeVisible();
});
