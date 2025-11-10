/**
 * Theme Service Interface
 */

import type { ThemeName, Theme, ThemeColors } from '../../domain';

export interface IThemeService {
	/**
	 * Get all available themes
	 */
	getAvailableThemes(): ThemeName[];

	/**
	 * Get theme by name
	 */
	getTheme(name: ThemeName): Theme;

	/**
	 * Get theme colors
	 */
	getThemeColors(name: ThemeName): ThemeColors;

	/**
	 * Check if theme exists
	 */
	themeExists(name: ThemeName): boolean;

	/**
	 * Get CSS variables for theme
	 */
	getThemeCSSVariables(name: ThemeName): Record<string, string>;
}
