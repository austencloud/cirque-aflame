# Ringmaster E2E Tests with Playwright

Comprehensive end-to-end test suite for Ringmaster application, ensuring all functionality works correctly after the Svelte 5 migration.

## 🧪 Test Coverage

### Test Suites

1. **Navigation Tests** (`01-navigation.spec.ts`)

   - Page navigation and routing
   - Active state highlighting
   - Mobile menu functionality
   - Back navigation

2. **Dashboard Tests** (`02-dashboard.spec.ts`)

   - Dashboard cards display
   - Metrics formatting
   - Sections visibility
   - Navigation from cards
   - Loading states

3. **Events Tests** (`03-events.spec.ts`)

   - Events list view
   - Calendar view toggle
   - Search functionality
   - Status filtering
   - Event detail pages
   - New event creation
   - Empty states

4. **Clients Tests** (`04-clients.spec.ts`)

   - Client list display
   - Search and filters
   - Client detail pages
   - Add client functionality
   - Client status badges
   - Empty states

5. **Performers Tests** (`05-performers.spec.ts`)

   - Performer list display
   - Skill filtering
   - Search functionality
   - Performer details
   - Availability information
   - Empty states

6. **Theme & Settings Tests** (`06-theme-settings.spec.ts`)

   - Settings modal
   - Dark mode toggle
   - Theme persistence
   - Theme application across pages
   - Modal interactions

7. **State Management Tests** (`07-state-management.spec.ts`)
   - State persistence across navigation
   - Reactive data loading
   - Search and filter state
   - Error handling
   - Browser back/forward
   - Page refresh handling

## 🚀 Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install
```

### Run All Tests

```bash
# Run all tests in headless mode
npm test

# Run all tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests step-by-step
npm run test:debug
```

### Run Specific Tests

```bash
# Run single test file
npx playwright test tests/01-navigation.spec.ts

# Run tests matching pattern
npx playwright test navigation

# Run specific test by name
npx playwright test -g "should navigate to Events page"
```

### Run on Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit

# Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:

- Test results summary
- Screenshots of failures
- Video recordings (if enabled)
- Trace viewer for debugging

## 🎯 Test Configuration

Configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:5173`
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Auto-start dev server**: Yes

## 📝 Writing New Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
	test.beforeEach(async ({ page }) => {
		// Setup before each test
		await page.goto('/your-page');
	});

	test('should do something', async ({ page }) => {
		// Arrange: Set up test data

		// Act: Perform actions
		await page.getByRole('button', { name: 'Click Me' }).click();

		// Assert: Verify results
		await expect(page.getByText('Success')).toBeVisible();
	});
});
```

### Best Practices

1. **Use Semantic Locators**

   ```typescript
   // ✅ Good - Use role and accessible names
   page.getByRole('button', { name: 'Submit' });
   page.getByLabel('Email');
   page.getByText('Welcome');

   // ❌ Bad - Brittle CSS selectors
   page.locator('.btn-primary');
   page.locator('#email-input');
   ```

2. **Wait for States**

   ```typescript
   // Wait for network to be idle
   await page.waitForLoadState('networkidle');

   // Wait for specific element
   await expect(page.getByText('Loaded')).toBeVisible();
   ```

3. **Handle Optional Elements**

   ```typescript
   const button = page.getByRole('button', { name: 'Optional' });
   if (await button.isVisible()) {
   	await button.click();
   }
   ```

4. **Test Happy Path and Edge Cases**
   - Empty states
   - Error states
   - Loading states
   - Different data scenarios

## 🐛 Debugging Tests

### Interactive Debug Mode

```bash
npm run test:debug
```

This opens the Playwright Inspector where you can:

- Step through tests
- Pause execution
- Inspect locators
- See network requests

### Screenshots and Videos

Screenshots are automatically captured on failure.

Enable video recording in `playwright.config.ts`:

```typescript
use: {
	video: 'retain-on-failure';
}
```

### Trace Viewer

Traces are automatically captured on first retry.

View trace:

```bash
npx playwright show-trace trace.zip
```

## 🔧 Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill process on port (Windows)
netstat -ano | findstr :5173
taskkill /PID <pid> /F

# Or change port in playwright.config.ts
baseURL: 'http://localhost:5174'
```

### Flaky Tests

Add explicit waits:

```typescript
await page.waitForTimeout(500);
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

### Test Timeouts

Increase timeout for slow tests:

```typescript
test('slow test', async ({ page }) => {
	test.setTimeout(60000); // 60 seconds
	// ... test code
});
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [SvelteKit Testing](https://kit.svelte.dev/docs/testing)

## ✅ Test Results

Expected results after migration:

- ✅ All navigation working
- ✅ State management (Svelte 5 runes) functioning correctly
- ✅ Theme persistence working
- ✅ All pages loading without errors
- ✅ Forms and interactions working
- ✅ Responsive design on mobile

---

**Created**: October 22, 2025
**Last Updated**: October 22, 2025
**Framework**: Playwright 1.56+
**Svelte Version**: 5.15.0
