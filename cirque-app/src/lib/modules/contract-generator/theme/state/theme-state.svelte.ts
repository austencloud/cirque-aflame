/**
 * Theme State Management
 * Svelte 5 runes for reactive theme state
 */

import { ThemeService } from '../services';
import type { ThemeName, ThemeColors } from '../domain';
import { DEFAULT_THEME } from '../domain';

export function createThemeState() {
	const themeService = new ThemeService();

	let currentTheme = $state<ThemeName>(DEFAULT_THEME);

	const availableThemes = $derived(() => themeService.getAvailableThemes());

	const currentColors = $derived(() => themeService.getThemeColors(currentTheme));

	const cssVariables = $derived(() => themeService.getThemeCSSVariables(currentTheme));

	function setTheme(theme: ThemeName) {
		if (themeService.themeExists(theme)) {
			currentTheme = theme;
			// Save to localStorage
			if (typeof localStorage !== 'undefined') {
				localStorage.setItem('selectedTheme', theme);
			}
		}
	}

	function loadThemeFromStorage() {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('selectedTheme') as ThemeName | null;
			if (saved && themeService.themeExists(saved)) {
				currentTheme = saved;
			}
		}
	}

	return {
		get currentTheme() {
			return currentTheme;
		},

		set currentTheme(theme: ThemeName) {
			setTheme(theme);
		},

		get availableThemes() {
			return availableThemes();
		},

		get currentColors() {
			return currentColors();
		},

		get cssVariables() {
			return cssVariables();
		},

		setTheme,
		loadThemeFromStorage
	};
}

export type ThemeState = ReturnType<typeof createThemeState>;
