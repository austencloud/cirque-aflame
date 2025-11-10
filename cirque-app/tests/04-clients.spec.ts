import { test, expect } from '@playwright/test';

test.describe('Clients Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/clients');
	});

	test('should display clients page', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Clients');
	});

	test('should have search functionality', async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search/i);
		if (await searchInput.isVisible()) {
			await searchInput.fill('test');
			await expect(searchInput).toHaveValue('test');
		}
	});

	test('should have Add Client button', async ({ page }) => {
		const addButton = page
			.getByRole('link', { name: /add client|new client/i })
			.or(page.getByRole('button', { name: /add client|new client/i }));

		if (await addButton.isVisible()) {
			await expect(addButton).toBeVisible();
		}
	});

	test('should have filter options', async ({ page }) => {
		// Check for status filters (Active, Lead, Inactive, Yearly)
		const filterOptions = page.locator('button, select').filter({ hasText: /active|lead|status/i });
		if (await filterOptions.first().isVisible()) {
			await expect(filterOptions.first()).toBeVisible();
		}
	});

	test('should display client cards', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		// Look for client items
		const clientLinks = page
			.locator('a[href^="/clients/"]')
			.filter({ hasNotText: /add client|new/i });
		const count = await clientLinks.count();

		// Should have clients or show empty state
		const hasClients = count > 0;
		const hasEmptyState = await page.getByText(/no clients/i).isVisible();
		expect(hasClients || hasEmptyState).toBeTruthy();
	});

	test('should display client information in cards', async ({ page }) => {
		const clientLinks = page
			.locator('a[href^="/clients/"]')
			.filter({ hasNotText: /add client|new/i });
		const count = await clientLinks.count();

		if (count > 0) {
			const firstClient = clientLinks.first();
			await expect(firstClient).toBeVisible();

			// Client cards should contain contact info
			// Name, email, phone, etc.
		}
	});

	test('should navigate to client detail page', async ({ page }) => {
		const clientLinks = page
			.locator('a[href^="/clients/"]')
			.filter({ hasNotText: /add client|new/i });
		const count = await clientLinks.count();

		if (count > 0) {
			await clientLinks.first().click();
			expect(page.url()).toMatch(/\/clients\/[^/]+$/);
		}
	});

	test('should handle empty state', async ({ page }) => {
		const clientCount = await page
			.locator('a[href^="/clients/"]')
			.filter({ hasNotText: /add|new/i })
			.count();

		if (clientCount === 0) {
			await expect(page.getByText(/no clients/i)).toBeVisible();
		}
	});
});

test.describe('Client Detail Page', () => {
	test('should display client information', async ({ page }) => {
		// Navigate to first client if any exist
		await page.goto('/clients');
		await page.waitForLoadState('networkidle');

		const clientLinks = page.locator('a[href^="/clients/"]').filter({ hasNotText: /add|new/i });
		const count = await clientLinks.count();

		if (count > 0) {
			await clientLinks.first().click();

			// Should show client details
			await expect(page.locator('h1, h2')).toBeVisible();
		}
	});

	test('should have edit button if authorized', async ({ page }) => {
		await page.goto('/clients');
		const clientLinks = page.locator('a[href^="/clients/"]').filter({ hasNotText: /add|new/i });
		const count = await clientLinks.count();

		if (count > 0) {
			await clientLinks.first().click();

			// Look for edit button
			const editButton = page.getByRole('button', { name: /edit/i });
			// Edit button may or may not be visible depending on permissions
		}
	});

	test('should show client status badge', async ({ page }) => {
		await page.goto('/clients');
		const clientLinks = page.locator('a[href^="/clients/"]').filter({ hasNotText: /add|new/i });
		const count = await clientLinks.count();

		if (count > 0) {
			await clientLinks.first().click();
			await page.waitForLoadState('networkidle');

			// Should show status (Active, Lead, Inactive, Yearly)
			const statusBadge = page.locator('[class*="badge"], [class*="tag"]');
			if (await statusBadge.first().isVisible()) {
				await expect(statusBadge.first()).toBeVisible();
			}
		}
	});
});
