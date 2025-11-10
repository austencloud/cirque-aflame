import { test, expect } from '@playwright/test';

test.describe('Performer Detail Page - Direct Navigation', () => {
	test('should display performer detail page when navigating directly', async ({ page }) => {
		// Navigate directly to a performer detail page
		// Using a known performer ID from the seed data
		await page.goto('/performers/performer-1');

		// Wait for page to load
		await page.waitForLoadState('networkidle', { timeout: 10000 });

		// Take a screenshot
		await page.screenshot({ path: 'performer-detail-direct.png', fullPage: true });

		// Check if we're on the detail page by looking for tabs
		const detailsTab = page.locator('text=Details');
		const skillsTab = page.locator('text=Skills');
		const eventsTab = page.locator('text=Events');

		// Log what we can find
		console.log('Details tab visible:', await detailsTab.isVisible().catch(() => false));
		console.log('Skills tab visible:', await skillsTab.isVisible().catch(() => false));
		console.log('Events tab visible:', await eventsTab.isVisible().catch(() => false));

		// Get all text content
		const bodyText = await page.locator('body').textContent();
		console.log('Page text:', bodyText?.substring(0, 500));

		// Check for specific detail page elements
		await expect(detailsTab.first()).toBeVisible({ timeout: 10000 });
	});
});
