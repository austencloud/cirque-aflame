import { test, expect } from '@playwright/test';

test.describe('Navigation Highlighting Regression Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Start at the dashboard
		await page.goto('http://localhost:3000/');
		await page.waitForLoadState('networkidle');
	});

	test('Dashboard link should be highlighted on homepage', async ({ page }) => {
		// Check that Dashboard link has active styling
		const dashboardLink = page.locator('a[href="/"]').first();

		// Check for active class (bg-blue-50 or bg-blue-900/20 for dark mode)
		const classes = await dashboardLink.getAttribute('class');
		expect(classes).toContain('bg-blue-50');

		// Verify aria-current is set
		const ariaCurrent = await dashboardLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');
	});

	test('Events link should be highlighted when on events page', async ({ page }) => {
		// Navigate to events
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');
		await page.waitForLoadState('networkidle');

		// Check that Events link has active styling
		const eventsLink = page.locator('a[href="/events"]').first();
		const classes = await eventsLink.getAttribute('class');
		expect(classes).toContain('bg-blue-50');

		// Verify aria-current is set
		const ariaCurrent = await eventsLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');

		// Verify Dashboard link is NOT highlighted
		const dashboardLink = page.locator('a[href="/"]').first();
		const dashboardClasses = await dashboardLink.getAttribute('class');
		expect(dashboardClasses).not.toContain('bg-blue-50');
	});

	test('Clients link should be highlighted when on clients page', async ({ page }) => {
		// Navigate to clients
		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');
		await page.waitForLoadState('networkidle');

		// Check that Clients link has active styling
		const clientsLink = page.locator('a[href="/clients"]').first();
		const classes = await clientsLink.getAttribute('class');
		expect(classes).toContain('bg-blue-50');

		// Verify aria-current is set
		const ariaCurrent = await clientsLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');
	});

	test('Performers link should be highlighted when on performers page', async ({ page }) => {
		// Navigate to performers
		await page.click('a[href="/performers"]');
		await page.waitForURL('**/performers');
		await page.waitForLoadState('networkidle');

		// Check that Performers link has active styling
		const performersLink = page.locator('a[href="/performers"]').first();
		const classes = await performersLink.getAttribute('class');
		expect(classes).toContain('bg-blue-50');

		// Verify aria-current is set
		const ariaCurrent = await performersLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');
	});

	test('Agents link should be highlighted when on agents page', async ({ page }) => {
		// Navigate to agents
		await page.click('a[href="/agents"]');
		await page.waitForURL('**/agents');
		await page.waitForLoadState('networkidle');

		// Check that Agents link has active styling
		const agentsLink = page.locator('a[href="/agents"]').first();
		const classes = await agentsLink.getAttribute('class');
		expect(classes).toContain('bg-blue-50');

		// Verify aria-current is set
		const ariaCurrent = await agentsLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');
	});

	test('Navigation highlighting should update immediately on click', async ({ page }) => {
		// Start on dashboard - verify Dashboard is highlighted
		let dashboardLink = page.locator('a[href="/"]').first();
		let dashboardClasses = await dashboardLink.getAttribute('class');
		expect(dashboardClasses).toContain('bg-blue-50');

		// Click Events link
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');

		// Verify Events is now highlighted (should happen immediately)
		const eventsLink = page.locator('a[href="/events"]').first();
		const eventsClasses = await eventsLink.getAttribute('class');
		expect(eventsClasses).toContain('bg-blue-50');

		// Verify Dashboard is no longer highlighted
		dashboardLink = page.locator('a[href="/"]').first();
		dashboardClasses = await dashboardLink.getAttribute('class');
		expect(dashboardClasses).not.toContain('bg-blue-50');
	});

	test('Navigation highlighting should work with browser back button', async ({ page }) => {
		// Navigate to events
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');

		// Verify Events is highlighted
		let eventsLink = page.locator('a[href="/events"]').first();
		let eventsClasses = await eventsLink.getAttribute('class');
		expect(eventsClasses).toContain('bg-blue-50');

		// Navigate to clients
		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');

		// Verify Clients is highlighted
		const clientsLink = page.locator('a[href="/clients"]').first();
		const clientsClasses = await clientsLink.getAttribute('class');
		expect(clientsClasses).toContain('bg-blue-50');

		// Go back using browser back button
		await page.goBack();
		await page.waitForURL('**/events');

		// Verify Events is highlighted again
		eventsLink = page.locator('a[href="/events"]').first();
		eventsClasses = await eventsLink.getAttribute('class');
		expect(eventsClasses).toContain('bg-blue-50');

		// Verify Clients is no longer highlighted
		const clientsLinkAfterBack = page.locator('a[href="/clients"]').first();
		const clientsClassesAfterBack = await clientsLinkAfterBack.getAttribute('class');
		expect(clientsClassesAfterBack).not.toContain('bg-blue-50');
	});

	test('Navigation highlighting should work with rapid clicks', async ({ page }) => {
		// Rapidly click through multiple pages
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');

		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');

		await page.click('a[href="/performers"]');
		await page.waitForURL('**/performers');

		await page.click('a[href="/agents"]');
		await page.waitForURL('**/agents');

		// Verify final page (Agents) is highlighted
		const agentsLink = page.locator('a[href="/agents"]').first();
		const agentsClasses = await agentsLink.getAttribute('class');
		expect(agentsClasses).toContain('bg-blue-50');

		// Verify other pages are NOT highlighted
		const eventsLink = page.locator('a[href="/events"]').first();
		const eventsClasses = await eventsLink.getAttribute('class');
		expect(eventsClasses).not.toContain('bg-blue-50');

		const clientsLink = page.locator('a[href="/clients"]').first();
		const clientsClasses = await clientsLink.getAttribute('class');
		expect(clientsClasses).not.toContain('bg-blue-50');

		const performersLink = page.locator('a[href="/performers"]').first();
		const performersClasses = await performersLink.getAttribute('class');
		expect(performersClasses).not.toContain('bg-blue-50');
	});

	test('Navigation highlighting should work on detail pages', async ({ page }) => {
		// Navigate to clients
		await page.click('a[href="/clients"]');
		await page.waitForURL('**/clients');

		// Verify Clients is highlighted
		let clientsLink = page.locator('a[href="/clients"]').first();
		let clientsClasses = await clientsLink.getAttribute('class');
		expect(clientsClasses).toContain('bg-blue-50');

		// If there are any client cards, click one to go to detail page
		const clientCards = page.locator('a[href^="/clients/"]');
		const count = await clientCards.count();

		if (count > 0) {
			// Click first client card
			await clientCards.first().click();
			await page.waitForURL('**/clients/*');

			// Verify Clients link is still highlighted (because URL starts with /clients)
			clientsLink = page.locator('a[href="/clients"]').first();
			clientsClasses = await clientsLink.getAttribute('class');
			expect(clientsClasses).toContain('bg-blue-50');
		}
	});

	test('Only one navigation link should be highlighted at a time', async ({ page }) => {
		// Navigate to events
		await page.click('a[href="/events"]');
		await page.waitForURL('**/events');
		await page.waitForLoadState('networkidle');

		// Get all navigation links
		const navLinks = page
			.locator('nav a, header a')
			.filter({ hasText: /Dashboard|Events|Clients|Performers|Agents|Contracts|Tasks/ });
		const count = await navLinks.count();

		// Count how many have active styling
		let activeCount = 0;
		for (let i = 0; i < count; i++) {
			const link = navLinks.nth(i);
			const classes = await link.getAttribute('class');
			if (classes?.includes('bg-blue-50') || classes?.includes('bg-blue-900/20')) {
				activeCount++;
			}
		}

		// Should only have exactly 1 active link
		expect(activeCount).toBe(1);
	});

	test('Navigation highlighting should persist after page reload', async ({ page }) => {
		// Navigate to performers
		await page.click('a[href="/performers"]');
		await page.waitForURL('**/performers');

		// Reload the page
		await page.reload();
		await page.waitForLoadState('networkidle');

		// Verify Performers is still highlighted after reload
		const performersLink = page.locator('a[href="/performers"]').first();
		const performersClasses = await performersLink.getAttribute('class');
		expect(performersClasses).toContain('bg-blue-50');

		// Verify aria-current is still set
		const ariaCurrent = await performersLink.getAttribute('aria-current');
		expect(ariaCurrent).toBe('page');
	});
});
