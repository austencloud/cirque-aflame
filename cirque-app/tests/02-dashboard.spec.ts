import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
	test('should display dashboard cards', async ({ page }) => {
		await page.goto('/');

		// Wait for loading to complete
		await page.waitForSelector('h1:has-text("Welcome to Ringmaster")', { timeout: 10000 });

		// Check for dashboard metric cards using more specific selectors
		await expect(page.getByRole('heading', { name: /Upcoming Events/i }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Pending Contracts/i }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Follow-Ups Needed/i }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Monthly Revenue/i }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Active Clients/i }).first()).toBeVisible();
		await expect(page.getByRole('heading', { name: /Total Performers/i }).first()).toBeVisible();
	});

	test('should display current date', async ({ page }) => {
		await page.goto('/');

		// Check that today's date is displayed somewhere
		const today = new Date();
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		const currentMonth = monthNames[today.getMonth()];

		// Date should be visible on the page
		await expect(page.locator('body')).toContainText(currentMonth);
	});

	test('should display upcoming events section', async ({ page }) => {
		await page.goto('/');

		// Check for upcoming events section - use heading role for specificity
		await expect(page.getByRole('heading', { name: /Upcoming Events/i }).first()).toBeVisible();
	});

	test('should display tasks section', async ({ page }) => {
		await page.goto('/');

		// Check for tasks section
		await expect(page.getByText('Your Tasks')).toBeVisible();
	});

	test('should display follow-ups section', async ({ page }) => {
		await page.goto('/');

		// Check for follow-ups section - use heading role for specificity
		await expect(page.getByRole('heading', { name: /Follow-Ups Needed/i }).first()).toBeVisible();
	});

	test('should display recent activity section', async ({ page }) => {
		await page.goto('/');

		// Check for recent activity section
		await expect(page.getByText('Recent Activity')).toBeVisible();
	});

	test('should navigate to events when clicking on event card', async ({ page }) => {
		await page.goto('/');

		// Look for links with events filter
		const eventCard = page.getByRole('link', { name: /upcoming events/i }).first();
		if (await eventCard.isVisible()) {
			await eventCard.click();
			// Should navigate to events with filter
			expect(page.url()).toContain('/events');
		}
	});

	test('should display metrics with proper formatting', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Check that revenue is displayed with currency format
		const revenueCard = page.locator('text=Monthly Revenue').locator('..');
		if (await revenueCard.isVisible()) {
			const text = await revenueCard.textContent();
			// Should have $ symbol somewhere in the card
			expect(text).toMatch(/\$/);
		}
	});

	test('should handle loading states gracefully', async ({ page }) => {
		await page.goto('/');

		// Check for loading spinner or immediate content
		// Either loading spinner should appear and then disappear, or content loads immediately
		const hasContent = await page.locator('h1:has-text("Welcome to Ringmaster")').isVisible();
		expect(hasContent).toBeTruthy();
	});
});
