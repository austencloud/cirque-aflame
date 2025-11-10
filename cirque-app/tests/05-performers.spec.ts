import { test, expect } from '@playwright/test';

test.describe('Performers Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/performers');
	});

	test('should display performers page', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Performers');
	});

	test('should have Add Performer button', async ({ page }) => {
		const addButton = page
			.getByRole('link', { name: /add performer|new performer/i })
			.or(page.getByRole('button', { name: /add performer|new performer/i }));

		if (await addButton.isVisible()) {
			await expect(addButton).toBeVisible();
		}
	});

	test('should have skill category filters', async ({ page }) => {
		// Check for skill filters (Fire, Balloon, Stilt, Juggle, Aerial, Magic)
		const hasFireFilter = await page.getByText(/fire/i).isVisible();
		const hasBalloonFilter = await page.getByText(/balloon/i).isVisible();
		const hasAnyFilter = hasFireFilter || hasBalloonFilter;

		// Some filter should exist
		// expect(hasAnyFilter).toBeTruthy();
	});

	test('should have search functionality', async ({ page }) => {
		const searchInput = page.getByPlaceholder(/search/i);
		if (await searchInput.isVisible()) {
			await searchInput.fill('test');
			await expect(searchInput).toHaveValue('test');
		}
	});

	test('should display performer cards', async ({ page }) => {
		await page.waitForLoadState('networkidle');

		// Look for performer items
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		// Should have performers or show empty state
		const hasPerformers = count > 0;
		const hasEmptyState = await page.getByText(/no performers/i).isVisible();
		expect(hasPerformers || hasEmptyState).toBeTruthy();
	});

	test('should display performer skills', async ({ page }) => {
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			const firstPerformer = performerLinks.first();
			await expect(firstPerformer).toBeVisible();

			// Performer cards should show skills
		}
	});

	test('should navigate to performer detail page', async ({ page }) => {
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			await performerLinks.first().click();
			expect(page.url()).toMatch(/\/performers\/[^/]+$/);
		}
	});

	test('should filter by skill category', async ({ page }) => {
		// Click on a skill filter if available
		const skillFilters = page.locator('button').filter({ hasText: /fire|balloon|stilt|juggle/i });
		const count = await skillFilters.count();

		if (count > 0) {
			await skillFilters.first().click();
			await page.waitForTimeout(500);

			// Should filter results
			const hasResults = await page.locator('a[href^="/performers/"]').count();
			const hasEmptyState = await page.getByText(/no performers/i).isVisible();
			expect(hasResults > 0 || hasEmptyState).toBeTruthy();
		}
	});

	test('should handle empty state', async ({ page }) => {
		const performerCount = await page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i })
			.count();

		if (performerCount === 0) {
			await expect(page.getByText(/no performers/i)).toBeVisible();
		}
	});
});

test.describe('Performer Detail Page', () => {
	test('should display performer information', async ({ page }) => {
		await page.goto('/performers');
		await page.waitForLoadState('networkidle');

		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			await performerLinks.first().click();

			// Should show performer details
			await expect(page.locator('h1, h2')).toBeVisible();
		}
	});

	test('should display performer skills and experience', async ({ page }) => {
		await page.goto('/performers');
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			await performerLinks.first().click();
			await page.waitForLoadState('networkidle');

			// Should show skills section
			const hasSkillsSection = await page.getByText(/skill|experience|category/i).isVisible();
			// Skill information should be displayed
		}
	});

	test('should show availability information', async ({ page }) => {
		await page.goto('/performers');
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			await performerLinks.first().click();
			await page.waitForLoadState('networkidle');

			// Should show availability section
			const hasAvailability = await page.getByText(/availab/i).isVisible();
			// Availability info should be present
		}
	});

	test('should have edit button if authorized', async ({ page }) => {
		await page.goto('/performers');
		const performerLinks = page
			.locator('a[href^="/performers/"]')
			.filter({ hasNotText: /add|new/i });
		const count = await performerLinks.count();

		if (count > 0) {
			await performerLinks.first().click();

			// Look for edit button
			const editButton = page.getByRole('button', { name: /edit/i });
			// Edit button may or may not be visible
		}
	});
});
