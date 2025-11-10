// lib/config/themes.ts

export interface ThemeColors {
	primary: string;
	secondary: string;
	accent: string;
	text: string;
	background: string;
}

export const AVAILABLE_THEMES = ['Professional', 'Modern', 'Classic', 'Minimal'] as const;

export type ThemeName = (typeof AVAILABLE_THEMES)[number];

const THEME_COLORS: Record<ThemeName, ThemeColors> = {
	Professional: {
		primary: '#1a3a52',
		secondary: '#2c5aa0',
		accent: '#d4af37',
		text: '#333333',
		background: '#ffffff'
	},
	Modern: {
		primary: '#2196F3',
		secondary: '#1976D2',
		accent: '#FF9800',
		text: '#212121',
		background: '#fafafa'
	},
	Classic: {
		primary: '#8B4513',
		secondary: '#A0522D',
		accent: '#DAA520',
		text: '#2F4F4F',
		background: '#FFFAF0'
	},
	Minimal: {
		primary: '#000000',
		secondary: '#333333',
		accent: '#666666',
		text: '#000000',
		background: '#ffffff'
	}
};

export function getThemeColors(themeName: ThemeName): ThemeColors {
	return THEME_COLORS[themeName] || THEME_COLORS.Professional;
}

export function getAvailableThemes(): ThemeName[] {
	return [...AVAILABLE_THEMES];
}
