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

test('rejects invalid symbols in the URL', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Username').fill('alice');
  await page.getByLabel('Password').fill('Correct1!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.goto('/%3Cscript%3E');
  await expect(page.getByText('That is not a valid stock symbol.')).toBeVisible();
});
