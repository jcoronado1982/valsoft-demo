import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login page with LAUNCH brand', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('LAUNCH');
  });

  test('should show Sign in text', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('.brand-subtitle')).toContainText('Sign in to');
  });

  test('should have Google sign-in button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#googleBtn')).toBeVisible();
  });

  test('should redirect root to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });
});
