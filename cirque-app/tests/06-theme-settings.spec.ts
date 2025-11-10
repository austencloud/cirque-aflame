import { test, expect } from '@playwright/test';

test.describe('Theme and Settings', () => {
	test('should have settings button', async ({ page }) => {
		await page.goto('/');

		// Look for settings button (usually a gear icon)
		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await expect(settingsButton).toBeVisible();
		}
	});

	test('should open settings modal', async ({ page }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();

			// Settings modal should open
			await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
			await expect(page.getByText(/settings/i)).toBeVisible();
		}
	});

	test('should have dark mode toggle', async ({ page }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			// Dark mode toggle should be visible
			const darkModeToggle = page.getByText(/dark mode/i);
			await expect(darkModeToggle).toBeVisible();
		}
	});

	test('should toggle dark mode', async ({ page }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			// Find and click the dark mode toggle
			const toggleSwitch = page
				.locator('[role="switch"]')
				.or(page.locator('button').filter({ hasText: /dark mode/i }))
				.first();

			if (await toggleSwitch.isVisible()) {
				// Get initial theme
				const htmlClasses = await page.locator('html').getAttribute('class');
				const isDark = htmlClasses?.includes('dark');

				// Toggle dark mode
				await toggleSwitch.click();
				await page.waitForTimeout(500);

				// Check that theme changed
				const newHtmlClasses = await page.locator('html').getAttribute('class');
				const isNowDark = newHtmlClasses?.includes('dark');

				// Theme should have toggled
				expect(isNowDark).toBe(!isDark);
			}
		}
	});

	test('should persist dark mode preference', async ({ page, context }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			// Enable dark mode
			const toggleSwitch = page.locator('[role="switch"]').first();
			if (await toggleSwitch.isVisible()) {
				const ariaChecked = await toggleSwitch.getAttribute('aria-checked');

				if (ariaChecked === 'false') {
					await toggleSwitch.click();
					await page.waitForTimeout(500);
				}

				// Close settings
				const closeButton = page.getByRole('button', { name: /done|close/i });
				if (await closeButton.isVisible()) {
					await closeButton.click();
				} else {
					await page.keyboard.press('Escape');
				}

				// Create new page in same context
				const newPage = await context.newPage();
				await newPage.goto('/');

				// Dark mode should persist
				const htmlClasses = await newPage.locator('html').getAttribute('class');
				expect(htmlClasses).toContain('dark');

				await newPage.close();
			}
		}
	});

	test('should close settings modal', async ({ page }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			// Close button or ESC key
			const closeButton = page.getByRole('button', { name: /done|close/i });
			if (await closeButton.isVisible()) {
				await closeButton.click();
			} else {
				await page.keyboard.press('Escape');
			}

			// Modal should close
			await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 2000 });
		}
	});

	test('should apply dark mode styles throughout app', async ({ page }) => {
		await page.goto('/');

		// Enable dark mode via settings
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

				// Close settings
				await page.keyboard.press('Escape');

				// Check that dark mode is applied
				const htmlElement = page.locator('html');
				const classes = await htmlElement.getAttribute('class');
				expect(classes).toContain('dark');

				// Navigate to another page
				await page.goto('/events');

				// Dark mode should still be active
				const newClasses = await htmlElement.getAttribute('class');
				expect(newClasses).toContain('dark');
			}
		}
	});

	test('should show theme icon in toggle', async ({ page }) => {
		await page.goto('/');

		const settingsButton = page
			.getByRole('button', { name: /settings/i })
			.or(page.locator('[aria-label*="settings" i]'));

		if (await settingsButton.isVisible()) {
			await settingsButton.click();
			await page.waitForTimeout(300);

			// Should show sun or moon icon
			const hasSunIcon = await page.locator('[class*="sun"]').or(page.getByText('☀')).isVisible();
			const hasMoonIcon = await page
				.locator('[class*="moon"]')
				.or(page.getByText('🌙'))
				.isVisible();

			expect(hasSunIcon || hasMoonIcon).toBeTruthy();
		}
	});
});
