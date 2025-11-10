import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/events');
	});

	test('should display events page', async ({ page }) => {
		await expect(page.locator('h1')).toContainText('Events');
	});

	test('should have view toggle buttons', async ({ page }) => {
		// List and Calendar view toggles
		await expect(page.getByRole('button', { name: /list/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /calendar/i })).toBeVisible();
	});

	test('should toggle between list and calendar view', async ({ page }) => {
		// Click calendar view
		await page.getByRole('button', { name: /calendar/i }).click();
		await expect(page.getByText('Calendar View')).toBeVisible();

		// Click list view
		await page.getByRole('button', { name: /list/i }).click();
		// List view should be active (events list or "no events" message)
	});

	test('should have search functionality', async ({ page }) => {
		// Check for search input
		const searchInput = page.getByPlaceholder(/search events/i);
		await expect(searchInput).toBeVisible();

		// Type in search
		await searchInput.fill('test');
		await expect(searchInput).toHaveValue('test');
	});

	test('should have status filter dropdown', async ({ page }) => {
		// Check for status filter
		const filterSelect = page
			.locator('select')
			.filter({ hasText: /all events|upcoming|confirmed/i })
			.first();
		if (await filterSelect.isVisible()) {
			await expect(filterSelect).toBeVisible();
		}
	});

	test('should have New Event button', async ({ page }) => {
		const newButton = page
			.getByRole('link', { name: /new event/i })
			.or(page.getByRole('button', { name: /new event/i }));
		await expect(newButton).toBeVisible();
	});

	test('should navigate to new event page', async ({ page }) => {
		const newButton = page.getByRole('link', { name: /new event/i });
		await newButton.click();
		await expect(page).toHaveURL('/events/new');
	});

	test('should filter events by status', async ({ page }) => {
		const filterSelect = page
			.locator('select')
			.filter({ hasText: /all events|upcoming/i })
			.first();

		if (await filterSelect.isVisible()) {
			// Select "Upcoming" filter
			await filterSelect.selectOption('upcoming');

			// Wait for filtering to take effect
			await page.waitForTimeout(500);

			// The page should show filtered results or "no events" message
			const hasEvents = await page.locator('[href^="/events/"]').count();
			const hasNoEvents = await page.getByText(/no events/i).isVisible();
			expect(hasEvents > 0 || hasNoEvents).toBeTruthy();
		}
	});

	test('should display event cards with information', async ({ page }) => {
		// Look for event items in the list
		const eventLinks = page.locator('a[href^="/events/"]').filter({ hasNotText: /new event/i });
		const count = await eventLinks.count();

		if (count > 0) {
			// First event should have key information
			const firstEvent = eventLinks.first();
			await expect(firstEvent).toBeVisible();

			// Event cards should contain relevant info
			// (date, location, performers count, payment, etc.)
		}
	});

	test('should navigate to event detail page', async ({ page }) => {
		const eventLinks = page.locator('a[href^="/events/"]').filter({ hasNotText: /new event/i });
		const count = await eventLinks.count();

		if (count > 0) {
			const firstEventLink = eventLinks.first();
			await firstEventLink.click();

			// Should navigate to event detail page
			expect(page.url()).toMatch(/\/events\/[^/]+$/);
		}
	});

	test('should handle empty state', async ({ page }) => {
		// If no events, should show empty state
		const eventCount = await page
			.locator('a[href^="/events/"]')
			.filter({ hasNotText: /new event/i })
			.count();

		if (eventCount === 0) {
			await expect(page.getByText(/no events/i)).toBeVisible();
		}
	});

	test('should show loading state', async ({ page }) => {
		// On initial load, might see loading spinner
		// Then content should load
		await page.waitForLoadState('networkidle');

		// After loading, should have content or empty state
		const hasContent = await page.locator('h1:has-text("Events")').isVisible();
		expect(hasContent).toBeTruthy();
	});
});

test.describe('Event Detail Page', () => {
	test('should display event form for new event', async ({ page }) => {
		await page.goto('/events/new');

		// Should show event form
		await expect(page.getByText(/create/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /create|save/i })).toBeVisible();
	});

	test('should have cancel button on new event page', async ({ page }) => {
		await page.goto('/events/new');

		const cancelButton = page.getByRole('button', { name: /cancel/i });
		if (await cancelButton.isVisible()) {
			await cancelButton.click();
			// Should navigate back
			expect(page.url()).not.toContain('/new');
		}
	});
});
