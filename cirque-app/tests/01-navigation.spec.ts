import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test('should navigate to homepage', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Ringmaster/);
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');
	});

	test('should have working navigation menu', async ({ page }) => {
		await page.goto('/');

		// Check all navigation links exist
		const nav = page.locator('nav, header').first();
		await expect(nav.getByText('Dashboard')).toBeVisible();
		await expect(nav.getByText('Events')).toBeVisible();
		await expect(nav.getByText('Clients')).toBeVisible();
		await expect(nav.getByText('Performers')).toBeVisible();
		await expect(nav.getByText('Agents')).toBeVisible();
		await expect(nav.getByText('Tasks')).toBeVisible();
	});

	test('should navigate to Events page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /Events/i }).click();
		await expect(page).toHaveURL('/events');
		await expect(page.locator('h1')).toContainText('Events');
	});

	test('should navigate to Clients page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /Clients/i }).click();
		await expect(page).toHaveURL('/clients');
		await expect(page.locator('h1')).toContainText('Clients');
	});

	test('should navigate to Performers page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /Performers/i }).click();
		await expect(page).toHaveURL('/performers');
		await expect(page.locator('h1')).toContainText('Performers');
	});

	test('should navigate to Agents page', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('link', { name: /Agents/i }).click();
		await expect(page).toHaveURL('/agents');
	});

	test('should navigate back to Dashboard from other pages', async ({ page }) => {
		await page.goto('/events');
		await page
			.getByRole('link', { name: /Dashboard/i })
			.first()
			.click();
		await expect(page).toHaveURL('/');
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');
	});

	test('should highlight active navigation item', async ({ page }) => {
		await page.goto('/events');

		// Check if the Events nav item is highlighted (has active styles)
		const eventsLink = page.getByRole('link', { name: /Events/i }).first();
		const classes = await eventsLink.getAttribute('class');
		expect(classes).toContain('text-blue'); // Active state should have blue text
	});

	test('should work on mobile menu', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/');

		// Click hamburger menu
		const menuButton = page
			.getByRole('button', { name: /menu/i })
			.or(page.getByLabel(/toggle menu/i));

		if (await menuButton.isVisible()) {
			await menuButton.click();

			// Check mobile menu is visible
			await expect(page.getByRole('link', { name: /Events/i }).first()).toBeVisible();
			await expect(page.getByRole('link', { name: /Clients/i }).first()).toBeVisible();
		}
	});
});
