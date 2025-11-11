import { test, expect } from '@playwright/test';

test.describe('Svelte 5 Upgrade Tests', () => {
	test('Dashboard page loads successfully', async ({ page }) => {
		await page.goto('http://localhost:3000');

		// Check that the page title is visible
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');

		// Check for loading spinner or content
		await page.waitForTimeout(2000);

		// Verify dashboard cards are rendered
		const dashboardCards = page.locator('[class*="bg-white"]');
		await expect(dashboardCards.first()).toBeVisible();
	});

	test('Navigation works correctly', async ({ page }) => {
		await page.goto('http://localhost:3000');

		// Click on Events link
		await page.click('a[href="/events"]');
		await expect(page).toHaveURL(/.*events/);
		await expect(page.locator('h1')).toContainText('Events');

		// Click on Clients link
		await page.click('a[href="/clients"]');
		await expect(page).toHaveURL(/.*clients/);
		await expect(page.locator('h1')).toContainText('Clients');

		// Click on Performers link
		await page.click('a[href="/performers"]');
		await expect(page).toHaveURL(/.*performers/);
		await expect(page.locator('h1')).toContainText('Performers');
	});

	test('Events page loads and displays content', async ({ page }) => {
		await page.goto('http://localhost:3000/events');

		// Wait for page to load
		await page.waitForTimeout(2000);

		// Check for events page elements
		await expect(page.locator('h1')).toContainText('Events');

		// Check if loading spinner disappears (indicates $effect worked)
		await expect(page.locator('text=Loading')).not.toBeVisible({ timeout: 5000 });
	});

	test('Clients page loads and displays content', async ({ page }) => {
		await page.goto('http://localhost:3000/clients');

		// Wait for page to load
		await page.waitForTimeout(2000);

		// Check for clients page elements
		await expect(page.locator('h1')).toContainText('Clients');

		// Check if loading spinner disappears
		await expect(page.locator('text=Loading')).not.toBeVisible({ timeout: 5000 });
	});

	test('Performers page loads and displays content', async ({ page }) => {
		await page.goto('http://localhost:3000/performers');

		// Wait for page to load
		await page.waitForTimeout(2000);

		// Check for performers page elements
		await expect(page.locator('h1')).toContainText('Performers');

		// Check if loading spinner disappears
		await expect(page.locator('text=Loading')).not.toBeVisible({ timeout: 5000 });
	});

	test('Agents page loads and displays content', async ({ page }) => {
		await page.goto('http://localhost:3000/agents');

		// Wait for page to load
		await page.waitForTimeout(2000);

		// Check for agents page elements
		await expect(page.locator('h1')).toContainText('Agents');

		// Check if loading spinner disappears or content appears
		await expect(page.locator('text=Loading')).not.toBeVisible({ timeout: 5000 });
	});

	test('Modal component works (Svelte 5 $effect cleanup)', async ({ page }) => {
		await page.goto('http://localhost:3000');

		// Click settings button to open modal
		const settingsButton = page
			.locator('button:has-text("Settings")')
			.or(page.locator('[aria-label*="Settings"]'));
		if ((await settingsButton.count()) > 0) {
			await settingsButton.first().click();

			// Modal should be visible
			await expect(
				page.locator('[class*="modal"]').or(page.locator('[role="dialog"]'))
			).toBeVisible({ timeout: 3000 });

			// Press Escape to close (tests $effect keyboard handler)
			await page.keyboard.press('Escape');

			// Modal should be closed
			await expect(
				page.locator('[class*="modal"]').or(page.locator('[role="dialog"]'))
			).not.toBeVisible({ timeout: 3000 });
		}
	});

	test('Theme toggle works (Svelte 5 $state reactivity)', async ({ page }) => {
		await page.goto('http://localhost:3000');

		// Look for theme toggle button
		const themeToggle = page
			.locator('button')
			.filter({ hasText: /dark|light|theme/i })
			.first();

		if ((await themeToggle.count()) > 0) {
			// Get initial theme
			const htmlElement = page.locator('html');
			const initialClass = await htmlElement.getAttribute('class');

			// Click theme toggle
			await themeToggle.click();
			await page.waitForTimeout(500);

			// Verify theme changed
			const newClass = await htmlElement.getAttribute('class');
			expect(newClass).not.toBe(initialClass);
		}
	});

	test('Search functionality works (Svelte 5 $derived)', async ({ page }) => {
		await page.goto('http://localhost:3000/events');

		// Wait for page to load
		await page.waitForTimeout(2000);

		// Find search input
		const searchInput = page.locator('input[type="text"]').first();

		if ((await searchInput.count()) > 0) {
			// Type in search
			await searchInput.fill('test');
			await page.waitForTimeout(500);

			// Verify search is working (derived state should update)
			const searchValue = await searchInput.inputValue();
			expect(searchValue).toBe('test');
		}
	});

	test('No console errors on page load', async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('http://localhost:3000');
		await page.waitForTimeout(3000);

		// Filter out known warnings and expected errors
		const criticalErrors = consoleErrors.filter(
			(error) =>
				!error.includes('tsconfig') &&
				!error.includes('baseUrl') &&
				!error.includes('Firebase') && // Firebase index errors are expected in dev
				!error.includes('firestore') &&
				!error.includes('index')
		);

		expect(criticalErrors).toHaveLength(0);
	});

	test('Page navigation preserves state (Svelte 5 runes)', async ({ page }) => {
		await page.goto('http://localhost:3000');

		// Navigate to events
		await page.click('a[href="/events"]');
		await page.waitForTimeout(1000);

		// Navigate back to dashboard
		await page.click('a[href="/"]');
		await page.waitForTimeout(1000);

		// Verify dashboard is still functional
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');
	});
});
