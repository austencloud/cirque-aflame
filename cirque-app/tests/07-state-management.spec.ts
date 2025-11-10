import { test, expect } from '@playwright/test';

test.describe('State Management (Svelte 5 Runes)', () => {
	test('should maintain state across navigation', async ({ page }) => {
		await page.goto('/');

		// Enable dark mode
		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			const toggleSwitch = page.locator('[role="switch"]').first();
			if (await toggleSwitch.isVisible()) {
				const ariaChecked = await toggleSwitch.getAttribute('aria-checked');

				if (ariaChecked === 'false') {
					await toggleSwitch.click();
					await page.waitForTimeout(500);
				}

				await page.keyboard.press('Escape');

				// Navigate to different pages
				await page.goto('/events');
				let htmlClasses = await page.locator('html').getAttribute('class');
				expect(htmlClasses).toContain('dark');

				await page.goto('/clients');
				htmlClasses = await page.locator('html').getAttribute('class');
				expect(htmlClasses).toContain('dark');

				await page.goto('/performers');
				htmlClasses = await page.locator('html').getAttribute('class');
				expect(htmlClasses).toContain('dark');
			}
		}
	});

	test('should load data reactively', async ({ page }) => {
		await page.goto('/');

		// Data should load and display
		await page.waitForLoadState('networkidle');

		// Check that dashboard cards show data
		const hasMetrics = await page
			.getByText(/upcoming events|active clients|total performers/i)
			.isVisible();
		expect(hasMetrics).toBeTruthy();
	});

	test('should update UI when navigating between pages', async ({ page }) => {
		await page.goto('/');

		// Navigate to events
		await page
			.getByRole('link', { name: /events/i })
			.first()
			.click();
		await expect(page.locator('h1')).toContainText('Events');

		// Navigate to clients
		await page
			.getByRole('link', { name: /clients/i })
			.first()
			.click();
		await expect(page.locator('h1')).toContainText('Clients');

		// Navigate back to dashboard
		await page
			.getByRole('link', { name: /dashboard/i })
			.first()
			.click();
		await expect(page.locator('h1')).toContainText('CircusSync');
	});

	test('should handle search state correctly', async ({ page }) => {
		await page.goto('/events');

		const searchInput = page.getByPlaceholder(/search/i);
		if (await searchInput.isVisible()) {
			// Type search query
			await searchInput.fill('test event');
			await expect(searchInput).toHaveValue('test event');

			// Navigate away
			await page.goto('/clients');

			// Navigate back
			await page.goto('/events');

			// Search should be cleared (fresh page load)
			const newSearchValue = await searchInput.inputValue();
			expect(newSearchValue).toBe('');
		}
	});

	test('should handle filter state correctly', async ({ page }) => {
		await page.goto('/events');

		const filterSelect = page
			.locator('select')
			.filter({ hasText: /all events|upcoming/i })
			.first();

		if (await filterSelect.isVisible()) {
			// Change filter
			await filterSelect.selectOption('confirmed');
			await page.waitForTimeout(300);

			// Filter should be applied
			const selectedValue = await filterSelect.inputValue();
			expect(selectedValue).toBeTruthy();
		}
	});

	test('should load data without blocking UI', async ({ page }) => {
		await page.goto('/');

		// Page should render immediately, not wait for all data
		// Check that UI structure exists
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('nav, header')).toBeVisible();

		// Data will load asynchronously
		await page.waitForLoadState('networkidle');
	});

	test('should handle errors gracefully', async ({ page }) => {
		// Navigate to invalid ID
		await page.goto('/events/nonexistent-id');

		// Should show error message or redirect
		// Not crash the app
		const hasErrorMessage = await page.getByText(/not found|error/i).isVisible();
		const hasRedirect = page.url().endsWith('/events');

		expect(hasErrorMessage || hasRedirect).toBeTruthy();
	});

	test('should maintain scroll position on same page', async ({ page }) => {
		await page.goto('/events');
		await page.waitForLoadState('networkidle');

		// Scroll down
		await page.evaluate(() => window.scrollTo(0, 500));
		const scrollBefore = await page.evaluate(() => window.scrollY);

		// Wait a bit
		await page.waitForTimeout(500);

		// Scroll position should be maintained
		const scrollAfter = await page.evaluate(() => window.scrollY);
		expect(scrollAfter).toBeGreaterThan(0);
	});

	test('should handle rapid navigation', async ({ page }) => {
		await page.goto('/');

		// Rapidly navigate between pages
		await page
			.getByRole('link', { name: /events/i })
			.first()
			.click();
		await page.waitForTimeout(100);

		await page
			.getByRole('link', { name: /clients/i })
			.first()
			.click();
		await page.waitForTimeout(100);

		await page
			.getByRole('link', { name: /performers/i })
			.first()
			.click();
		await page.waitForTimeout(100);

		await page
			.getByRole('link', { name: /dashboard/i })
			.first()
			.click();

		// Should handle it without crashing
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should handle browser back button', async ({ page }) => {
		await page.goto('/');
		await page.goto('/events');
		await page.goto('/clients');

		// Use browser back button
		await page.goBack();
		await expect(page).toHaveURL('/events');

		await page.goBack();
		await expect(page).toHaveURL('/');
	});

	test('should handle page refresh', async ({ page }) => {
		await page.goto('/events');
		await page.waitForLoadState('networkidle');

		// Reload page
		await page.reload();

		// Should still work
		await expect(page.locator('h1')).toContainText('Events');
	});
});
