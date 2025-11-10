/**
 * Theme Service Implementation
 */

import type { IThemeService } from '../contracts/IThemeService';
import type { ThemeName, Theme, ThemeColors } from '../../domain';
import { THEMES, AVAILABLE_THEMES } from '../../domain';

export class ThemeService implements IThemeService {
	getAvailableThemes(): ThemeName[] {
		return [...AVAILABLE_THEMES];
	}

	getTheme(name: ThemeName): Theme {
		const theme = THEMES[name];
		if (!theme) {
			throw new Error(`Theme "${name}" not found`);
		}
		return theme;
	}

	getThemeColors(name: ThemeName): ThemeColors {
		return this.getTheme(name).colors;
	}

	themeExists(name: ThemeName): boolean {
		return name in THEMES;
	}

	getThemeCSSVariables(name: ThemeName): Record<string, string> {
		const colors = this.getThemeColors(name);
		return {
			'--theme-primary': colors.primary,
			'--theme-secondary': colors.secondary,
			'--theme-accent': colors.accent,
			'--theme-text': colors.text,
			'--theme-background': colors.background,
			'--theme-border': colors.border
		};
	}
}
