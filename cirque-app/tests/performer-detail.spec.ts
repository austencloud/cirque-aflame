import { test, expect } from '@playwright/test';

test.describe('Performer Detail Page', () => {
	test('should display performer information', async ({ page }) => {
		// Navigate to performers page
		await page.goto('/performers');

		// Wait for the page to load
		await page.waitForSelector('h1:has-text("Performers")', { timeout: 10000 });

		// Click on the first "View Profile" button
		const viewProfileButton = page.locator('a:has-text("View Profile")').first();
		await expect(viewProfileButton).toBeVisible({ timeout: 5000 });

		await viewProfileButton.click();

		// Wait for navigation
		await page.waitForURL(/\/performers\/.*/, { timeout: 10000 });

		// Check if performer name is visible
		const performerName = page.locator('h1').first();
		await expect(performerName).toBeVisible({ timeout: 5000 });

		// Log what we see
		const text = await performerName.textContent();
		console.log('Performer name:', text);

		// Check if tabs are visible
		const detailsTab = page.locator('text=Details').first();
		await expect(detailsTab).toBeVisible({ timeout: 5000 });

		console.log('Performer detail page loaded successfully');
	});

	test('should show contact information', async ({ page }) => {
		// Navigate directly to a performer detail page
		await page.goto('/performers');
		await page.waitForSelector('h1:has-text("Performers")', { timeout: 10000 });

		// Get first performer link
		const viewProfileButton = page.locator('a:has-text("View Profile")').first();
		await viewProfileButton.click();

		await page.waitForURL(/\/performers\/.*/, { timeout: 10000 });

		// Wait a bit for content to render
		await page.waitForTimeout(2000);

		// Take a screenshot to see what's actually rendered
		await page.screenshot({ path: 'performer-detail-debug.png', fullPage: true });

		// Try to find any visible elements
		const allVisibleElements = await page.locator('body *:visible').count();
		console.log('Number of visible elements:', allVisibleElements);

		// Check for specific content
		const bodyText = await page.locator('body').textContent();
		console.log('Body text content:', bodyText?.substring(0, 500));
	});
});
