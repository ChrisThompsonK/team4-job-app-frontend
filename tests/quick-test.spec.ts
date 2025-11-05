import { test, expect } from '@playwright/test';

test('homepage should load', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const title = await page.title();
  console.log('Page title:', title);
  expect(title).toBeTruthy();
});

test('jobs page should load', async ({ page }) => {
  await page.goto('http://localhost:3000/jobs');
  await page.waitForLoadState('networkidle');
  const content = await page.content();
  expect(content.length).toBeGreaterThan(100);
});
