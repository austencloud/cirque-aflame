import { test, expect } from '@playwright/test';

/**
 * Comprehensive Navigation Tests
 * Tests EVERY navigation path in the application to catch 404s and broken links
 */

test.describe('Comprehensive Navigation Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:3000/');
		await page.waitForLoadState('domcontentloaded');
		await page.waitForTimeout(2000); // Wait for initial render
	});

	test('Dashboard page loads without errors', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');

		// Check for no 404 or error messages
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
		await expect(page.locator('text=Internal Error')).not.toBeVisible();
	});

	test('Events page loads without errors', async ({ page }) => {
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Events');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Clients page loads without errors', async ({ page }) => {
		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Clients');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Performers page loads without errors', async ({ page }) => {
		await page.click('a[href="/performers"]');
		await page.waitForURL('**/performers');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Performers');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Agents page loads without errors', async ({ page }) => {
		await page.click('a[href="/agents"]');
		await page.waitForURL('**/agents');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Agents');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Contracts page loads without errors', async ({ page }) => {
		await page.click('a[href="/contracts"]');
		await page.waitForURL('**/contracts');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Contracts');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Tasks page loads without errors', async ({ page }) => {
		await page.click('a[href="/tasks"]');
		await page.waitForURL('**/tasks');
		await page.waitForTimeout(2000);

		await expect(page.locator('h1')).toContainText('Tasks');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('Add Agent button navigates to new agent page', async ({ page }) => {
		// Navigate to agents
		await page.click('a[href="/agents"]');
		await page.waitForURL('**/agents');
		await page.waitForTimeout(2000);

		// Click Add Agent button
		const addButton = page.locator('button:has-text("Add Agent")').first();
		await addButton.click();

		// Should navigate to /agents/new
		await page.waitForURL('**/agents/new');
		await page.waitForTimeout(2000);

		// Check page loaded (even if it's a placeholder)
		await expect(page.locator('h1')).toContainText('Add New Agent');
		await expect(page.locator('text=404')).not.toBeVisible();
		await expect(page.locator('text=Not Found')).not.toBeVisible();
	});

	test('All navigation links are highlighted correctly', async ({ page }) => {
		const navTests = [
			{ href: '/', expectedText: 'Welcome to Ringmaster' },
			{ href: '/events', expectedText: 'Events' },
			{ href: '/clients', expectedText: 'Clients' },
			{ href: '/performers', expectedText: 'Performers' },
			{ href: '/agents', expectedText: 'Agents' },
			{ href: '/contracts', expectedText: 'Contracts' },
			{ href: '/tasks', expectedText: 'Tasks' }
		];

		for (const navTest of navTests) {
			// Navigate to page
			await page.click(`a[href="${navTest.href}"]`);
			await page.waitForURL(`**${navTest.href}`);
			await page.waitForTimeout(2000);

			// Verify page loaded
			await expect(page.locator('h1')).toContainText(navTest.expectedText);

			// Verify navigation link is highlighted
			const navLink = page.locator(`a[href="${navTest.href}"]`).first();
			const classes = await navLink.getAttribute('class');
			expect(classes).toContain('bg-blue-50');

			// Verify aria-current is set
			const ariaCurrent = await navLink.getAttribute('aria-current');
			expect(ariaCurrent).toBe('page');
		}
	});

	test('All pages have proper page titles', async ({ page }) => {
		const pages = [
			{ url: '/', title: /Ringmaster/ },
			{ url: '/events', title: /Ringmaster/ },
			{ url: '/clients', title: /Ringmaster/ },
			{ url: '/performers', title: /Ringmaster/ },
			{ url: '/agents', title: /Ringmaster/ },
			{ url: '/contracts', title: /Ringmaster/ },
			{ url: '/tasks', title: /Ringmaster/ }
		];

		for (const pageTest of pages) {
			await page.goto(`http://localhost:3000${pageTest.url}`);
			await page.waitForTimeout(2000);
			await expect(page).toHaveTitle(pageTest.title);
		}
	});

	test('No console errors on any page', async ({ page }) => {
		const errors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				const text = msg.text();
				// Filter out expected Firebase warnings
				if (!text.includes('Firebase') && !text.includes('index')) {
					errors.push(text);
				}
			}
		});

		const pages = ['/', '/events', '/clients', '/performers', '/agents', '/contracts', '/tasks'];

		for (const url of pages) {
			await page.goto(`http://localhost:3000${url}`);
			await page.waitForTimeout(2000);
			await page.waitForTimeout(1000); // Wait for any async errors
		}

		expect(errors).toHaveLength(0);
	});

	test('Search functionality works on all list pages', async ({ page }) => {
		const searchPages = [
			{ url: '/events', searchText: 'test' },
			{ url: '/clients', searchText: 'test' },
			{ url: '/performers', searchText: 'test' },
			{ url: '/agents', searchText: 'test' },
			{ url: '/contracts', searchText: 'test' },
			{ url: '/tasks', searchText: 'test' }
		];

		for (const searchPage of searchPages) {
			await page.goto(`http://localhost:3000${searchPage.url}`);
			await page.waitForTimeout(2000);

			// Find search input
			const searchInput = page.locator('input[type="text"]').first();
			await expect(searchInput).toBeVisible();

			// Type in search
			await searchInput.fill(searchPage.searchText);

			// Verify search input has value
			await expect(searchInput).toHaveValue(searchPage.searchText);
		}
	});

	test('Back navigation works correctly', async ({ page }) => {
		// Start at dashboard
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');

		// Navigate to events
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');
		await expect(page.locator('h1')).toContainText('Events');

		// Navigate to clients
		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');
		await expect(page.locator('h1')).toContainText('Clients');

		// Go back
		await page.goBack();
		await page.waitForURL('**/events');
		await expect(page.locator('h1')).toContainText('Events');

		// Go back again
		await page.goBack();
		await page.waitForURL('**/');
		await expect(page.locator('h1')).toContainText('Welcome to Ringmaster');
	});

	test('Forward navigation works correctly', async ({ page }) => {
		// Navigate through pages
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');

		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');

		// Go back twice
		await page.goBack();
		await page.goBack();

		// Go forward
		await page.goForward();
		await page.waitForURL('**/events');
		await expect(page.locator('h1')).toContainText('Events');

		// Go forward again
		await page.goForward();
		await page.waitForURL('**/clients');
		await expect(page.locator('h1')).toContainText('Clients');
	});

	test('Mobile menu works on all pages', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		const pages = ['/', '/events', '/clients', '/performers', '/agents', '/contracts', '/tasks'];

		for (const url of pages) {
			await page.goto(`http://localhost:3000${url}`);
			await page.waitForTimeout(2000);

			// Find and click mobile menu button (hamburger icon)
			const menuButton = page
				.locator('button')
				.filter({ hasText: /menu/i })
				.or(page.locator('button[aria-label*="menu"]'))
				.or(page.locator('button:has(svg)').first());

			// If mobile menu exists, test it
			if (await menuButton.isVisible()) {
				await menuButton.click();
				await page.waitForTimeout(500); // Wait for menu animation

				// Menu should be visible
				const mobileNav = page.locator('nav').last();
				await expect(mobileNav).toBeVisible();
			}
		}
	});

	test('All pages are responsive', async ({ page }) => {
		const viewports = [
			{ width: 375, height: 667, name: 'Mobile' },
			{ width: 768, height: 1024, name: 'Tablet' },
			{ width: 1920, height: 1080, name: 'Desktop' }
		];

		const pages = ['/', '/events', '/clients', '/performers', '/agents', '/contracts', '/tasks'];

		for (const viewport of viewports) {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });

			for (const url of pages) {
				await page.goto(`http://localhost:3000${url}`);
				await page.waitForTimeout(2000);

				// Check that h1 is visible (basic responsiveness check)
				await expect(page.locator('h1')).toBeVisible();

				// Check for horizontal scroll (should not exist)
				const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
				const viewportWidth = viewport.width;
				expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // Allow 20px tolerance
			}
		}
	});
});
