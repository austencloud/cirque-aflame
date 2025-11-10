// src/lib/state/theme.svelte.ts
// Modern Svelte 5 Runes Implementation
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

/**
 * Theme Manager - Svelte 5 Runes Implementation
 * Manages application theme with localStorage persistence and system preference detection
 */
class ThemeManager {
	// Dark mode is now permanent - always return 'dark'
	#theme = $state<Theme>('dark');

	constructor() {
		// Always initialize to dark mode
		if (browser) {
			this.#applyTheme('dark');
		}
	}

	/**
	 * Get the current theme value - always dark
	 */
	get theme(): Theme {
		return 'dark';
	}

	/**
	 * Apply dark theme to document
	 */
	#applyTheme(theme: Theme) {
		if (!browser) {
			return;
		}

		try {
			// Always apply dark mode
			document.documentElement.classList.remove('light');
			document.documentElement.classList.add('dark');
			document.documentElement.setAttribute('data-theme', 'dark');
		} catch (error) {
			console.warn('Failed to apply theme:', error);
		}
	}

	/**
	 * Set the theme - disabled, always dark
	 */
	set(theme: Theme) {
		// Do nothing - dark mode is permanent
	}

	/**
	 * Toggle - disabled, always dark
	 */
	toggle() {
		// Do nothing - dark mode is permanent
	}

	/**
	 * Initialize/reinitialize theme - always sets dark
	 */
	init() {
		if (browser) {
			this.#applyTheme('dark');
		}
	}
}

// Export singleton instance - only create in browser to avoid SSR issues
export const theme = browser ? new ThemeManager() : ({
	theme: 'dark' as Theme,
	set: () => {},
	toggle: () => {},
	init: () => {}
} as Omit<ThemeManager, '#theme' | '#applyTheme'>);
