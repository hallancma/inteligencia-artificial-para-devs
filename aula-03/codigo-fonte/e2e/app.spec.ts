import { test, expect } from '@playwright/test'

test('homepage displays the main heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('IA para Devs')).toBeVisible()
})

test('homepage shows API status indicator', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('API Status')).toBeVisible()
})
